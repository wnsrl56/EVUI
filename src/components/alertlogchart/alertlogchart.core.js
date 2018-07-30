/*eslint-disable*/
import _ from 'lodash';

class Alarmchart {
  constructor(target, options) {
    const obj = {
      // default width, height(onePage)
      width: 235,
      height: 220,
    };

    // parameter mapping
    this.options = _.merge({}, obj, options);

    // create & init canvas
    this.baseCanvas = document.createElement('canvas');
    this.baseCanvas.setAttribute('class', 'evui-alarmchart-canvas');
    this.context = this.baseCanvas.getContext('2d');

    // init coordinate obj
    this.coordinate = {
      alarmCircle: {
        total: {}, // alarmCircle 전체 좌표 (삼각형, 년, 월)
        data: [],
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
  }
  init() {
    this.initCanvasProperty();
  }
  mouseInit() {
    this.initMouseover();
  }
  initCanvasProperty() {
    // set total width, height
    if (this.options.width && this.options.height) {
      this.baseCanvas.height = this.options.height;
    }
  }

  initMouseover() {
  }

  drawCanvas() {
  }

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
      if (mergedStyle.fillText.show && mergedStyle.fillText.text) {
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

export default Calendar;
