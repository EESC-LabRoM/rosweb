/// <reference path="../typings/tsd.d.ts" />

// model
import {Tab} from "./tab"
import {Widget} from "./widget"
import {WidgetInstance} from "./widget_instance"

// super
import {frontend} from "../super/frontend"

interface genericList {
  object: string;
  list: Array<any>;
}
interface genericCounter {
  object: string;
  counter: number;
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
  public create<T extends { id: number }>(object: T): void {
    let className: string = object.constructor.name;

    function filter(list: genericList | genericCounter) {
      return (list.object == className);
    }

    let list = this.Lists.filter(filter);
    let counter = this.Counters.filter(filter);

    if (list.length != 1 || counter.length != 1) {
      throw new Error("Workspace list searching error");
    }

    object.id = ++counter[0].counter;
    /*
    switch (object.constructor.name) {
      case "Tab":
        object.id = ++this._TabCounter;
        let obj: Tab = object;
        this.Tabs.push(obj);
        break;
      case "Widget":
        object.id = ++this._WidgetCounter;
        this.Widgets.push(object);
        break;
      case "WidgetInstance":
        object.id = ++this._WidgetInstanceCounter;
        this.WidgetInstances.push(object);
        break;
    }
    */
  }

  public save<T>(object: T): void {
    let list: Array<T> = new Array<T>();
    switch (typeof (object)) {
      case "Tab":
        break;
      case "Widget":
        list.push(object);
        //this.Widgets.push(object);
        break;
      case "WidgetInstance":
        break;
    }
  }

  public get<T>(id: number): T {
    let obj: T;
    let list: Array<any>;

    switch (typeof (obj)) {
      case "Tab":
        list = this.Tabs;
        break;
      case "Widget":
        list = this.Widgets;
        break;
      case "WidgetInstance":
        break;
      default:
        throw new Error("Type T[" + typeof (obj) + "] has not a treatment");
    }

    list.forEach((element: { id: number }) => {
      if (element.id == id) return element;
    });

    throw new Error("Object of type T[" + typeof (obj) + "] and id=" + id + " was not found");
  }

}

export var currentWorkspace: Workspace = new Workspace();
