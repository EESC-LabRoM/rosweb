// Models
import {Geometry} from "../types/Geometry.ts";
import {Widget} from "./widget.ts";
import {Tab} from "./tab.ts";
import {Subscription} from "./subscription.ts";
import {loader} from "../super/instance_loader.ts";

export class WidgetInstance {
  
  public id: number;
  public Widget: Widget;
  public Subscriptions: Array<Subscription>;
  public WidgetCallbackClass: any;
  public Tab: Tab;
  public position: Geometry.Point2D;

  public obj: any;
  
  constructor(widget: Widget) {
    this.Widget = widget;
    this.Subscriptions = new Array<Subscription>();
    this.WidgetCallbackClass = loader.getInstance<any>(window, "Widget" + this.Widget.alias.charAt(0).toUpperCase() + this.Widget.alias.slice(1));
  }
  
}