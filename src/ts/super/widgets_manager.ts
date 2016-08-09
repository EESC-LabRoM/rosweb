// Models
import {Tab} from "../model/tab.ts";
import {Widget} from "../model/widget.ts";
import {WidgetInstance} from "../model/widget_instance.ts";

export class WidgetsManager {

  public widgets: Array<Widget>;
  public widgetInstances: WidgetInstance[];
  private widgetInstanceCurrentId = 0;

  constructor() {
    this.widgets = new Array<Widget>();
    this.widgetInstances = new Array<WidgetInstance>();
  }

  public newInstanceOf(widget: Widget): WidgetInstance {
    let widgetInstance = new WidgetInstance();
    widgetInstance.id = ++this.widgetInstanceCurrentId;
    widgetInstance.Widget = widget;

    return widgetInstance;
  }

}
