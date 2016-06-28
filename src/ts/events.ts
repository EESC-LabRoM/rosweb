/// <reference path="d/jquery.d.ts" />

import {Frontend} from "./frontend.ts";
import {Tab} from "./tab.ts";

export class Events {
  
  private eventsClassPrefix : string = "jsEvent";
  private frontend: Frontend;
  
  // constructor
  constructor() {
    this.frontend = new Frontend();
    this.delegateClassEvent("NewTab", "click", this.newTab);
    this.delegateClassEvent("Tab", "click", this.tab);
  }
  
  // private methods
  private delegateClassEvent(className: string, eventType: string, method: () => void) {
    $(document).delegate("." + this.eventsClassPrefix + className, eventType, method);
    /*
    let elements : NodeListOf<Element> = document.getElementsByClassName(this.eventsClassPrefix + "NewTab");
    for(let element of elements) {
      element.addEventListener("click", method);
    }
    */
  }
  
  // new tab
  public newTab = (e?: MouseEvent) => {
    var tab: Tab = new Tab();
    tab.id = 1;
    tab.name = "tab #1";
    this.frontend.newTab(tab);
    e.preventDefault();
  }

  public tab = (e?: MouseEvent) => {
    let tab_id: number = parseInt($(e.toElement).attr("data-tab-id"));
    e.preventDefault();
  }
  
}
