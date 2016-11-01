/// <reference path="../typings/tsd.d.ts" />

// Parent Class
import { EventsParent } from "./events";

// Models
import { WidgetInstance } from "../model/widget_instance";
import { Tab } from "../model/tab";
import { currentWorkspace } from "../model/workspace";

// Super classes
// import {db} from "../super/db"
import { Design } from "../super/design"
import { Frontend } from "../super/frontend"

export class TabEvents extends EventsParent {

  private Frontend: Frontend;
  private Design: Design;

  constructor() {
    super();

    this.Frontend = new Frontend();
    this.Design = new Design();

    // Resize Events
    this.DelegateEvent(window, "resize", this._windowResized);

    // Left Click Events
    this.DelegateEvent(".jsEventNothing", "click", this.nothing);
    this.DelegateEvent(".jsEventNewTab", "click", this.newTab);
    this.DelegateEvent(".jsEventTab", "click", this.selectTab);
    this.DelegateEvent(".jsEventCloseTab", "click", this.closeTab);

    this.DelegateEvent(".jsRosweb", "click", (e?: MouseEvent) => {
      console.log(currentWorkspace);
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
    var tab: Tab = new Tab();
    this._selectTab(tab);
  }

  public selectTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    let tab: Tab = currentWorkspace.get<Tab>(tabId, "Tab");
    this._selectTab(tab);
    e.preventDefault();
  }
  private _selectTab(selectedTab: Tab): void {
    let list: Tab[] = currentWorkspace.getList<Tab>("Tab");
    list.forEach((tab: Tab, index: number) => {
      if (selectedTab.id != tab.id) tab.active = false;
    });
    selectedTab.setActive();

    let widgetInstances = currentWorkspace.getList<WidgetInstance>("WidgetInstance");
    widgetInstances.forEach((widgetInstance: WidgetInstance, index: number) => {
      widgetInstance.WidgetCallbackClass["clbkTab"](selectedTab.id == widgetInstance.tab_id);
    });
  }

  public closeTab = (e?: MouseEvent) => {
    let tabId: number = parseInt($(e.toElement).attr("data-tab-id"));
    if (confirm("Are you sure you want to close tab #" + tabId + " ?")) {
      this._closeTab(tabId);
    }
    e.preventDefault();
  }
  private _closeTab(tabId: number): void {
    currentWorkspace.remove<Tab>(tabId, "Tab");
    this.Frontend.closeTab(tabId);
  }

}
