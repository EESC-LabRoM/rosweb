// Models
import {Geometry} from "../types/Geometry";
import {Widget} from "./widget";
import {Tab} from "./tab";
import {instance_loader} from "../super/instance_loader";

export class WidgetInstance {

  public id: number;
  public tab_id: number;
  public widget_id: number;
  public WidgetCallbackClass: any;
  public position: Geometry.Point2D;
  public size: Geometry.Point2D;

  constructor(id: number, widget: Widget) {
    this.id = id;
    this.widget_id = widget.id;
    this.position = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };
    this.WidgetCallbackClass = instance_loader.getInstance<any>(window, "Widget" + widget.alias.charAt(0).toUpperCase() + widget.alias.slice(1), this.id);
  }

}