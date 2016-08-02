/// <reference path="../../typings/tsd.d.ts" />

// Parent Class
import {EventsParent} from "./_parent.ts";

export class WidgetsEvents extends EventsParent {

  constructor() {
    super();
    this.DelegateEvent(".jsWidgetContainer a", "click", this.nothing);
    this.DelegateEvent(".jsWidgetConfirm", "click", this.WidgetConfirm);
    this.DelegateEvent(".jsWidgetDelete", "click", this.WidgetDelete);
    this.DelegateEvent(".jsWidgetSettings", "click", this.WidgetSettings);
  }

  public WidgetConfirm = (e?: MouseEvent) => {
    $(e.toElement).closest(".jsWidgetContainer").attr("data-widget-conf", "0");
    e.preventDefault();
  }

  public WidgetDelete = (e?: MouseEvent) => {
    $(e.toElement).closest(".jsWidgetContainer").remove();
    e.preventDefault();
  }

  public WidgetSettings = (e?: MouseEvent) => {
    e.preventDefault();
  }

}