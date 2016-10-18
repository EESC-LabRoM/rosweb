/// <reference path="../typings/tsd.d.ts" />

// model
import {Tab} from "./tab"
import {Widget} from "./widget"
import {WidgetInstance} from "./widget_instance"

// super
import {frontend} from "../super/frontend"

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

  private Lists: { object: string, list: Array<any> }[];
  private Counters: { object: string, counter: number }[];

  private _TabCounter: number;
  public Tabs: Tab[];

  private _WidgetCounter: number;
  public Widgets: Widget[];

  private _WidgetInstanceCounter: number;
  public WidgetInstances: WidgetInstance[];

  constructor() {
    this.Lists = new Array<genericList>(
      { object: "Tab", list: new Array<any>() },
      { object: "Widget", list: new Array<any>() },
      { object: "WidgetInstance", list: new Array<any>() }
    );
    this.Counters = new Array<genericCounter>(
      { object: "Tab", counter: 0 },
      { object: "Widget", counter: 0 },
      { object: "WidgetInstance", counter: 0 }
    );
  }

  public loadWorkspace(): void {
  }

  private getCounter<T>(): genericCounter {
    let counter = this.Counters.filter(genericFilter);
    if (counter.length != 1) {
      throw new Error("Workspace list searching error");
    }
    return counter[0];
  }
  private getList<T>(): genericList {
    let list = this.Lists.filter(genericFilter);
    if (list.length != 1) {
      throw new Error("Workspace list searching error");
    }
    return list[0];
  }
  public create<T extends { id: number }>(object: T): void {
    let aClassName: string = object.constructor["name"];
    className = aClassName;

    let counter: genericCounter = this.getCounter<T>();
    let list: genericList = this.getList<T>();

    object.id = ++counter.counter;
    list.list.push(object);
  }

  public get<T extends { id: number }>(id: number, aClassName: string): T {
    className = aClassName;
    let list = this.Lists.filter(genericFilter);

    list[0].list.forEach((element: { id: number }) => {
      if (element.id == id) return element;
    });

    throw new Error("Object of type T[" + className + "] and id=" + id + " was not found");
  }
  public getCurrentTab(): Tab {
    className = "Tab";
    let list = this.Lists.filter(genericFilter);
    if (list[0].list.length == 0) {
      new Tab();
    }
    let tab: Tab = list[0].list[0];

    return tab;
  }

  public remove<T extends { id: number }>(id: number, aClassName: string) {
    className = aClassName;
    let list = this.Lists.filter(genericFilter);

    function removeFilter(obj: { id: number }, index: number, array: Array<T>): boolean {
      return obj.id != id;
    };
    list[0].list = list[0].list.filter(removeFilter);

    /*.forEach((element: { id: number }) => {
      if (element.id == id) return element;
    });*/

    throw new Error("Object of type T[" + className + "] and id=" + id + " was not found");
  }

}

export var currentWorkspace: Workspace = new Workspace();
