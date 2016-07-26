/// <reference path="../d/handlebars.d.ts" />
/// <reference path="../d/jquery.d.ts" />

// Models
import {Tab} from "../model/tab.ts";
import {Widget} from "../model/widget.ts";
import {WidgetInstance} from "../model/widget_instance.ts";

// Super classes
import {Names} from "./names.ts";
import {Trigger} from "./trigger.ts";

declare var MyApp: any;

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
  
  public formTab(tab?: Tab): Tab {
    if(tab) {
      tab.name = "tab #" + tab.id; 
      return tab;
    }
    return new Tab();
  }

  public newTab(tab: Tab): void {
    var tabHtml = MyApp.templates.tab(tab);
    var tabContentHtml = MyApp.templates.tabContent(tab);
    // insert tab
    $(tabHtml).insertBefore("#" + this.tabContainerId + " > .clearfix");
    //document.getElementById(this.tabContainerId).innerHTML += tabHtml;
    // insert tab content
    document.getElementById(this.tabContentContainerId).innerHTML += tabContentHtml;
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
  
  public showWidgetsMenu(): void {
    $("." + this.Names.classWidgetsContainer).animate({width: 'toggle'});
  }
  public widgetsList(list: Array<Widget>): void {
    var html = MyApp.templates.widgetList(list);
    $("." + this.Names.classWidgetsList).html(html);
  }
  private _loadWidgetContentAndInsert(widgetInstance: WidgetInstance): void {
    let currentTabId: number = this._getForcedCurrentTabId();
    let fn = this._insertWidget;
    $.ajax({
      url: "widgets/" + widgetInstance.Widget.alias + "/index.hbs",
      beforeSend: function() {

      },
      success: function(data: string) {
        MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias] = Handlebars.compile(data);
        fn(widgetInstance, currentTabId);
      },
      error: function(e1: any, e2: any) {
        throw "Widget file not found!";
      }
    });
  }

  public insertWidget(widgetInstance: WidgetInstance): void {
    if(MyApp.templates._widgetsTemplates === undefined) {
      MyApp.templates._widgetsTemplates = [];
    }
    if(MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias] === undefined) {
      this._loadWidgetContentAndInsert(widgetInstance);
    } else {
      let currentTabId: number = this._getForcedCurrentTabId();
      this._insertWidget(widgetInstance, currentTabId);
    }
  }

  private _insertWidget(widgetInstance: WidgetInstance, currentTabId: number): void {
    let content: string, html: string;
    try {
      content = MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias]();
      let width:string = $(content).attr("data-min-width") + "px";
      let height:string = $(content).attr("data-min-height") + "px";
      let left: string, top: string;
      left = ($(".jsTabContent.jsShow").width() / 2).toString() + "px";
      top = ($(".jsTabContent.jsShow").height() / 2).toString() + "px";
      html = MyApp.templates.widget({WidgetInstance: widgetInstance, content: content, left: left, top: top, width: width, height: height});
    } catch(ex) {

    }
    $("div.jsTabContent[data-tab-id=" + currentTabId + "]").append(html);
  }

  private _getForcedCurrentTabId(): number {
    let currentTabId: number = this._getCurrentTabId();
    if(currentTabId === 0) {
      this.Trigger.newTab();
    }
    return this._getCurrentTabId();
  }
  private _getCurrentTabId(): number {
    let tabIdStr: string = $("div.jsTab.jsActive").attr("data-tab-id");
    if(tabIdStr === undefined) {
      return 0;
    }
    let tabId: number = parseInt(tabIdStr);
    return tabId;
  }

}
