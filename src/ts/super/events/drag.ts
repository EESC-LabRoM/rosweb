/// <reference path="../../d/jquery.d.ts" />

// Parent Class
import {EventsParent} from "./_events.ts";

export class DragEvents { // extends EventsParent {
  
  public DelegateEvent(selector: string | Document, event: string, method: () => void) {
    $(document).delegate(selector, event, method);
  }
  
  constructor() {
    //super();
    this.DelegateEvent(".jsWidgetContainer[data-widget-movable='1']", "mousedown", this.MouseDown);
    this.DelegateEvent(document, "mousemove", this.MouseMove);
    this.DelegateEvent(".jsWidgetContainer[data-widget-movable='1']", "mouseup", this.MouseUp);
  }

  private widgetInstanceId: number;
  private moveX: number;
  private moveY: number;
  private lastX: number;
  private lastY: number;

  public MouseDown = (e?: MouseEvent) => {
    this.widgetInstanceId = parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id"));
    this.lastX = e.pageX;
    this.lastY = e.pageY;
  }

  public MouseMove = (e?: MouseEvent) => {
    if(parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id")) == this.widgetInstanceId) {
      let dx: number = e.pageX - this.lastX;
      let dy: number = e.pageY - this.lastY;
      $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left", "+=" + dx);
      $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top", "+=" + dy);
      this.lastX = e.pageX;
      this.lastY = e.pageY;
      console.log("moved");
    } else {
      this.widgetInstanceId = 0;
    }
  }

  public MouseUp = (e?: MouseEvent) => {
    this.widgetInstanceId = 0;
  }

}
