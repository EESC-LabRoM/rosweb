/// <reference path="d/handlebars.d.ts" />
/// <reference path="d/jquery.d.ts" />

import {Tab} from "./tab.ts";
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
    let className = this.Names.eventsClassPrefix + "Tab";
    $("." + className).removeClass("jsActive");
    $("." + className + "[data-tab-id=" + tab.id + "]").addClass("jsActive");
    let tabClassName = this.Names.classTabContent;
    $("." + tabClassName).removeClass("jsShow").addClass("jsHide");
    $("." + tabClassName + "[data-tab-id=" + tab.id + "]").removeClass("jsHide").addClass("jsShow");
    this.ActiveTabId = tab.id;
  }
  
  public widgetsMenu() {
    $("." + this.Names.classWidgetsList).animate({width: 'toggle'});
  }

}