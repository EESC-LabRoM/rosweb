/// <reference path="../typings/tsd.d.ts" />

// Parent Class
import {EventsParent} from "./events.ts";

// Models
import {Tab} from "../model/tab.ts";

// Super classes
import {db} from "../super/db.ts";
import {Design} from "../super/design.ts";
import {Frontend} from "../super/frontend.ts";

export class TabEvents extends EventsParent {
  
  private Frontend: Frontend;
  private Design: Design;
  
  constructor() {
    super();

    this.Frontend = new Frontend();
    this.Design = new Design();

    // render list
    this.Frontend.widgetsList(db.Widgets);

    // Resize Events
    this.DelegateEvent(window, "resize", this._windowResized);
    
    // Left Click Events
    this.DelegateEvent(".jsEventNothing", "click", this.nothing);
    this.DelegateEvent(".jsEventNewTab", "click", this.newTab);
    this.DelegateEvent(".jsEventTab", "click", this.selectTab);
    this.DelegateEvent(".jsEventCloseTab", "click", this.closeTab);
    
    this.DelegateEvent(".jsRosweb", "click", (e?: MouseEvent) => {
      console.log(db);
      e.preventDefault();
    });
  }

  private _windowResized = (e?: MouseEvent) => {
    this.Design.adjustWindowResize();
  }
  
  public newTab = (e?: MouseEvent) => {
    this._newTab();
    e.preventDefault();
  }
  private _newTab() {
    var tab: Tab = db.newTab();
    tab = this.Frontend.formTab(tab);
    this.Frontend.newTab(tab);
    this._selectTab(tab);
  }
  
  public selectTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    let tab: Tab = db.getTab(tabId);
    this._selectTab(tab);
    e.preventDefault();
  }
  private _selectTab(tab: Tab): void {
    this.Frontend.selectTab(tab);
  }
  
  public closeTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    if(confirm("Are you sure you want to close tab #" + tabId + " ?")) {
      this._closeTab(tabId);
    }
    e.preventDefault();
  }
  private _closeTab(tabId: number): void {
    db.removeTab(tabId);
    this.Frontend.closeTab(tabId);
  }
  
}
