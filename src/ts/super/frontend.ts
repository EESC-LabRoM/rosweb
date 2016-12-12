/// <reference path="../typings/tsd.d.ts" />

// Models
import { Tab } from "../model/tab";
import { WidgetGroup } from "../model/widget_group";
import { Widget } from "../model/widget";
import { WidgetInstance } from "../model/widget_instance";
import { currentWorkspace } from "../model/workspace";

// Super classes
import { Names } from "./names";
import { Trigger } from "./trigger";

// types
import { Geometry } from "../types/Geometry";

declare var MyApp: any;

interface TypeDef {
  examples: string[],
  fieldarraylen: number[],
  fieldnames: string[],
  fieldtypes: string[],
  type: string
}

export class Frontend {

  public tabContainerId: string;
  public tabContentContainerId: string;

  private Names: Names;
  public Trigger: Trigger;

  private ActiveTabId: number;

  constructor() {
    this.tabContainerId = "header2";
    this.tabContentContainerId = "tabs";

    this.Names = new Names();
    this.Trigger = new Trigger();
  }

  public InsertWidgetsTags(): void {
    currentWorkspace.getList<Widget>().forEach((value: Widget, index: number, array: Widget[]) => {
      $("body").append("<script type='text/javascript' src='" + value.url.slice(2) + "/main.js" + "'></script>");
      // $("body").append("<link rel='stylesheet' type='text/css' href='" + value.url.slice(2) + "/main.css" + "' />");
    });
  }
  public LoadingLink(element: Element, disabled: Boolean = true) {
    if (disabled) {
      $(element).addClass("disabled");
    } else {
      $(element).removeClass("disabled");
    }
  }
  public ReleaseLink(element: Element) {
    this.LoadingLink(element, false);
  }

  public formTab(tab?: Tab): Tab {
    if (tab) {
      tab.name = "tab #" + tab.id;
      return tab;
    }
    return new Tab();
  }

  public closeTab(tab_id: number): void {
    $(".jsTab[data-tab-id='" + tab_id + "']").remove();
    $(".jsTabContent[data-tab-id='" + tab_id + "']").remove();
  }

  public selectTab(tab: Tab): void {
    let parentClassName = this.Names.classTabParent;
    $("." + parentClassName).removeClass("jsActive");
    $("." + parentClassName + "[data-tab-id=" + tab.id + "]").addClass("jsActive");
    let className = this.Names.eventsClassPrefix + "Tab";
    $("." + className).removeClass("jsActive");
    $("." + className + "[data-tab-id=" + tab.id + "]").addClass("jsActive");
    let tabClassName = this.Names.classTabContent;
    $("." + tabClassName).removeClass("jsShow").addClass("jsHide");
    $("." + tabClassName + "[data-tab-id=" + tab.id + "]").removeClass("jsHide").addClass("jsShow");
    this.ActiveTabId = tab.id;
  }

  public LoadWidgetContentAndInsert(widgetInstance: WidgetInstance, afterContentCallback: any): void {
    this._loadWidgetContentAndInsert(widgetInstance, afterContentCallback);
  }
  private _loadWidgetContentAndInsert(widgetInstance: WidgetInstance, afterContentCallback: any): void {
    let tabId: number = widgetInstance.tab_id != undefined ? widgetInstance.tab_id : this._getForcedCurrentTabId();
    let fn = this._insertWidget;
    let widget: Widget = currentWorkspace.get<Widget>(widgetInstance.widget_id, "Widget");
    $.ajax({
      url: widget.url.slice(2) + "/index.hbs",
      beforeSend: function () {

      },
      success: function (data: string) {
        MyApp.templates._widgetsTemplates[widget.alias] = Handlebars.compile(data);
        fn(widgetInstance, tabId, afterContentCallback);
      },
      error: function (e1: any, e2: any) {
        throw "Widget file not found!";
      }
    });
  }

  public insertWidgetInstance(widgetInstance: WidgetInstance, afterContentCallback: any): void {
    let widget: Widget = currentWorkspace.get<Widget>(widgetInstance.widget_id, "Widget");
    if (MyApp.templates._widgetsTemplates === undefined) {
      MyApp.templates._widgetsTemplates = [];
    }
    if (MyApp.templates._widgetsTemplates[widget.alias] === undefined) {
      this._loadWidgetContentAndInsert(widgetInstance, afterContentCallback);
    } else {
      let tabId: number = widgetInstance.tab_id != undefined ? widgetInstance.tab_id : this._getForcedCurrentTabId();
      this._insertWidget(widgetInstance, tabId, afterContentCallback);
    }
  }
  private _insertWidget(widgetInstance: WidgetInstance, currentTabId: number, afterContentCallback: any): void {
    let content: string, html: string;
    let widget: Widget = currentWorkspace.get<Widget>(widgetInstance.widget_id, "Widget");
    content = MyApp.templates._widgetsTemplates[widget.alias](widgetInstance);

    let width: number = parseInt($(content).attr("data-width"));
    let height: number = parseInt($(content).attr("data-height"));
    let left: number = $(".jsTabContent.jsShow").width() / 2;
    let top: number = $(".jsTabContent.jsShow").height() / 2;

    if (widgetInstance.position.x == 0 && widgetInstance.position.y == 0) {
      widgetInstance.position = { x: left, y: top };
    }
    if (widgetInstance.size.x == 0 && widgetInstance.size.y == 0) {
      widgetInstance.size = { x: width, y: height };
    }

    html = MyApp.templates.widget({ WidgetInstance: widgetInstance, content: content, left: widgetInstance.position.x + "px", top: widgetInstance.position.y + "px", width: widgetInstance.size.x + "px", height: widgetInstance.size.y + "px" });
    $("div.jsTabContent[data-tab-id=" + currentTabId + "]").append(html);

    let trigger = new Trigger();
    trigger.widgetSettings(widgetInstance.id);
    if (afterContentCallback != undefined) {
      afterContentCallback();
    }
  }

  // Widget Instance properties
  public setWidgetInstancePosition(widgetInstance: WidgetInstance, position: Geometry.Point2D): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstance.id + "]").css({ top: position.y, left: position.x });
  };
  public setWidgetInstanceSize(widgetInstance: WidgetInstance, size: Geometry.Point2D): void {
    $(".jsWidgetContainer[data-widget-instance-id=" + widgetInstance.id + "]").css({ height: size.y, width: size.x });
  };

  private _getForcedCurrentTabId(): number {
    let currentTabId: number = this._getCurrentTabId();
    if (currentTabId === 0) {
      this.Trigger.newTab();
    }
    return this._getCurrentTabId();
  }
  private _getCurrentTabId(): number {
    let tabIdStr: string = $("div.jsTab.jsActive").attr("data-tab-id");
    if (tabIdStr === undefined) {
      return 0;
    }
    let tabId: number = parseInt(tabIdStr);
    return tabId;
  }

  // Show menu methods
  public showWidgetsMenu(): void {
    $(".balloon").not("." + this.Names.classWidgetsContainer).hide();
    $("." + this.Names.classWidgetsContainer).animate({ height: 'toggle' });
  }
  public ShowWidgetSettings(): void {
    $(".jsMenuWidgetsSettings").animate({ right: 0 });
  }
  public HideWidgetSettings(): void {
    $(".jsMenuWidgetsSettings").animate({ right: -300 });
    $(".jsWidgetContainer").attr("data-widget-conf", "0");
    $(".jsToggleMovable").removeClass("active");
  }
  public ShowConfiguration(): void {
    $(".balloon").not("." + this.Names.classConfiguration).hide();
    $("." + this.Names.classConfiguration).animate({ height: 'toggle' });
  }

  // Update Selector Methods
  public UpdateRosTopicSelectors(response: { topics: string[], types: string[], details: TypeDef[] }): void {
    $(".jsRosTopicSelector").html("");
    var html = '';
    $(".jsRosTopicSelector").each((i: number, element: Element) => {
      let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
      let elementMeta = $(elementWidgetInstance).find("meta[data-ros-topic-id='" + $(element).attr("data-ros-topic-id") + "']");
      let subscribedTopic: string = $(elementMeta).attr("data-ros-topic-slctd");

      html = MyApp.templates.rosTopicSelectorOptions({ name: '-- Select a topic to subscribe --', value: "" });
      let strTypes: string = $(element).attr("data-ros-topic-type");
      let types = (strTypes == "") ? [] : strTypes.split("|");
      response.topics.forEach((value: string, index: number) => {
        let selected: boolean = (value == subscribedTopic) ? true : false;
        if ((types.indexOf(response.types[index]) > -1) || types.length == 0) {
          html += MyApp.templates.rosTopicSelectorOptions({ name: value, value: value, type: response.types[index], selected: selected });
        }
      });
      $(element).append(html);
    });
  }
  public UpdateRosParamSelectors(response: string[]): void {
    $(".jsRosParamSelector").html("");
    var html = '';
    $(".jsRosParamSelector").each((i: number, element: Element) => {
      let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
      let elementMeta = $(elementWidgetInstance).find("meta[data-ros-param-id='" + $(element).attr("data-ros-param-id") + "']");
      let selectedParam: string = $(elementMeta).attr("data-ros-param-slctd");

      html = MyApp.templates.rosParamSelectorOptions({ name: '-- Select a param to manage --', value: "" });
      response.forEach((value: string, index: number) => {
        let selected: boolean = (value == selectedParam) ? true : false;
        html += MyApp.templates.rosParamSelectorOptions({ name: value, value: value, selected: selected });
      });
      $(element).append(html);
    });
  }
  public UpdateRosServiceSelectors(response: string[]): void {
    $(".jsRosServiceSelector").html("");
    var html = '';
    $(".jsRosServiceSelector").each((i: number, element: Element) => {
      let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
      let elementMeta = $(elementWidgetInstance).find("meta[data-ros-service-id='" + $(element).attr("data-ros-service-id") + "']");
      let selectedService: string = $(elementMeta).attr("data-ros-service-slctd");

      html = MyApp.templates.rosServiceSelectorOptions({ name: '-- Select a service --', value: "" });
      response.forEach((value: string, index: number) => {
        let selected: boolean = (value == selectedService) ? true : false;
        html += MyApp.templates.rosServiceSelectorOptions({ name: value, value: value, selected: selected });
      });
      $(element).append(html);
    });
  }
  public UpdateActionServerSelectors(response: string[]): void {
    $(".jsRosActionServerSelector").html("");
    var html = '';
    $(".jsRosActionServerSelector").each((i: number, element: Element) => {
      let elementWidgetInstance = $(".jsWidgetContainer[data-widget-instance-id=" + $(element).attr("data-widget-instance-id") + "]");
      let elementMeta = $(elementWidgetInstance).find("meta[data-ros-actionserver-id='" + $(element).attr("data-ros-actionserver-id") + "']");
      let selectedActionServer: string = $(elementMeta).attr("data-ros-actionserver-slctd");

      html = MyApp.templates.rosActionServerSelectorOptions({ name: '-- Select an action server to subscribe --', value: "" });
      let strTypes: string = $(element).attr("data-ros-actionserver-type");
      let types = (strTypes == "") ? [] : strTypes.split("|");
      response.forEach((value: string, index: number) => {
        let selected: boolean = (value == selectedActionServer) ? true : false;
        if ((types.indexOf(response[index]) > -1) || types.length == 0) {
          html += MyApp.templates.rosActionServerSelectorOptions({ name: value, value: value, selected: selected });
        }
      });
      $(element).append(html);
    });
  }

  // Update Workspace Methods
  public ClearWorkspace() {
    $(".jsWidgetGroups").html("");
    $(".jsTab").remove();
    $("#tabs").html("");
  }

  // Model frontend
  public newTab(tab: Tab): void {
    var tabHtml = MyApp.templates.tab(tab);
    var tabContentHtml = MyApp.templates.tabContent(tab);
    // insert tab
    $(tabHtml).insertBefore("#" + this.tabContainerId + " > .clearfix");
    //document.getElementById(this.tabContainerId).innerHTML += tabHtml;
    // insert tab content
    document.getElementById(this.tabContentContainerId).innerHTML += tabContentHtml;
  }
  public newWidgetGroup(widgetGroup: WidgetGroup) {
    let html: string = MyApp.templates.widgetGroup(widgetGroup);
    $(".jsWidgetGroups").append(html);
  }
  public newWidget(widget: Widget) {
    let html = MyApp.templates.widgetItem(widget);
    $("#jsWidgetGroup" + widget.widget_group_id + " .jsWidgets").append(html);
    $("body").append("<script type='text/javascript' src='" + widget.url.slice(2) + "/main.js'></script>");
  }
  public newWidgetInstance(widgetInstance: WidgetInstance) {
    this.insertWidgetInstance(widgetInstance, () => { });
  }

}

export var frontend: Frontend = new Frontend();
