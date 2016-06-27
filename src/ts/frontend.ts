/// <reference path="d/handlebars.d.ts" />
/// <reference path="d/jquery.d.ts" />

import {Tab} from "./tab";

declare var MyApp: any;

export class Frontend {
  
  public tabContainerId: string;
  public tabContentContainerId: string;
  
  constructor() {
    this.tabContainerId = "header2";
    this.tabContentContainerId = "content";
  }
  
  public formTab(tab?: Tab): Tab {
    if(tab) {
      
    }
    return new Tab();
  }

  public newTab(tab: Tab): void {
    var tabHtml = MyApp.templates.tab(tab);
    var tabContentHtml = MyApp.templates.tabContent(tab);
    // insert tab
    document.getElementById(this.tabContainerId).innerHTML += tabHtml;
    // insert tab content
    document.getElementById(this.tabContentContainerId).innerHTML += tabContentHtml;
  }

}