// Models
import {Geometry} from "../types/Geometry"
import {Widget} from "./widget"
import {Tab} from "./tab"
import {frontend} from "../super/frontend"
import {currentWorkspace} from "./workspace"
import {instance_loader} from "../super/instance_loader"

export class WidgetInstance {

  public id: number;
  public tab_id: number;
  public widget_id: number;
  public WidgetCallbackClass: any;
  public position: Geometry.Point2D;
  public size: Geometry.Point2D;

  constructor(widget: Widget, tab: Tab) {
    this.widget_id = widget.id;
    this.tab_id = tab.id;
    this.position = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };

    currentWorkspace.create<WidgetInstance>(this);

    this.WidgetCallbackClass = instance_loader.getInstance<any>(window, "Widget" + widget.alias.charAt(0).toUpperCase() + widget.alias.slice(1), this.id);
  }

}