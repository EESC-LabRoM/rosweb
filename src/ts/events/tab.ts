/// <reference path="../typings/tsd.d.ts" />

// Parent Class
import {EventsParent} from "./events.ts";

// Models
import {Tab} from "../model/tab.ts";

// Super classes
import {Manager} from "../super/manager.ts";

export class TabEvents extends EventsParent {
  
  private eventsClassPrefix : string = "jsEvent";
  private Manager: Manager;
  
  constructor(manager: Manager) {
    super();
    this.Manager = manager;

    // render list
    this.Manager.Frontend.widgetsList(this.Manager.WidgetsManager.widgets);

    // Resize Events
    this.DelegateEvent(window, "resize", this._windowResized);
    
    // Left Click Events
    this.DelegateEvent("." + this.eventsClassPrefix + "Nothing", "click", this.nothing);
    this.DelegateEvent("." + this.eventsClassPrefix + "NewTab", "click", this.newTab);
    this.DelegateEvent("." + this.eventsClassPrefix + "Tab", "click", this.selectTab);
    this.DelegateEvent("." + this.eventsClassPrefix + "CloseTab", "click", this.closeTab);
  }

  private _windowResized = (e?: MouseEvent) => {
    this.Manager.Design.adjustWindowResize();
  }
  
  public newTab = (e?: MouseEvent) => {
    this._newTab();
    e.preventDefault();
  }
  private _newTab() {
    var tab: Tab = this.Manager.Db.newTab();
    tab = this.Manager.Frontend.formTab(tab);
    this.Manager.Frontend.newTab(tab);
    this._selectTab(tab);
  }
  
  public selectTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    let tab: Tab = this.Manager.Db.getTab(tabId);
    this._selectTab(tab);
    e.preventDefault();
  }
  private _selectTab(tab: Tab): void {
    this.Manager.Frontend.selectTab(tab);
  }
  
  public closeTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    if(confirm("Are you sure you want to close tab #" + tabId + " ?")) {
      this._closeTab(tabId);
    }
    e.preventDefault();
  }
  private _closeTab(tabId: number): void {
    this.Manager.Db.removeTab(tabId);
    this.Manager.Frontend.closeTab(tabId);
  }
  
}
