// Models
import {Workspace} from "../model/workspace.ts";
import {Tab} from "../model/tab.ts";
import {Widget} from "../model/widget.ts";
import {WidgetInstance} from "../model/widget_instance.ts";

import {Frontend} from "../super/frontend.ts";
import {instance_loader} from "../super/instance_loader.ts";

export class Db {

  private Frontend: Frontend;

  constructor() {
    this.Frontend = new Frontend();

    this.TabCounter = 0;
    this.Tabs = new Array<Tab>();

    this.WidgetCounter = 0;
    this.Widgets = new Array<Widget>();

    this.WidgetInstanceCounter = 0;
    this.WidgetInstances = new Array<WidgetInstance>();
  }
  private saveAll(): void {

  }

  // Loading workspace
  public loadWorkspace(workspace: Workspace): void {
    /*
    this.TabCounter = workspace.db.TabCounter;
    this.Tabs = workspace.db.Tabs;

    this.WidgetInstanceCounter = 0;
    this.WidgetInstances = new Array<WidgetInstance>();

    this._ClearWorkspace();
    this._GenerateWorkspace(workspace.db.WidgetInstances);
    */
  }
  private _ClearWorkspace(): void {
    $(".jsTab, .jsTabContent").remove();
  }
  private _GenerateWorkspace(widgetInstances: WidgetInstance[]): void {
    /*
    this.Tabs.forEach((tab: Tab, index: number) => {
      this.Frontend.newTab(tab);
      this.Frontend.selectTab(tab);
      widgetInstances.forEach((widgetInstance: WidgetInstance, index: number) => {
        if (widgetInstance.tab_id == tab.id) {
          let widget: Widget = db.getWidget(widgetInstance.widget_id);
          let newWidgetInstance = db.newWidgetInstance(widget);
          this.Frontend.insertWidgetInstance(newWidgetInstance, () => {
            newWidgetInstance.WidgetCallbackClass.clbkCreated();
            this.Frontend.setWidgetInstancePosition(newWidgetInstance, widgetInstance.position);
            this.Frontend.setWidgetInstanceSize(newWidgetInstance, widgetInstance.size);
          });
        }
      });
    });
    */
  }

  // Tab
  public TabCounter: number;
  public Tabs: Array<Tab>;
  public newTab(): Tab {
    let tab = new Tab();
    tab.id = ++this.TabCounter;
    this.Tabs.push(tab);
    return tab;
  }
  public getTab(id: number): Tab {
    for (let tab of this.Tabs) {
      if (tab.id == id) return tab;
    }
    return null;
  }
  public removeTab(tab_id: number): boolean {
    let index: number = 0;
    for (let tab of this.Tabs) {
      if (tab.id == tab_id) {
        this.Tabs.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }

  // Widget
  public WidgetCounter: number;
  public Widgets: Array<Widget>;
  public newWidget(name: string, url: string, alias: string): Widget {
    let widget = new Widget(name, url, alias);
    widget.id = ++this.WidgetCounter;
    this.Widgets.push(widget);
    return widget;
  }
  public setWidget(widget: Widget): void {
    return;
  }
  public getWidget(id: number): Widget {
    for (let widget of this.Widgets) {
      if (widget.id == id) return widget;
    }
    return null;
  }
  public getWidgetByAlias(widgetAlias: string): Widget {
    let toReturn: Widget;
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
    for (let widget of this.Widgets) {
      if (widget.id == widget_id) {
        this.Widgets.splice(index, 1);
        return true;
      }
      index++;
    }
    return false;
  }

  // Widget Instance
  public WidgetInstanceCounter: number;
  public WidgetInstances: Array<WidgetInstance>;
  public newWidgetInstance(widget: Widget): WidgetInstance {
    let id: number = ++this.WidgetInstanceCounter;
    let widgetInstance = new WidgetInstance(id, widget);
    this.WidgetInstances.push(widgetInstance);
    return widgetInstance;
  }
  public getWidgetInstance(id: number): WidgetInstance {
    for (let widgetInstance of this.WidgetInstances) {
      if (widgetInstance.id == id) return widgetInstance;
    }
    return null;
  }
  public removeWidgetInstance(widgetInstance_id: number): void {
    let index: number = 0;
    function removeId(widgetInstance: WidgetInstance) {
      return widgetInstance.id != widgetInstance_id;
    }
    this.WidgetInstances = this.WidgetInstances.filter(removeId);
  }

}

export var db: Db = new Db();
