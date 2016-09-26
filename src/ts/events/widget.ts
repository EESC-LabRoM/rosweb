/// <reference path="../typings/tsd.d.ts" />

// Super
import {Frontend} from "../super/frontend.ts";
import {db} from "../super/db.ts";

// Model
import {Widget} from "../model/widget.ts";

// Parent Class
import {EventsParent} from "./events.ts";

export class WidgetEvents extends EventsParent {

  public Frontend : Frontend = new Frontend();
  public Ros : ROSLIB.Ros;

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
    let widgetAlias = $(e.toElement).attr("data-widget-alias");
    this._widgetItem(widgetAlias);
    this._widgetMenu();
    e.preventDefault();
  }
  private _widgetItem(widgetAlias: string): void {
    let widget: Widget = db.getWidgetByAlias(widgetAlias);
    let widgetInstance = db.newWidgetInstance(widget);
    this.Frontend.insertWidgetInstance(widgetInstance, widgetInstance.WidgetCallbackClass.clbkCreated);
  }

}