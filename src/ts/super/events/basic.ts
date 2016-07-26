/// <reference path="../../d/jquery.d.ts" />

// Parent Class
import {EventsParent} from "./_parent.ts";

// Models
import {Tab} from "../../model/tab.ts";

// Super classes
import {Db} from "../db.ts";
import {Design} from "../design.ts";
import {Frontend} from "../frontend.ts";
import {WidgetsManager} from "../widgets_manager.ts";

export class BasicEvents extends EventsParent {
  
  private eventsClassPrefix : string = "jsEvent";
  private Db: Db;
  private Frontend: Frontend;
  private WidgetsManager: WidgetsManager;
  private Design: Design;
  
  constructor() {
    super();
    this.Db = new Db();
    this.Frontend = new Frontend();
    this.WidgetsManager = new WidgetsManager();
    this.Design = new Design();

    // render list
    this.Frontend.widgetsList(this.WidgetsManager.widgets);

    // Resize Events
    this.DelegateEvent(window, "resize", this._windowResized);
    
    // Left Click Events
    this.DelegateEvent("." + this.eventsClassPrefix + "WidgetsMenu", "click", this.widgetMenu);
    this.DelegateEvent("." + this.eventsClassPrefix + "Nothing", "click", this.nothing);
    this.DelegateEvent("." + this.eventsClassPrefix + "NewTab", "click", this.newTab);
    this.DelegateEvent("." + this.eventsClassPrefix + "Tab", "click", this.selectTab);
    this.DelegateEvent("." + this.eventsClassPrefix + "CloseTab", "click", this.closeTab);
    this.DelegateEvent("." + this.eventsClassPrefix + "WidgetItem", "click", this.widgetItem);
  }

  private _windowResized = (e?: MouseEvent) => {
    this.Design.adjustWindowResize();
  }
  
  public newTab = (e?: MouseEvent) => {
    this._newTab();
    e.preventDefault();
  }
  private _newTab() {
    var tab: Tab = this.Db.newTab();
    tab = this.Frontend.formTab(tab);
    this.Frontend.newTab(tab);
    this._selectTab(tab);
  }
  
  public selectTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    let tab: Tab = this.Db.getTab(tabId);
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
    this.Db.removeTab(tabId);
    this.Frontend.closeTab(tabId);
  }
  
  public widgetMenu = (e?: MouseEvent) => {
    this._widgetMenu();
    e.preventDefault();
  }
  private _widgetMenu() {
    this.Frontend.showWidgetsMenu();
  }
  
  public widgetItem = (e?: MouseEvent) => {
    let widgetAlias = $(e.toElement).attr("data-widget-alias");
    this._widgetItem(widgetAlias);
    this._widgetMenu();
    e.preventDefault();
  }
  private _widgetItem(widgetAlias: string): void {
    let widget = this.WidgetsManager.getByName(widgetAlias);
    let widgetInstance = this.WidgetsManager.newInstanceOf(widget);
    this.Frontend.insertWidget(widgetInstance);
  }
  
}
