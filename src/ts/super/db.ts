// Models
import {Tab} from "../model/tab.ts";
import {Widget} from "../model/widget.ts";
import {WidgetInstance} from "../model/widget_instance.ts";

export class Db {
  
  constructor() {
    this.TabCounter = 0;
    this.Tabs = new Array<Tab>();

    this.WidgetCounter = 0;
    this.Widgets = new Array<Widget>();

    this.WidgetInstanceCounter = 0;
    this.WidgetInstances = new Array<WidgetInstance>();
  }
  private saveAll(): void {

  }
  
  private TabCounter: number;
  private Tabs: Array<Tab>;
  public newTab(): Tab {
    let tab = new Tab();
    tab.id = ++this.TabCounter;
    this.Tabs.push(tab);
    return tab;
  }
  public getTab(id: number): Tab {
    for(let tab of this.Tabs) {
      if(tab.id == id) return tab;
    }
    return null;
  }
  public removeTab(tab_id: number): boolean {
    let index: number = 0;
    for(let tab of this.Tabs) {
      if(tab.id == tab_id) {
        this.Tabs.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }
  
  private WidgetCounter: number;
  public Widgets: Array<Widget>;
  public newWidget(): Widget {
    let widget = new Widget();
    widget.id = ++this.WidgetCounter;
    this.Widgets.push(widget);
    return widget;
  }
  public setWidget(widget: Widget) {

  }
  public getWidget(id: number): Widget {
    for(let widget of this.Widgets) {
      if(widget.id == id) return widget;
    }
    return null;
  }

  public getWidgetByAlias(widgetAlias: string): Widget {
    let widget = new Widget();
    let toReturn: Widget = null;
    this.Widgets.forEach(widget => {
      if (widget.alias === widgetAlias) {
        toReturn = widget;
      }
    });
    if (toReturn === null) throw "Error: Widget alias not found!";
    return toReturn;
  }
  public removeWidget(widget_id: number): boolean {
    let index: number = 0;
    for(let widget of this.Widgets) {
      if(widget.id == widget_id) {
        this.Widgets.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }

  private WidgetInstanceCounter: number;
  private WidgetInstances: Array<WidgetInstance>;
  public newWidgetInstance(widget: Widget): WidgetInstance {
    let widgetInstance = new WidgetInstance();
    widgetInstance.id = ++this.WidgetInstanceCounter;
    this.WidgetInstances.push(widgetInstance);
    return widgetInstance;
  }
  public getWidgetInstance(id: number): WidgetInstance {
    for(let widgetInstance of this.WidgetInstances) {
      if(widgetInstance.id == id) return widgetInstance;
    }
    return null;
  }
  public removeWidgetInstance(widgetInstance_id: number): boolean {
    let index: number = 0;
    for(let widgetInstance of this.WidgetInstances) {
      if(widgetInstance.id == widgetInstance_id) {
        this.WidgetInstances.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }
  
}
