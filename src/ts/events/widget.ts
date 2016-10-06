/// <reference path="../typings/tsd.d.ts" />

// Super
import {Frontend} from "../super/frontend.ts"
// import {db} from "../super/db.ts"

// Model
import {Tab} from "../model/tab.ts"
import {Widget} from "../model/widget.ts"
import {WidgetInstance} from "../model/widget_instance.ts"
import {currentWorkspace} from "../model/workspace"

// Parent Class
import {EventsParent} from "./events.ts";

export class WidgetEvents extends EventsParent {

  public Frontend: Frontend = new Frontend();
  public Ros: ROSLIB.Ros;

  constructor(ros: ROSLIB.Ros) {
    super();

    this.Ros = ros;

    this.DelegateEvent(".jsEventWidgetsMenu", "click", this.widgetMenu);
    this.DelegateEvent(".jsEventWidgetItem", "click", this.widgetItem);

    this.DelegateEvent(".jsWidgetContainer a", "click", this.nothing);
  }

  public widgetMenu = (e?: MouseEvent) => {
    this._widgetMenu();
    e.preventDefault();
  }
  private _widgetMenu() {
    this.Frontend.showWidgetsMenu();
  }

  public widgetItem = (e?: MouseEvent) => {
    let widgetId: number = parseInt($(e.toElement).attr("data-widget-id"));
    let widget: Widget = currentWorkspace.get<Widget>(widgetId, "Widget");
    let tab: Tab = currentWorkspace.getCurrentTab();
    this._widgetItem(widget, tab);
    this._widgetMenu();
    e.preventDefault();
  }
  private _widgetItem(widget: Widget, tab: Tab): void {
    new WidgetInstance(widget, tab);
  }

}