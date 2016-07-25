/// <reference path="../../d/jquery.d.ts" />

// Types
import {Geometry} from "../../types/Geometry.ts";

// Parent Class
import {EventsParent} from "./_parent.ts";

export class DragEvents extends EventsParent {
  
  constructor() {
    super();
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

      let left: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left"));
      let top: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top"));

      let pos : Geometry.Point2D = this._ApplyBoundaries({x: left+dx, y: top+dy});
      $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left", pos.x);
      $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top", pos.y);

      this.lastX = e.pageX;
      this.lastY = e.pageY;
    } else {
      this.widgetInstanceId = 0;
    }
  }

  public MouseUp = (e?: MouseEvent) => {
    this.widgetInstanceId = 0;
  }

  private _ApplyBoundaries(pos : Geometry.Point2D) : Geometry.Point2D {
    let offset : any = $(".jsTabContent.jsShow").offset();
    let xMin: number = offset.left;
    let yMin: number = offset.top;
    let xMax: number = xMin + $(".jsTabContent.jsShow").width() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width();
    let yMax: number = yMin + $(".jsTabContent.jsShow").height() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height();

    if(pos.x > xMax) {
      pos.x = xMax;
    }
    if(pos.x < xMin) {
      pos.x = xMin;
    }
    if(pos.y > yMax) {
      pos.y = yMax;
    }
    if(pos.y < yMin) {
      pos.y = yMin;
    }

    return pos;
  }

}
