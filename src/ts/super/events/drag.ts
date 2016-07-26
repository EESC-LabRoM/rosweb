/// <reference path="../../d/jquery.d.ts" />

// Types
import {Geometry} from "../../types/Geometry.ts";

// Parent Class
import {EventsParent} from "./_parent.ts";

export class DragEvents extends EventsParent {

  constructor() {
    super();
    this.DelegateEvent(".jsWidgetContainer[data-widget-conf='1']", "mousedown", this.MouseDown);
    this.DelegateEvent(document, "mousemove", this.MouseMove);
    this.DelegateEvent(".jsWidgetContainer[data-widget-conf='1']", "mouseup", this.MouseUp);
  }

  private toMove: Boolean;
  private toResize: Boolean;
  private widgetInstanceId: number;
  private moveX: number;
  private moveY: number;
  private lastX: number;
  private lastY: number;

  public MouseDown = (e?: MouseEvent) => {
    if ($(e.toElement).hasClass("jsWidgetResize")) {
      this.toMove = false;
      this.toResize = true;
    } else {
      this.toMove = true;
      this.toResize = false;
    }
    this.widgetInstanceId = parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id"));
    this.lastX = e.pageX;
    this.lastY = e.pageY;
  }
  public MouseMove = (e?: MouseEvent) => {
    if (parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id")) == this.widgetInstanceId) {
      if (this.toMove) {
        this._WidgetMove(e);
      }
      if (this.toResize) {
        this._WidgetResize(e);
      }
    } else {
      if (this.toResize) {
        this._WidgetResize(e);
      } else {
        this.widgetInstanceId = 0;
      }
    }

    this.lastX = e.pageX;
    this.lastY = e.pageY;
  }
  public MouseUp = (e?: MouseEvent) => {
    this.widgetInstanceId = 0;
    this.toMove = this.toResize = false;
  }

  private _WidgetResize(e: MouseEvent): void {
    let d: Geometry.Point2D = this._GetMouseDistance(e);

    let width: number = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width();
    let height: number = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height();

    let size: Geometry.Point2D = { x: width + d.x, y: height + d.y };
    console.log(size);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width(size.x);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height(size.y);
  }
  private _WidgetMove(e: MouseEvent): void {
    let d: Geometry.Point2D = this._GetMouseDistance(e);

    let left: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left"));
    let top: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top"));

    let pos: Geometry.Point2D = this._ApplyBoundaries({ x: left + d.x, y: top + d.y });
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left", pos.x);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top", pos.y);
  }
  private _GetMouseDistance(e: MouseEvent): Geometry.Point2D {
    return { x: e.pageX - this.lastX, y: e.pageY - this.lastY };
  }
  private _ApplyBoundaries(pos: Geometry.Point2D): Geometry.Point2D {
    let offset: any = $(".jsTabContent.jsShow").offset();
    let xMin: number = offset.left;
    let yMin: number = offset.top;
    let xMax: number = xMin + $(".jsTabContent.jsShow").width() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width();
    let yMax: number = yMin + $(".jsTabContent.jsShow").height() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height();

    if (pos.x > xMax) {
      pos.x = xMax;
    }
    if (pos.x < xMin) {
      pos.x = xMin;
    }
    if (pos.y > yMax) {
      pos.y = yMax;
    }
    if (pos.y < yMin) {
      pos.y = yMin;
    }

    return pos;
  }

}
