import {Tab} from "./model/tab.ts";
import {Widget} from "./model/widget.ts";
import {WidgetInstance} from "./model/widget_instance.ts";
import {Frontend} from "./frontend.ts";

export class WidgetsManager {

  private Frontend: Frontend;

  public widgets: Array<Widget>;
  private widgetInstanceCurrentId = 0;

  constructor() {
    this.Frontend = new Frontend();

    this.widgets = new Array<Widget>();

    // load list of available widgets
    let widget = new Widget();
    widget.id = 1;
    widget.name = "GMaps Viewer";
    widget.alias = "gmaps_gps";
    widget.url = "./widgets/gmaps_gps";
    this.widgets.push(widget);

    widget = new Widget();
    widget.id = 2;
    widget.name = "Tests";
    widget.alias = "tests";
    widget.url = "./widgets/tests";
    this.widgets.push(widget);

    // render list
    this.Frontend.widgetsList(this.widgets);
  }

  public getByName(widgetAlias: string): Widget {
    let widget = new Widget();
    let toReturn: Widget = null;
    this.widgets.forEach(element => {
      if (element.alias === widgetAlias) {
        toReturn = element;
      }
    });
    if (toReturn === null) throw "Error: Widget alias not found!";
    return toReturn;
  }

  private _getCurrentTab(): Tab {
    let tab: Tab = new Tab();

    return tab;
  }

  public newInstanceOf(widget: Widget): WidgetInstance {
    let widgetInstance = new WidgetInstance();
    widgetInstance.id = ++this.widgetInstanceCurrentId;
    widgetInstance.Widget = widget;

    return widgetInstance;
  }

}
