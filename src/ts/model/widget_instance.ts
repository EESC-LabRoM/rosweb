// Models
import {Geometry} from "../types/Geometry.ts";
import {Widget} from "./widget.ts";
import {Tab} from "./tab.ts";
import {Subscription} from "./subscription.ts";

export class WidgetInstance {
  
  public id: number;
  public Widget: Widget;
  public Subscriptions: Array<Subscription>;
  public Tab: Tab;
  public position: Geometry.Point2D;

  public obj: any;
  
  constructor(widget: Widget) {
    this.Widget = widget;
    this.Subscriptions = new Array<Subscription>();
  }
  
}