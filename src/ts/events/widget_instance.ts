/// <reference path="../typings/tsd.d.ts" />

// Types
import { Geometry } from "../types/Geometry";
import { WidgetInstance } from "../model/widget_instance";

// Super
import { Frontend } from "../super/frontend";
import { currentWorkspace } from "../model/workspace"
// import {db} from "../super/db.ts";

// Parent Class
import { EventsParent } from "./events";

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
    this.DelegateEvent(".jsWidgetContainer", "dblclick", this.WidgetContainerDblClick);
    this.DelegateEvent(".jsWidgetSettingsConfirm", "click", this.WidgetSettingsConfirm);
    this.DelegateEvent(".jsWidgetSettingsCancel", "click", this.WidgetSettingsCancel);
    this.DelegateEvent(".jsWidgetSettingsRefresh", "click", this.WidgetSettingsRefresh);
    this.DelegateEvent(".jsWidgetSettingsRemove", "click", this.WidgetSettingsRemove);

    // Move and Resize
    this.DelegateEvent(".jsToggleMovable", "click", this.ToggleMovable);

    this.DelegateEvent(".jsWidgetContainer[data-widget-conf='1']", "mousedown", this.MouseDown);
    this.DelegateEvent(document, "mousemove", this.MouseMove);
    this.DelegateEvent(document, "mouseup", this.MouseUp);
  };

  public WidgetConfirm = (e?: MouseEvent) => {
    $(e.toElement).closest(".jsWidgetContainer").attr("data-widget-conf", "0");
    e.preventDefault();
  };

  public WidgetDelete = (e?: MouseEvent) => {
    $(e.toElement).closest(".jsWidgetContainer").remove();
    e.preventDefault();
  };

  public WidgetSettings = (e?: MouseEvent) => {
    let widgetInstanceId: number = parseInt($(e.toElement).attr("data-widget-instance-id"));
    this._WidgetSettings(widgetInstanceId);
    e.preventDefault();
  };
  private _WidgetSettings(widgetInstanceId: number): void {
    $("#widgetSettings").val(widgetInstanceId);
    $(".jsSettingsSelection").html("");

    $(".jsWidgetContainer").removeClass("jsSettingsActive");
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]").addClass("jsSettingsActive");

    // generate fields
    this._WidgetSettingsSubscriptions(widgetInstanceId);
    this._WidgetSettingsRosParams(widgetInstanceId);
    this._WidgetSettingsRosServices(widgetInstanceId);
    this._WidgetSettingsParams(widgetInstanceId);
    this._WidgetSettingsActionServers(widgetInstanceId);

    // frontend actions
    this.Frontend.ShowWidgetSettings();
    this._WidgetSettingsRefresh();
  }
  private _WidgetSettingsSubscriptions(widgetInstanceId: number): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-topic=1]").each(function (k, v) {
      var html = MyApp.templates.rosTopicSelector({
        widget_instance_id: widgetInstanceId,
        ros_topic_id: $(v).attr("data-ros-topic-id"),
        ros_topic_chng: $(v).attr("data-ros-topic-chng"),
        ros_topic_desc: $(v).attr("data-ros-topic-desc"),
        ros_topic_type: $(v).attr("data-ros-topic-type")
      });
      $(".jsSettingsSelection").append(html);
    });
  };
  private _WidgetSettingsRosParams(widgetInstanceId: number): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-param=1]").each(function (k, v) {
      var html = MyApp.templates.rosParamSelector({
        widget_instance_id: widgetInstanceId,
        ros_param_id: $(v).attr("data-ros-param-id"),
        ros_param_desc: $(v).attr("data-ros-param-desc"),
        ros_param_chng: $(v).attr("data-ros-param-chng")
      });
      $(".jsSettingsSelection").append(html);
    });
  };
  private _WidgetSettingsRosServices(widgetInstanceId: number): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-service=1]").each(function (k, v) {
      var html = MyApp.templates.rosServiceSelector({
        widget_instance_id: widgetInstanceId,
        ros_service_id: $(v).attr("data-ros-service-id"),
        ros_service_desc: $(v).attr("data-ros-service-desc"),
        ros_service_chng: $(v).attr("data-ros-service-chng")
      });
      $(".jsSettingsSelection").append(html);
    });
  };
  private _WidgetSettingsParams(widgetInstanceId: number): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-wdgt-param=1]").each(function (k, v) {
      var html = MyApp.templates.wdgtParamField({
        widget_instance_id: widgetInstanceId,
        widget_param_id: $(v).attr("data-widget-param-id"),
        widget_param_desc: $(v).attr("data-widget-param-desc"),
        widget_param_var: $(v).attr("data-widget-param-var"),
        default_value: $(v).attr("data-widget-param-value")
      });
      $(".jsSettingsSelection").append(html);
    });
  };
  private _WidgetSettingsActionServers(widgetInstanceId: number): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-actionserver=1]").each(function (k, v) {
      var html = MyApp.templates.rosActionServerSelector({
        widget_instance_id: widgetInstanceId,
        ros_actionserver_id: $(v).attr("data-ros-actionserver-id"),
        ros_actionserver_chng: $(v).attr("data-ros-actionserver-chng"),
        ros_actionserver_desc: $(v).attr("data-ros-actionserver-desc"),
        ros_actionserver_type: $(v).attr("data-ros-actionserver-type")
      });
      $(".jsSettingsSelection").append(html);
    });
  }

  public WidgetContainerDblClick = (e?: MouseEvent) => {
    let widgetInstanceId = parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id"));
    this.ToggleMovable();
    if ($(".jsToggleMovable").hasClass("active")) {
      this._WidgetSettings(widgetInstanceId);
    }
    document.getSelection().removeAllRanges();
    e.preventDefault();
  }

  public WidgetSettingsRefresh = (e?: MouseEvent) => {
    this.Frontend.LoadingLink($(".jsWidgetSettingsRefresh")[0]);
    $(".jsRosTopicSelector").attr("disabled", "disabled");
    this._WidgetSettingsRefresh();
    e.preventDefault();
  };
  private _WidgetSettingsRefresh() {
    this._WidgetSettingsRefreshTopics();
  };
  private _WidgetSettingsRefreshTopics() {
    this.Ros.getTopics((topicsResponse: any) => {
      this.Frontend.UpdateRosTopicSelectors(topicsResponse);
      this._WidgetSettingsRefreshParams();
    }, (topicsError: any) => {
      alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
      console.log(topicsError);
    });
  };
  private _WidgetSettingsRefreshParams() {
    this.Ros.getParams((paramsResponse: any) => {
      this.Frontend.UpdateRosParamSelectors(paramsResponse);
      this._WidgetSettingsRefreshsServices();
    }, (paramsError: any) => {
      alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
      console.log(paramsError);
    });
  };
  private _WidgetSettingsRefreshsServices() {
    this.Ros.getServices((servicesResponse: any) => {
      this.Frontend.UpdateRosServiceSelectors(servicesResponse);
      this._WidgetSettingsRefreshActionServers();
      $(".jsRosTopicSelector").removeAttr("disabled");
    }, (servicesError: any) => {
      alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
      console.log(servicesError);
    });
  };
  private _WidgetSettingsRefreshActionServers() {
    this.Ros.getActionServers((actionServersResponse: any) => {
      this.Frontend.UpdateActionServerSelectors(actionServersResponse);
      this.Frontend.LoadingLink($(".jsWidgetSettingsRefresh")[0], false);
    }, (topicsError: any) => {
      alert("Error: ROSWeb may not be connected to a RosBridge WebSocket server");
      console.log(topicsError);
    });
  };

  public WidgetSettingsConfirm = (e?: MouseEvent) => {
    // widget instance id
    let widgetInstanceId: number = parseInt($("input#widgetSettings").val());

    // manage params
    this._WidgetSettingsConfirmParams(widgetInstanceId);
    
    // manage ros data
    this._WidgetSettingsConfirmSubscriptions(widgetInstanceId);
    this._WidgetSettingsConfirmRosParams(widgetInstanceId);
    this._WidgetSettingsConfirmRosServices(widgetInstanceId);
    this._WidgetSettingsConfirmActionServers(widgetInstanceId);

    // confirm callback
    let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(widgetInstanceId, "WidgetInstance");
    //widgetInstance.WidgetCallbackClass["clbkConfirm"]();
    widgetInstance.WidgetCallbackClass.clbkConfirm();

    // frontend action
    this.Frontend.HideWidgetSettings();
    e.preventDefault();
  };
  private _WidgetSettingsConfirmSubscriptions(widgetInstanceId: number): void {
    $(".jsRosTopicSelector").each((index: number, elem: Element) => {
      let topic_name: string = $(elem).val();
      let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(widgetInstanceId, "WidgetInstance");

      let topicChangeCallback: string = $(elem).attr("data-ros-topic-chng");
      widgetInstance.WidgetCallbackClass[topicChangeCallback](topic_name);

      let rosTopicId = $(elem).attr("data-ros-topic-id");
      let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
      let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-topic-id=" + rosTopicId + "]");
      $(htmlMeta).attr("data-ros-topic-slctd", topic_name);
    });
  };
  private _WidgetSettingsConfirmRosParams(widgetInstanceId: number): void {
    $(".jsRosParamSelector").each((index: number, elem: Element) => {
      let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(widgetInstanceId, "WidgetInstance");

      let paramChangeCallback: any = $(elem).attr("data-ros-param-chng");
      let paramSelected: string = $(elem).val();
      widgetInstance.WidgetCallbackClass[paramChangeCallback](paramSelected);

      let rosParamId = $(elem).attr("data-ros-param-id");
      let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
      let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-param-id=" + rosParamId + "]");
      $(htmlMeta).attr("data-ros-param-slctd", paramSelected);
    });
  };
  private _WidgetSettingsConfirmRosServices(widgetInstanceId: number): void {
    $(".jsRosServiceSelector").each((index: number, elem: Element) => {
      let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(widgetInstanceId, "WidgetInstance");

      let serviceChangeCallback: any = $(elem).attr("data-ros-service-chng");
      let serviceSelected: string = $(elem).val();
      widgetInstance.WidgetCallbackClass[serviceChangeCallback](serviceSelected);

      let rosServiceId = $(elem).attr("data-ros-service-id");
      let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
      let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-service-id=" + rosServiceId + "]");
      $(htmlMeta).attr("data-ros-service-slctd", serviceSelected);
    });
  }
  private _WidgetSettingsConfirmParams(widgetInstanceId: number): void {
    $(".jsWidgetParam").each((index: number, elem: Element) => {
      let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(widgetInstanceId, "WidgetInstance");

      let varName = $(elem).attr("data-widget-param-var");
      let varValue = $(elem).val();
      widgetInstance.WidgetCallbackClass[varName] = varValue;

      let widgetParamId = $(elem).attr("data-widget-param-id");
      let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
      let htmlMeta = $(htmlWidgetInstance).find("meta[data-widget-param-id=" + widgetParamId + "]");
      $(htmlMeta).attr("data-widget-param-value", varValue);
    });
  };
  private _WidgetSettingsConfirmActionServers(widgetInstanceId: number): void {
    $(".jsRosActionServerSelector").each((index: number, elem: Element) => {
      let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(widgetInstanceId, "WidgetInstance");

      let actionServerChangeCallback: any = $(elem).attr("data-ros-actionserver-chng");
      let actionServerSelected: string = $(elem).val();
      widgetInstance.WidgetCallbackClass[actionServerChangeCallback](actionServerSelected);

      let rosActionServerId = $(elem).attr("data-ros-actionserver-id");
      let htmlWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]");
      let htmlMeta = $(htmlWidgetInstance).find("meta[data-ros-actionserver-id=" + rosActionServerId + "]");
      $(htmlMeta).attr("data-ros-actionserver-slctd", actionServerSelected);
    });
  };

  public WidgetSettingsCancel = (e?: MouseEvent) => {
    this.Frontend.HideWidgetSettings();
    e.preventDefault();
  };

  public WidgetSettingsRemove = (e?: MouseEvent) => {
    let widgetInstanceId: number = parseInt($("#widgetSettings").val());
    currentWorkspace.remove<WidgetInstance>(widgetInstanceId, "WidgetInstance");

    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "]").remove();
    this.Frontend.HideWidgetSettings();
    e.preventDefault();
  };

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
    if (e != undefined) e.preventDefault();
  };

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
    this._WidgetSettings(this.widgetInstanceId);
    $(e.toElement).closest(".jsWidgetContainer").addClass("jsMouseActive");
    this.lastX = e.pageX;
    this.lastY = e.pageY;
  };
  public MouseMove = (e?: MouseEvent) => {
    if (parseInt($(e.toElement).closest(".jsWidgetContainer").attr("data-widget-instance-id")) == this.widgetInstanceId) {
      if (this.toMove) {
        document.getSelection().removeAllRanges();
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
  };
  public MouseUp = (e?: MouseEvent) => {
    this.widgetInstanceId = 0;
    this.toMove = this.toResize = false;
    $(".jsWidgetContainer").removeClass("jsMouseActive");
  };

  private _WidgetResize(e: MouseEvent): void {
    let d: Geometry.Point2D = this._GetMouseDistance(e);

    let width: number = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width();
    let height: number = $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height();

    let size: Geometry.Point2D = this._ApplySizeBoundaries({ x: width + d.x, y: height + d.y });
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").width(size.x);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").height(size.y);

    let widgetInstance = currentWorkspace.get<WidgetInstance>(this.widgetInstanceId, "WidgetInstance");
    if (widgetInstance.WidgetCallbackClass.clbkResized != undefined) {
      widgetInstance.WidgetCallbackClass.clbkResized(size.x, size.y);
    }
    widgetInstance.size.x = size.x;
    widgetInstance.size.y = size.y;
  };
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
  };
  private _WidgetMove(e: MouseEvent): void {
    let d: Geometry.Point2D = this._GetMouseDistance(e);

    let left: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left"));
    let top: number = parseInt($(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top"));

    let pos: Geometry.Point2D = this._ApplyPositionBoundaries({ x: left + d.x, y: top + d.y });
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("left", pos.x);
    $(".jsWidgetContainer[data-widget-instance-id='" + this.widgetInstanceId + "']").css("top", pos.y);

    let widgetInstance: WidgetInstance = currentWorkspace.get<WidgetInstance>(this.widgetInstanceId, "WidgetInstance");
    if (widgetInstance.WidgetCallbackClass.clbkMoved != undefined) {
      widgetInstance.WidgetCallbackClass.clbkMoved(pos.x, pos.y);
    }
    widgetInstance.position.x = pos.x;
    widgetInstance.position.y = pos.y;
  };
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
  };
  private _GetMouseDistance(e: MouseEvent): Geometry.Point2D {
    return { x: e.pageX - this.lastX, y: e.pageY - this.lastY };
  };

}
