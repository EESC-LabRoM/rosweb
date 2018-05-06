/// <reference path="../typings/tsd.d.ts" />

// model
import { Tab } from "./tab"
import { WidgetGroup } from "./widget_group"
import { Widget } from "./widget"
import { WidgetInstance } from "./widget_instance"
import { SerializedWorkspace } from "../model/serialized_workspace";

// super
import { frontend } from "../super/frontend"

var className: string = "";

interface genericList {
  object: string;
  list: Array<any>;
}
interface genericCounter {
  object: string;
  counter: number;
}
function genericFilter(list: genericList | genericCounter, index: number, array: Array<any>): boolean {
  return (list.object == className);
}

export class Workspace {

  public id: number;
  public name: string;
  public created: Date;
  public modified: Date;

  private Lists: genericList[];
  private Counters: genericCounter[];

  constructor() {
    this._clearLists();
    this._clearCounters();
  }

  public initWorkspace() {
    this._initWorkspace();
  }
  private _initWorkspace() {
    let wg: WidgetGroup = new WidgetGroup("ROS basics");
    new Widget(wg.id, "Topic Subscriber", "TopicSubscriber", "./widgets/topic_subscriber");
    new Widget(wg.id, "Topic Publisher", "TopicPublisher", "./widgets/topic_publisher");
    new Widget(wg.id, "Param Viewer", "ParamViewer", "./widgets/param_viewer");
    new Widget(wg.id, "Service Viewer", "ServiceViewer", "./widgets/service_viewer");
    new Widget(wg.id, "ActionLib Tool", "ActionLibTool", "./widgets/action_lib_tool");
 
    wg = new WidgetGroup("Sensors");
    new Widget(wg.id, "Google Maps GPS Viewer", "GoogleMapsGpsViewer", "./widgets/gmaps_gps");
    new Widget(wg.id, "Camera Viewer", "CameraViewer", "./widgets/camera_viewer");
    new Widget(wg.id, "Laser Scan Viewer", "LaserScanViewer", "./widgets/laser_scan_viewer");
    new Widget(wg.id, "IMU Viewer", "ImuViewer", "./widgets/imu_viewer");
 
    wg = new WidgetGroup("3D Viewer");
    new Widget(wg.id, "ROS 3D Viewer", "ROS3DViewer", "./widgets/ros_3d_viewer");

    wg = new WidgetGroup("Diagnostics");
    new Widget(wg.id, "Diagnostics Viewer", "DiagnosticsViewer", "./widgets/diagnostics_viewer");
    new Widget(wg.id, "Log reader", "LogReader", "./widgets/log_reader");

    wg = new WidgetGroup("Development");
    new Widget(wg.id, "New Widget", "NewWidget", "./widgets/new_widget");
  }

  private _clearWorkspace() {
    frontend.ClearWorkspace();

    this._clearLists();
    this._clearCounters();

    this._initWorkspace();
  }
  private _clearLists() {
    this.Lists = new Array<genericList>(
      { object: "Tab", list: new Array<Tab>() },
      { object: "WidgetGroup", list: new Array<Tab>() },
      { object: "Widget", list: new Array<Widget>() },
      { object: "WidgetInstance", list: new Array<WidgetInstance>() }
    );
  }
  private _clearCounters() {
    this.Counters = new Array<genericCounter>(
      { object: "Tab", counter: 0 },
      { object: "WidgetGroup", counter: 0 },
      { object: "Widget", counter: 0 },
      { object: "WidgetInstance", counter: 0 }
    );
  }

  public loadWorkspace(workspace: SerializedWorkspace): void {
    let data: { Lists: genericList[], Counters: genericCounter[] } = JSON.parse(workspace.data);

    this._clearWorkspace();

    data.Lists.forEach((glist: genericList, i: number) => {
      if (glist.object == "Tab") {
        glist.list.forEach((tab: Tab, j: number) => {
          new Tab(tab.name);
        });
      }
    });

    data.Lists.forEach((glist: genericList, i: number) => {
      if (glist.object == "WidgetInstance") {
        glist.list.forEach((widgetInstance: WidgetInstance, j: number) => {
          let widget: Widget = this.get<Widget>(widgetInstance.widget_id, "Widget");
          let tab: Tab = this.get<Tab>(widgetInstance.tab_id, "Tab");
          let createdWidgetInstance = new WidgetInstance(widget, tab, widgetInstance.position, widgetInstance.size);
        });
      }
    });

    this.Counters = data.Counters;
  }
  public extractData(): string {
    let data: any = { Lists: this.Lists, Counters: this.Counters };
    data.Lists.forEach((list: genericList, index: number) => {
      switch (list.object) {
        case "WidgetInstance":
          list.list.forEach((widgetInstance: any, index: number) => {
            widgetInstance["WidgetCallbackClass"] = null;
          });
          break;
      }
    });
    let dataString: string = JSON.stringify(data);
    return dataString;
  }

  private getCounter<T>(): genericCounter {
    let counter = this.Counters.filter(genericFilter);
    if (counter.length != 1) {
      throw new Error("Workspace list searching error");
    }
    return counter[0];
  }
  public getList<T>(aClassName?: string): any[] {
    if (aClassName != undefined) className = aClassName;

    let list = this.Lists.filter(genericFilter);

    if (list.length != 1) {
      throw new Error("Workspace list searching error");
    }

    return list[0].list;
  }
  public create<T extends { id: number }>(object: T): void {
    let aClassName: string = object.constructor["name"];
    className = aClassName;

    let counter: genericCounter = this.getCounter<T>();
    let list: any[] = this.getList<T>();

    object.id = ++counter.counter;
    list.push(object);
  }

  public get<T extends { id: number }>(id: number, aClassName: string): T {
    className = aClassName;
    let list = this.Lists.filter(genericFilter)[0].list;

    function getFilter(element: T, index: number, array: Array<T>): boolean {
      return element.id == id;
    };
    let filteredList: any[] = list.filter(getFilter);

    if (filteredList.length != 1) {
      console.log(list);
      throw new Error("No unique " + aClassName + " found with id equals to " + id + " on the list above");
    }

    return filteredList[0];
  }
  public getCurrentTab(): Tab {
    className = "Tab";
    let list = this.Lists.filter(genericFilter)[0].list;
    let tab: Tab;

    if (list.length == 0) {
      tab = new Tab();
    }

    function activeTabFilter(tab: Tab, index: number, array: Array<Tab>): boolean {
      return tab.active == true;
    }
    let filteredList: Tab[] = list.filter(activeTabFilter);
    tab = filteredList[0];

    return tab;
  }

  public remove<T extends { id: number }>(id: number, aClassName: string) {
    className = aClassName;
    let list = this.Lists.filter(genericFilter)[0].list;

    let toRemove: number = null;
    list.forEach((obj: { id: number }, index: number) => {
      if (obj.id == id) {
        toRemove = index;
      }
    });

    if (toRemove == null) {
      console.log(list);
      throw new Error("No unique " + aClassName + " found with id equals to " + id + " on the list above");
    } else {
      list.splice(toRemove, 1);
    }
  }

}

export var currentWorkspace: Workspace = new Workspace();
