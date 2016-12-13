import { WidgetInterface } from '../interface/widget';

export class WidgetParent implements WidgetInterface {
  public widgetInstanceId: number;
  public selector: string;

  constructor(widgetInstanceId: number) {
    this.widgetInstanceId = widgetInstanceId;
    this.setSelector();
  }

  public clbkCreated(): void {
  }

  public clbkResized(): void {
  }

  public clbkMoved(): void {
  }

  public clbkTab(): void {
  }

  public setSelector(): void {
    this.selector = ".jsWidgetContainer[data-widget-instance-id=" + this.widgetInstanceId + "]";
  }
}