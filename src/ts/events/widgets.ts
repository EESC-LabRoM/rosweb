/// <reference path="../typings/tsd.d.ts" />

// Super
import {Frontend} from "../super/frontend.ts";

// Parent Class
import {EventsParent} from "./events.ts";

declare var MyApp: any;

export class WidgetsEvents extends EventsParent {

  public Frontend : Frontend = new Frontend();
  public Ros : ROSLIB.Ros;

  constructor(ros: ROSLIB.Ros) {
    super();

    this.Ros = ros;

    this.DelegateEvent(".jsWidgetContainer a", "click", this.nothing);
    this.DelegateEvent(".jsWidgetConfirm", "click", this.WidgetConfirm);
    this.DelegateEvent(".jsWidgetDelete", "click", this.WidgetDelete);
    this.DelegateEvent(".jsWidgetSettings", "click", this.WidgetSettings);
    this.DelegateEvent(".jsWidgetSettingsConfirm", "click", this.WidgetSettingsConfirm);
    this.DelegateEvent(".jsWidgetSettingsCancel", "click", this.WidgetSettingsCancel);
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
    $(".jsMenuWidgetsSettings").animate({right: 0});
    let widgetInstanceId: number = parseInt($(e.toElement).attr("data-widget-instance-id"));
    $(".jsSettingsSelection").html("");
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstanceId + "] meta[data-ros-topic=1]").each(function(k, v) {
      var html = MyApp.templates.topicSelection({desc: $(v).attr("data-desc"), type: $(v).attr("data-type")});
      $(".jsSettingsSelection").append(html);
    });
    this.Ros.getTopics((topics: string[]) => {
      this.Frontend.UpdateRosTopicSelectors(topics);
    }, () => function(error: any) {
      console.log(error);
    });
    e.preventDefault();
  }

  public WidgetSettingsConfirm = (e?: MouseEvent) => {
    $(".jsMenuWidgetsSettings").animate({right: -300});
    e.preventDefault();
  }

  public WidgetSettingsCancel = (e?: MouseEvent) => {
    $(".jsMenuWidgetsSettings").animate({right: -300});
    e.preventDefault();
  }

}