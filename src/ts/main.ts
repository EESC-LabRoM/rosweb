/// <reference path="./typings/tsd.d.ts" />

// Events
import {TabEvents} from "./events/tab.ts";
import {WidgetEvents} from "./events/widget.ts";
import {WidgetInstanceEvents} from "./events/widget_instance.ts";
import {RosEvents} from "./events/ros.ts";

// Super
import {db} from "./super/db.ts";

// Models
import {Widget} from "./model/widget.ts";

export var ros: ROSLIB.Ros = new ROSLIB.Ros("");

function init() {
  events(ros);
  insertWidgets();
}

function events(ros: ROSLIB.Ros): void {
  let tabEvents: TabEvents = new TabEvents();
  let widgetEvents: WidgetEvents = new WidgetEvents(ros);
  let widgetInstanceEvents: WidgetInstanceEvents = new WidgetInstanceEvents(ros);
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
