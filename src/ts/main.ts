/// <reference path="./typings/tsd.d.ts" />

// Events
import {TabEvents} from "./events/tab.ts";
import {WidgetEvents} from "./events/widget.ts";
import {WidgetInstanceEvents} from "./events/widget_instance.ts";
import {RosEvents} from "./events/ros.ts";

// Super
import {db} from "./super/db.ts";
import {Frontend} from "./super/frontend.ts";

// Models
import {Widget} from "./model/widget.ts";

export var ros: ROSLIB.Ros = new ROSLIB.Ros("");

function init() {
  insertWidgets();
  events(ros);
}

function events(ros: ROSLIB.Ros): void {
  let tabEvents: TabEvents = new TabEvents();
  let widgetEvents: WidgetEvents = new WidgetEvents(ros);
  let widgetInstanceEvents: WidgetInstanceEvents = new WidgetInstanceEvents(ros);
  let rosEvents: RosEvents = new RosEvents(ros);
}

function insertWidgets(): void {
  // load list of available widgets
  /*
  let widget = db.newWidget();
  widget.id = 1;
  widget.name = "GMaps Viewer";
  widget.alias = "gmaps_gps";
  widget.url = "./widgets/gmaps_gps";
  */

  let widget = db.newWidget();
  widget.id = 1;
  widget.name = "Topic Viewer";
  widget.alias = "TopicViewer";
  widget.url = "./widgets/topic_viewer";

  // insert Widgets JS and CSS tags
  let frontend = new Frontend();
  frontend.InsertWidgetsTags();
}

init();
