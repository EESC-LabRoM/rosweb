import {Widget} from "./model/widget.ts";
import {Frontend} from "./frontend.ts";

export class WidgetsManager {
  
  private Frontend: Frontend;
  
  public widgets: Array<Widget>;
  
  constructor() {
    this.Frontend = new Frontend();
    
    this.widgets = new Array<Widget>();
    let widget = new Widget();
    
    // load list of available widgets
    widget.id = 1;
    widget.name = "GMaps Viewer";
    widget.url = "./widgets/gmaps_gps";
    this.widgets.push(widget);
    
    // render list
    this.Frontend.widgetsList(this.widgets);
  }
  
}