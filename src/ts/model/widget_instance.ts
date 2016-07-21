import {Geometry} from "../interfaces/Geometry.ts";
import {Widget} from "./widget.ts";
import {Tab} from "./tab.ts";

export class WidgetInstance {
  
  public id: number;
  public Widget: Widget;
  public Tab: Tab;
  public position: Geometry.Point2D;
  
  constructor() {
    
  }
  
}