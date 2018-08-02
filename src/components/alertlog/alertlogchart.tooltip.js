export default class AlertlogTooltip {
  constructor() {
    this.tooltip = document.createElement('div');
    this.tooltip.setAttribute('class', 'evui-alertlog-tooltip');
    this.tooltip.style.display = 'none';

    this.title = document.createElement('div');
    this.title.setAttribute('class', 'evui-alertlog-tooltip-title');

    this.ul = document.createElement('ul');
    this.ul.setAttribute('class', 'evui-alertlog-tooltip-ul');

    this.tooltip.appendChild(this.title);
    this.tooltip.appendChild(this.ul);

    document.body.appendChild(this.tooltip);
  }
  showTooltip() {
    this.tooltip.style.display = 'block';
  }
  hideTooltip() {
    this.tooltip.style.display = 'none';
  }
}
