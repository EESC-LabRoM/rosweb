/// <reference path="../typings/tsd.d.ts" />

// Types
import {Geometry} from "../types/Geometry.ts";
import {Subscription} from "../model/subscription.ts";
import {WidgetInstance} from "../model/widget_instance.ts";

// Super
import {Frontend} from "../super/frontend.ts";
import {db} from "../super/db.ts";

// Parent Class
import {EventsParent} from "./events.ts";

declare var MyApp: any;

export class WidgetInstanceEvents extends EventsParent {

  public Frontend: Frontend;
  public Ros: ROSLIB.Ros;

  constructor(ros: ROSLIB.Ros) {
    super();

    this.Ros = ros;

    this.Frontend = new Frontend();

    // Settings
    this.DelegateEvent(".jsWidgetConfirm", "click", this.WidgetConfirm);
    this.DelegateEvent(".jsWidgetDelete", "click", this.WidgetDelete);
    this.DelegateEvent(".jsWidgetSettings", "click", this.WidgetSettings);
    this.DelegateEvent(".jsWidgetSettingsConfirm", "click", this.WidgetSettingsConfirm);
    this.DelegateEvent(".jsWidgetSettingsCancel", "click", this.WidgetSettingsCancel);
    this.DelegateEvent(".jsWidgetSettingsRefresh", "click", this.WidgetSettingsRefresh);
    this.DelegateEvent(".jsWidgetSettingsRemove", "click", this.WidgetSettingsRemove);

    // Move and Resize
    this.DelegateEvent(".jsToggleMovable", "click", this.ToggleMovable);

    this.DelegateEvent(".jsWidgetContainer[data-widget-conf='1']", "mousedown", this.MouseDown);
    this.DelegateEvent(document, "mousemove", this.MouseMove);
    this.DelegateEvent(document, "mouseup", this.MouseUp);
  }

  public WidgetConfirm = (e?: MouseEvent) => {
    $(e.toElement).closest(".jsWidgetContainer").attr("data-widget-conf", "0");
    e.preventDefault();
  }

  public WidgetDelete = (e?: MouseEvent) => {
    $(e.toElement).closest(".jsWidgetContainer").remove();
    e.preventDefault();
  }

  public WidgetSettings = (e?: MouseEvent) => {
    let widgetInstanceId: number = parseInt($(e.toElement).attr("data-widget-instance-id"));
    $("#widgetSettings").val(widgetInstanceId);
    $(".jsSettingsSelection").html("");
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-topic=1]").each(function (k, v) {
      var html = MyApp.templates.rosTopicSelector({
        widget_topic_id: $(v).attr("data-widget-topic-id"),
        widget_instance_id: widgetInstanceId,
        desc: $(v).attr("data-desc"),
        type: $(v).attr("data-type")
      });
      $(".jsSettingsSelection").append(html);
    });
    this.Frontend.ShowWidgetSettings();
    this._WidgetSettingsRefresh();
    e.preventDefault();
  }

  public WidgetSettingsRefresh = (e?: MouseEvent) => {
    this.Frontend.LoadingLink(e.toElement);
    $(".jsRosTopicSelector").attr("disabled", "disabled");
    this._WidgetSettingsRefresh((e?: MouseEvent) => {
      this.Frontend.ReleaseLink(e.toElement);
      $(".jsRosTopicSelector").removeAttr("disabled");
    }, e);
    e.preventDefault();
  }
  private _WidgetSettingsRefresh(callback?: (e: any) => void, e?: MouseEvent) {
    this.Ros.getTopics((response: any) => {
      this.Frontend.UpdateRosTopicSelectors(response);
      if (typeof (callback) === 'function') {
        callback(e);
      }
    }, () => function (error: any) {
      alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
      console.log(error);
    });
  }

  public WidgetSettingsConfirm = (e?: MouseEvent) => {
    // manage subscriptions
    this._WidgetSettingsConfirmSubscriptions();
    // manage params

    this.Frontend.HideWidgetSettings();
    e.preventDefault();
  }
  private _WidgetSettingsConfirmSubscriptions() {
    $(".jsRosTopicSelector").each((index: number, elem: Element) => {
      let topic_name: string = $(elem).children("option:selected").attr("data-ros-topic-name");
      let topic_type: string = $(elem).children("option:selected").attr("data-ros-topic-type");
      let widgetInstanceId: number = parseInt($(elem).attr("data-widget-instance-id"));

      let widgetInstance = db.getWidgetInstance(widgetInstanceId);
      let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstance.id + "]");
      let htmlMeta = $(htmlWidgetInstance).find("meta:nth-child(" + (index + 1) + ")");
      $(htmlMeta).attr("data-subscribed-topic", topic_name);

      let callbackName: string = $(htmlMeta).attr("data-clbk-fn");
      let callback: any = widgetInstance.WidgetCallbackClass[callbackName];
      if ($(elem).children("option:selected").val() !== "") {
        let subscription = new Subscription(widgetInstance, topic_name, topic_type, callback);
        if (widgetInstance.Subscriptions.length < (index + 1)) {
          widgetInstance.Subscriptions.push(subscription);
        } else {
          widgetInstance.Subscriptions[index].topic.unsubscribe();
          widgetInstance.Subscriptions[index] = subscription;
        }
      }
    });
  };

  public WidgetSettingsCancel = (e?: MouseEvent) => {
    this.Frontend.HideWidgetSettings();
    e.preventDefault();
  }

  public WidgetSettingsRemove = (e?: MouseEvent) => {
    let widgetInstanceId: number = parseInt($("#widgetSettings").val());
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]").remove();
    this.Frontend.HideWidgetSettings();
    e.preventDefault();
  }

  private toMove: Boolean;
  private toResize: Boolean;
  private widgetInstanceId: number;
  private moveX: number;
  private moveY: number;
  private lastX: number;
  private lastY: number;

  public ToggleMovable = (e?: MouseEvent) => {
    $(".jsToggleMovable").toggleClass("active");
    if ($(".jsToggleMovable").hasClass("active")) {
      $(".jsWidgetContainer").attr("data-widget-conf", "1");
    } else {
      $(".jsWidgetContainer").attr("data-widget-conf", "0");
      this.Frontend.HideWidgetSettings();
    }
    e.preventDefault();
  }

  public MouseDown = (e?: MouseEvent) => {
    if ($(e.toElement).hasClass("jsWidgetResize")) {
      this.toMove = false;
      this.toResize = true;
    } else {
      this.toMove = true;
      this.toResize = false;
    }
    $(".jsWidgetContainer").css("z-index", "20");
    this.widgetInstanceId = parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id"));
    $(e.toElement).closest(".jsWidgetContainer").css("z-index", "30");
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
    $(".jsWidgetContainer").css("z-index", "20");
  }

  private _WidgetResize(e: MouseEvent): void {
    let d: Geometry.Point2D = this._GetMouseDistance(e);

    let width: number = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width();
    let height: number = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height();

    let size: Geometry.Point2D = this._ApplySizeBoundaries({ x: width + d.x, y: height + d.y });
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width(size.x);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height(size.y);

    let widgetInstance: WidgetInstance = db.getWidgetInstance(this.widgetInstanceId);
    widgetInstance.WidgetCallbackClass.clbkResized(size.x, size.y);
  }
  private _ApplySizeBoundaries(size: Geometry.Point2D): Geometry.Point2D {
    let widthMin: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-min-width"));
    let widthMax: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-max-width"));
    let heightMin: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-min-height"));
    let heightMax: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "'] .ros-widget").attr("data-max-height"));

    if (size.x > widthMax) {
      size.x = widthMax;
    }
    if (size.x < widthMin) {
      size.x = widthMin;
    }
    if (size.y > heightMax) {
      size.y = heightMax;
    }
    if (size.y < heightMin) {
      size.y = heightMin;
    }

    return size;
  }
  private _WidgetMove(e: MouseEvent): void {
    let d: Geometry.Point2D = this._GetMouseDistance(e);

    let left: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left"));
    let top: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top"));

    let pos: Geometry.Point2D = this._ApplyPositionBoundaries({ x: left + d.x, y: top + d.y });
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left", pos.x);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top", pos.y);

    let widgetInstance: WidgetInstance = db.getWidgetInstance(this.widgetInstanceId);
    widgetInstance.WidgetCallbackClass.clbkMoved(pos.x, pos.y);
  }
  private _ApplyPositionBoundaries(pos: Geometry.Point2D): Geometry.Point2D {
    let offset: any = $(".jsTabContent.jsShow").offset();
    let xMin: number = offset.left + 1;
    let yMin: number = offset.top;
    let xMax: number = xMin + $(".jsTabContent.jsShow").width() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width() - 1;
    let yMax: number = yMin + $(".jsTabContent.jsShow").height() - $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height() - 1;

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
  private _GetMouseDistance(e: MouseEvent): Geometry.Point2D {
    return { x: e.pageX - this.lastX, y: e.pageY - this.lastY };
  }

}
