/*eslint-disable*/
import _ from 'lodash';

class Alertlogchart {
  constructor(target, options) {
    const obj = {
      // default width, height(onePage)
      width: 440, // 6 * 2
      height: 200,
      // width: 220, // 2 * 3
      // height: 250,

      colors: {
        pageArea: {
          select: '#cccccc',
          deselect: '#777777',
        }
      },
      font: 'bold 12px sans-serif',
      padding: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      },

      chartArea: {
        padding: {
          top: 15,
          right: 15,
          bottom: 15,
          left: 15,
        },
        circle: {
          diameter: 45, // image의 width & height
        },
        image: {
          critical: {
            startX: 0,
            startY: 735,
          },
          warning: {
            startX: 43,
            startY: 735,
          },
          normal: {
            startX: 86,
            startY: 735,
          },
        },
        text: {
          height: 15,
          width: 45,
        },
        circleGap: 15,
      },
      pageArea: {
        width: 30,
        circle: {
          radius: 6,
        },
      },

      // canvas context style
      styleObj: {
        fill: {
          show: false,
          color: '#000000',
          text: '',
        },
        fillText: {
          show: false,
          color: '#000000',
          text: '',
        },
        stroke: {
          show: false,
          linewidth: 1,
          color: '#000000',
        },
        align: 'left',
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        font: '10px Roboto Condensed',
      },

      // instanceList: ["EXA1", "EXA2", "PN53A12201", "PP53S12201"],
      // instanceList: ["EXA1", "EXA2", "PN53A12201", "PP53S12201",
      // "EXA3", "EXA4", "PN53A12205", "PP53S12206", "EXA7", "EXA8", "PN53A12209", "PP53S12209"],
      instanceList: [],

      firstDrawFlag: true,
    };

    // parameter mapping
    this.options = _.merge({}, obj, options);


    // create & init canvas
    this.baseCanvas = document.createElement('canvas');
    this.baseCanvas.setAttribute('class', 'evui-alertlog-canvas');
    this.context = this.baseCanvas.getContext('2d');
    this.image = new Image();
    this.image.src = './guide/images/evui_icon.png';
    this.tooltip = document.createElement('div');
    this.tooltip.setAttribute('class', 'evui-alertlog-tooltip');


    // init coordinate obj
    this.coordinate = {
      // alarmArea = chartArea + pageArea
      alarmArea: {
        total: {}, // alarmCircle 전체 좌표
        // alarmArea의 column, row
        columnCount: null,
        rowCount: null,
      },
      chartArea: {
        total: {},
        data: [],
        // chartArea column, row
        columnCount: null, // width
        rowCount: null, // height
      },
      pageArea: {
        total: {},
        data: [],
        totalPage: 1,
        currPage: 1,
      },
    };

    // init
    this.init();

    // init mouse event
    this.mouseInit();

    // draw
    this.drawCanvas();

    // append dom
    if (target === null) {
      throw new Error('[EVUI][ERROR][Alarmchart]-Not found Target for rendering Alarm Chart');
    } else {
      target.appendChild(this.baseCanvas);
    }
    window.document.body.appendChild(this.tooltip);
  }

  init() {
    this.setInstanceList();
    this.initCanvasProperty();
  }

  setInstanceList() {
    this.options.instanceList = [
      "EXA1",
      "EXA2",
      "PN53A12201",
      "PP53S12201",
      "EXA3",
      "EXA4",
      "PN53A12203",
      "PP53S12204",
      "EXA5",
      "EXA6",
      "PN53A12207",
      "PP53S12208",
      "EXA9",
    ];
    // this.options.instanceList = ["EXA1", "EXA2", "PN53A12201", "PP53S12201"];
    // this.options.instanceList = ["EXA1", "EXA2", "PN53A12201", "PP53S12201",
    // "EXA3", "EXA4", "PN53A12205", "PP53S12206", "EXA7", "EXA8", "PN53A12209", "PP53S12209"];
  }

  initCanvasProperty() {
    // set total width, height
    if (this.options.width && this.options.height) {
      this.baseCanvas.width = this.options.width;
      this.baseCanvas.height = this.options.height;
    }

    // alarmArea 좌표
    const padding = this.options.padding;
    this.coordinate.alarmArea.total = {
      startX: padding.left,
      width: this.baseCanvas.width - padding.left - padding.right,
      startY: padding.top,
      height: this.baseCanvas.height - padding.top - padding.bottom,
    };

    // 한페이지 여부
    const width = this.baseCanvas.width - padding.left - padding.right; // alarmArea width
    const height = this.baseCanvas.height - padding.top - padding.bottom; // alarmArea height
    const chartAreaPadding = this.options.chartArea.padding;
    const circleGap = this.options.chartArea.circleGap;
    const circleDiameter = this.options.chartArea.circle.diameter;
    const instanceCount = this.options.instanceList.length;
    const columnCount = +Math.floor((width - chartAreaPadding.left
      - chartAreaPadding.right - circleDiameter)
      / (+circleDiameter + +circleGap)) + +1;
    this.coordinate.alarmArea.columnCount = columnCount;
    const rowCount = +Math.floor((height - chartAreaPadding.top
      - chartAreaPadding.bottom - circleDiameter)
      / (+circleDiameter + +circleGap)) + +1;
    this.coordinate.alarmArea.rowCount = rowCount;

    // 한페이지 여부에 따른 chartArea, pageArea 좌표
    const alarmAreaTotal = this.coordinate.alarmArea.total;
    const pageAreaWidth = this.options.pageArea.width;
    if (instanceCount <= columnCount * rowCount) {
      this.coordinate.pageArea.totalPage = 1;
      this.coordinate.chartArea.total = {
        startX: +alarmAreaTotal.startX + +chartAreaPadding.left,
        width: alarmAreaTotal.width - chartAreaPadding.left - chartAreaPadding.right,
        startY: +alarmAreaTotal.startY + +chartAreaPadding.top,
        height: alarmAreaTotal.height - chartAreaPadding.top - chartAreaPadding.bottom,
      };
    } else {
      this.coordinate.chartArea.total = {
        startX: +alarmAreaTotal.startX + +chartAreaPadding.left,
        width: alarmAreaTotal.width - chartAreaPadding.left
        - chartAreaPadding.right - pageAreaWidth,
        startY: +alarmAreaTotal.startY + +chartAreaPadding.top,
        height: alarmAreaTotal.height - chartAreaPadding.top - chartAreaPadding.bottom,
      };
      this.coordinate.pageArea.total = {
        startX: +alarmAreaTotal.startX + +alarmAreaTotal.width
        - chartAreaPadding.right - pageAreaWidth,
        width: pageAreaWidth,
        startY: +alarmAreaTotal.startY + +chartAreaPadding.top,
        height: alarmAreaTotal.height - chartAreaPadding.top - chartAreaPadding.bottom,
      };
    }
    // alarmArea안의 chartArea의 column * row 세팅
    this.coordinate.chartArea.columnCount =
      +Math.floor((this.coordinate.chartArea.total.width - circleDiameter)
        / (+circleDiameter + +circleGap)) + +1;
    this.coordinate.chartArea.rowCount =
      +Math.floor((this.coordinate.chartArea.total.height - circleDiameter
        - this.options.chartArea.text.height)
        / (+circleDiameter + +circleGap + +this.options.chartArea.text.height)) + +1;
    // chartArea에서의 column * row의 수로 전체 페이지 파악
    this.coordinate.pageArea.totalPage =
      Math.ceil(
        instanceCount / (this.coordinate.chartArea.columnCount * this.coordinate.chartArea.rowCount)
      );
  }

  mouseInit() {
    this.initMouseclick();
    this.initMouseover();
    this.initMouseleave();
  }

  initMouseclick() {
    this.baseCanvas.addEventListener('click', (e) => {
      e.preventDefault();
      const pageAreaTotal = this.coordinate.pageArea.total;
      // page
      if (e.offsetX > pageAreaTotal.startX
        && e.offsetX < +pageAreaTotal.startX + +pageAreaTotal.width
        && e.offsetY > pageAreaTotal.startY
        && e.offsetY < +pageAreaTotal.startY + +pageAreaTotal.height
      ) {
        const chartAreaData = this.coordinate.pageArea.data;
        const pageRadius = this.options.pageArea.circle.radius;
        chartAreaData.forEach((v) => {
          const deltaX = e.offsetX - v.centerX;
          const deltaY = e.offsetY - v.centerY;
          if (v.currPage !== this.coordinate.pageArea.currPage) {
            if (+(deltaX * deltaX) + +(deltaY * deltaY) < pageRadius * pageRadius) {
              this.coordinate.pageArea.currPage = v.currPage;
              this.drawPageData();
              this.drawChartData();
            }
          }
        });
      }
    });
  }
  initMouseover() {
    this.baseCanvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      const chartAreaTotal = this.coordinate.chartArea.total;
      const pageAreaTotal = this.coordinate.pageArea.total;
      let exist = false;

      // chart
      if (e.offsetX > chartAreaTotal.startX
        && e.offsetX < +chartAreaTotal.startX + +chartAreaTotal.width
        && e.offsetY > +chartAreaTotal.startY
        && e.offsetY < +chartAreaTotal.startY + +chartAreaTotal.height
      ) {
        const chartAreaData = this.coordinate.chartArea.data;
        const diameter = this.options.chartArea.circle.diameter;
        const radius = this.options.chartArea.circle.diameter / 2;
        const textHeight = this.options.chartArea.text.height;
        chartAreaData.forEach((v) => {
          // inner circle area
          const deltaX = e.offsetX - v.centerX;
          const deltaY = e.offsetY - v.centerY;
          if (+(deltaX * deltaX) + +(deltaY * deltaY) < radius * radius) {
            exist = true;
          }
          // inner label area under circle
          if (e.offsetX > v.startX
            && e.offsetX < +v.startX + +diameter
            && e.offsetY > +v.startY + +diameter
            && e.offsetY < +(+v.startY + +diameter) + +textHeight
          ) {
            exist = true;
          }
        });
      }
      // page
      if (e.offsetX > pageAreaTotal.startX
        && e.offsetX < +pageAreaTotal.startX + +pageAreaTotal.width
        && e.offsetY > pageAreaTotal.startY
        && e.offsetY < +pageAreaTotal.startY + +pageAreaTotal.height
      ) {
        const chartAreaData = this.coordinate.pageArea.data;
        const pageRadius = this.options.pageArea.circle.radius;
        chartAreaData.forEach((v) => {
          const deltaX = e.offsetX - v.centerX;
          const deltaY = e.offsetY - v.centerY;
          if (+(deltaX * deltaX) + +(deltaY * deltaY) < pageRadius * pageRadius) {
            exist = true;
          }
        });
      }

      if (exist) {
        this.baseCanvas.style.cursor = 'pointer';
      } else {
        this.baseCanvas.style.cursor = 'default';
      }
    });
  }
  initMouseleave() {
    this.baseCanvas.addEventListener('mouseleave', (e) => {
      e.preventDefault();

    });
  }

  drawCanvas() {
    this.drawAlarmArea();
    this.initChartData();
    this.setChartData();
    if (this.coordinate.pageArea.totalPage > 1) {
      this.initPageData();
      this.drawPageData();
    }
  }

  drawAlarmArea() {
    const ctx = this.context;
    const alarmAreaTotal = this.coordinate.alarmArea.total;
    this.dynamicDraw(
      ctx, alarmAreaTotal.startX, alarmAreaTotal.startY,
      alarmAreaTotal.width, alarmAreaTotal.height,
      {
        stroke: {
          show: true,
        }
      }
    );
    // const chartAreaTotal = this.coordinate.chartArea.total;
    // this.dynamicDraw(
    //   ctx, chartAreaTotal.startX, chartAreaTotal.startY,
    //   chartAreaTotal.width, chartAreaTotal.height,
    //   {
    //     stroke: {
    //       show: true,
    //       color: '#f00',
    //     }
    //   }
    // );
    // const pageAreaTotal = this.coordinate.pageArea.total;
    // this.dynamicDraw(
    //   ctx, pageAreaTotal.startX, pageAreaTotal.startY,
    //   pageAreaTotal.width, pageAreaTotal.height,
    //   {
    //     stroke: {
    //       show: true,
    //       color: '#0f0',
    //     }
    //   }
    // );
  }

  // set chart data
  // changedObj 존재O > chartArea.data 중 changeObj와 instanceName이 동일한 데이터 alarmLevel 변경
  // changedObj 존재X > chartArea.data전체 데이터 init set
  initChartData(changedObj) {
    if (changedObj) {
      this.coordinate.chartArea.data.forEach((v, idx) => {
        if (v.instanceName === changedObj.instanceName) {
          this.coordinate.chartArea.data[idx].alarmLevel = changedObj.alarmLevel;
        }
      });
    } else {
      this.coordinate.chartArea.data = [];
      const ctx = this.context;
      const instanceList = this.options.instanceList;
      const diameter = this.options.chartArea.circle.diameter;
      const columnCount = this.coordinate.chartArea.columnCount;
      const rowCount = this.coordinate.chartArea.rowCount;
      const circleGap = this.options.chartArea.circleGap;
      const circleText = this.options.chartArea.text.height;
      const chartAreaTotal = this.coordinate.chartArea.total;
      let columnIdx = 0;
      let rowIdx = 0; // 전체 row idx
      let onePageRowIdx = 0; // 한페이지 row idx
      let circleObj = {};
      instanceList.forEach((instanceName, idx) => {
        circleObj = {};
        rowIdx = Math.floor(idx / columnCount);
        onePageRowIdx = rowIdx % rowCount;
        columnIdx = idx % columnCount;
        circleObj = {
          startX: +chartAreaTotal.startX +
            +(columnIdx * (+diameter + +circleGap)),
          startY: +chartAreaTotal.startY +
            +(onePageRowIdx * (+diameter + +circleGap + +circleText)),
          centerX: +chartAreaTotal.startX +
            +(columnIdx * (+diameter + +circleGap)) + +(diameter / 2),
          centerY: +chartAreaTotal.startY +
            +(onePageRowIdx * (+diameter + +circleGap + +circleText)) + +(diameter / 2),
          radius: diameter / 2,
          alarmLevel: 'normal',
          currPage: +Math.floor(rowIdx / rowCount) + +1,
          instanceName: instanceName,
          ellipsisName: this.ellipsisString(ctx, instanceName, diameter),
        };
        this.coordinate.chartArea.data.push(circleObj);
      });
    }
  }

  // draw chart data
  // changedObj 존재O > this.coordinate.chartArea.data의 alarmLevel 변경
  // changedObj 존재X > this.coordinate.chartArea.data전체 데이터 init set
  setChartData(changedObj) {
    const ctx = this.context;
    const diameter = this.options.chartArea.circle.diameter;
    const chartAreaImage = this.options.chartArea.image;
    let condition = true;
    if (this.options.firstDrawFlag) {
      this.image.onload = () => this.drawChartData();
      this.options.firstDrawFlag = false;
    } else {
      this.drawChartData(changedObj);
    }
  }

  drawChartData(changedObj) {
    const ctx = this.context;
    const diameter = this.options.chartArea.circle.diameter;
    const chartAreaImage = this.options.chartArea.image;
    let condition = true;

    if (changedObj) {
      if (changedObj.instanceName) {
        this.coordinate.chartArea.data.forEach((v) => {
          condition = v.instanceName === changedObj.instanceName;
          if (v.alarmLevel && this.coordinate.pageArea.currPage === v.currPage) {
            if (condition) {
              const alarmLevelImage = chartAreaImage[v.alarmLevel];
              if (alarmLevelImage.startX && alarmLevelImage.startY) {
                this.clearCanvas(
                  ctx,
                  v.startX, v.startY,
                  diameter, +diameter + +this.options.chartArea.text.height,
                );
                ctx.drawImage(
                  this.image,
                  alarmLevelImage.startX, alarmLevelImage.startY, diameter, diameter,
                  v.startX, v.startY, diameter, diameter,
                );
                this.dynamicDraw(
                  ctx,
                  v.startX, +v.startY + +diameter,
                  diameter, this.options.chartArea.text.height,
                  {
                    fillText: {
                      show: true,
                      text: v.ellipsisName,
                    },
                    align: 'center',
                    font: '11px Roboto Condensed',
                  }
                );
              }
            }
          }
        });
      }
    } else {
      const chartAreaTotal = this.coordinate.chartArea.total;
      this.clearCanvas(ctx, chartAreaTotal.startX, chartAreaTotal.startY, chartAreaTotal.width, chartAreaTotal.height);
      this.coordinate.chartArea.data.forEach((v) => {
        if (v.alarmLevel && this.coordinate.pageArea.currPage === v.currPage) {
          const alarmLevelImage = chartAreaImage[v.alarmLevel];
          if (alarmLevelImage.startX && alarmLevelImage.startY) {
            ctx.drawImage(
              this.image,
              alarmLevelImage.startX, alarmLevelImage.startY, diameter, diameter,
              v.startX, v.startY, diameter, diameter,
            );
            this.dynamicDraw(
              ctx,
              v.startX, +v.startY + +diameter,
              diameter, this.options.chartArea.text.height,
              {
                fillText: {
                  show: true,
                  text: v.ellipsisName,
                },
                align: 'center',
                font: '11px Roboto Condensed',
              }
            );
          }
        }
      });
    }
  }

  // 페이지 좌표 set
  initPageData() {
    const totalPage = this.coordinate.pageArea.totalPage; // 1초과
    const pageAreaTotal = this.coordinate.pageArea.total;
    this.coordinate.pageArea.data = [];
    for (let ix = 0, ixLen = totalPage; ix < ixLen; ix++) {
      let pageObj = {};
      if (totalPage < 4) {
        // 2, 3
        pageObj = {
          centerX: +pageAreaTotal.startX +
            +(pageAreaTotal.width / 2),
          centerY: +pageAreaTotal.startY +
            +(pageAreaTotal.height * ((+ix + +2) / (+totalPage + +3))),
          currPage: +ix + +1,
          radius: this.options.pageArea.circle.radius,
        };
      } else {
        // 4 ~
        pageObj = {
          centerX: +pageAreaTotal.startX +
            +(pageAreaTotal.width / 2),
          centerY: +pageAreaTotal.startY +
            +(pageAreaTotal.height * ((+ix + +1) / (+totalPage + +1))),
          currPage: +ix + +1,
          radius: this.options.pageArea.circle.radius,
        };
      }
      this.coordinate.pageArea.data.push(pageObj);
    }
  }

  // 페이지 draw
  drawPageData() {
    const ctx = this.context;
    const pageAreaTotal = this.coordinate.pageArea.total;
    this.clearCanvas(
      ctx, pageAreaTotal.startX, pageAreaTotal.startY,
      pageAreaTotal.width, pageAreaTotal.height,
    );
    this.coordinate.pageArea.data.forEach((v) => {
      ctx.beginPath();
      ctx.arc(v.centerX, v.centerY, v.radius, 0, Math.PI * 2);
      if (v.currPage === this.coordinate.pageArea.currPage) {
        ctx.fillStyle = this.options.colors.pageArea.select;
      } else {
        ctx.fillStyle = this.options.colors.pageArea.deselect;
      }
      ctx.fill();
      ctx.closePath();
    });
  }

  onAlarm(data) {
    /*
     * // alarm data idx
     * 0: instance name
     * 1: dataTime
     * 2: statName.toUpperCase()
     * 3: value
     * 4: levelType
     * 5: log
     * 6: userScript
     * 7: alarmType
     * 8: statName
     * ["EXA1", Tue Jul 31 2018 13:50:18 GMT+0900 (한국 표준시), "CPU", 1, "Warning", "", "", "OS STAT", "cpu"]
     * ["EXA1", Tue Jul 31 2018 13:50:47 GMT+0900 (한국 표준시), "CELL PACKET IN", 737, "Normal", "10.255.234.37", "10.255.234.37", "INFINIBAND", "cell packet in"]
     */
  }

  /////////////////////////////UTILS///////////////////////////////
  // DRAW multiple function
  dynamicDraw(context, x, y, width, height, style) {
    if (style) {
      const mergedStyle = _.merge({}, this.options.styleObj, style);
      const ctx = context;

      if (mergedStyle.stroke && mergedStyle.stroke.show) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(+x + +width, +y);
        ctx.lineTo(+x + +width, +y + +height);
        ctx.lineTo(x, +y + +height);
        ctx.lineTo(x, y);
        ctx.lineWidth = mergedStyle.stroke.linewidth;
        ctx.strokeStyle = mergedStyle.stroke.color;
        ctx.stroke();
        ctx.closePath();
      }
      if (mergedStyle.fill && mergedStyle.fill.show) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = mergedStyle.fill.color;
        ctx.fill();
      }
      if (mergedStyle.fillText && mergedStyle.fillText.show && mergedStyle.fillText.text) {
        ctx.font = mergedStyle.font;
        const textWidth = mergedStyle.fillText.text ?
          ctx.measureText(mergedStyle.fillText.text).width : 0;
        let textStartX;
        if (mergedStyle.align === 'center') {
          textStartX = (+x + +(width / 2)) - (textWidth / 2);
        } else if (mergedStyle.align === 'right') {
          textStartX = (+x + +width) - mergedStyle.padding.right - textWidth;
        } else if (mergedStyle.align === 'left') {
          textStartX = +x + +mergedStyle.padding.left;
        }
        const textStartY = (+y + +height) - mergedStyle.padding.bottom;
        if (mergedStyle.fillText.color) {
          ctx.fillStyle = mergedStyle.fillText.color;
        }
        ctx.fillText(mergedStyle.fillText.text, textStartX, textStartY);
      }
    }
  }

  ellipsisString(ctx, str, limitWidth) {
    let string = str;
    const ellipsis = '..';
    const strWidth = ctx.measureText(string).width;
    const ellipsisWidth = ctx.measureText(ellipsis).width;
    if (limitWidth < strWidth + ellipsisWidth) {
      let textLength = string.length;
      while (ctx.measureText(string.substr(0, textLength)).width + ellipsisWidth > limitWidth) {
        textLength--;
      }
      string = str.substr(0, textLength) + ellipsis;
    }
    return string;
  }

  clearCanvas(ctx, x, y, width, height) {
    if (ctx) {
      if (x && y && width && height) {
        ctx.clearRect(x, y, width, height);
      } else {
        ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
      }
    } else {
      const ctx = this.context;
      if (x && y && width && height) {
        ctx.clearRect(x, y, width, height);
      } else {
        ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
      }
    }
  }
}

export default Alertlogchart;
