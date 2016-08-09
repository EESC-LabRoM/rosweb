/// <reference path="./typings/tsd.d.ts" />

// Events
import {TabEvents} from "./events/tab.ts";
import {WidgetEvents} from "./events/widget.ts";
import {WidgetInstanceEvents} from "./events/widget_instance.ts";
import {RosEvents} from "./events/ros.ts";

// Super
import {Manager} from "./super/manager.ts";
import {Db} from "./super/db.ts";

// Models
import {Widget} from "./model/widget.ts";

export var db:Db;

function init() {
  db = new Db();
  let manager: Manager = new Manager();
  let ros: ROSLIB.Ros = new ROSLIB.Ros("");

  events(manager, ros);
  insertWidgets();
}

function events(manager: Manager, ros: ROSLIB.Ros): void {
  let tabEvents: TabEvents = new TabEvents(manager);
  let widgetEvents: WidgetEvents = new WidgetEvents(ros);
  let widgetInstanceEvents: WidgetInstanceEvents = new WidgetInstanceEvents();
  let rosEvents: RosEvents = new RosEvents(ros);
}

function insertWidgets(): void {
    // load list of available widgets
    let widget = db.newWidget();
    widget.id = 1;
    widget.name = "GMaps Viewer";
    widget.alias = "gmaps_gps";
    widget.url = "./widgets/gmaps_gps";

    widget = db.newWidget();
    widget.id = 2;
    widget.name = "Tests";
    widget.alias = "tests";
    widget.url = "./widgets/tests";
}

init();
