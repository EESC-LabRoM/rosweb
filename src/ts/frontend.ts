/// <reference path="d/handlebars.d.ts" />
/// <reference path="d/jquery.d.ts" />

import {Tab} from "./model/tab.ts";
import {Widget} from "./model/widget.ts";
import {WidgetInstance} from "./model/widget_instance.ts";
import {Names} from "./names.ts";

declare var MyApp: any;

export class Frontend {
  
  public tabContainerId: string;
  public tabContentContainerId: string;
  
  private Names: Names;
  
  private ActiveTabId: number;
  
  constructor() {
    this.tabContainerId = "header2";
    this.tabContentContainerId = "tabs";
    
    this.Names = new Names();
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
    let fn = this._insertWidget;
    $.ajax({
      url: "widgets/" + widgetInstance.Widget.alias + "/index.hbs",
      beforeSend: function() {

      },
      success: function(data: string) {
        MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias] = Handlebars.compile(data);
        fn(widgetInstance);
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
    }
    this._insertWidget(widgetInstance);
  }

  private _insertWidget(widgetInstance: WidgetInstance): void {
    var content = MyApp.templates._widgetsTemplates[widgetInstance.Widget.alias]();
    console.log(content);
    var html = MyApp.templates.widget({WidgetInstance: widgetInstance, content: content});
    console.log(html);
  }

}
