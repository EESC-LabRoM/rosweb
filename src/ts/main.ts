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
  const a: any = 1;
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
  let widget = db.newWidget();
  widget.id = 1;
  widget.name = "Topic Viewer";
  widget.alias = "TopicViewer";
  widget.url = "./widgets/topic_viewer";

  widget = db.newWidget();
  widget.id = 2;
  widget.name = "Google Maps GPS Viewer";
  widget.alias = "GoogleMapsGpsViewer";
  widget.url = "./widgets/gmaps_gps";

  widget = db.newWidget();
  widget.id = 3;
  widget.name = "Camera Viewer";
  widget.alias = "CameraViewer";
  widget.url = "./widgets/camera_viewer";

  widget = db.newWidget();
  widget.id = 4;
  widget.name = "URDF Viewer";
  widget.alias = "UrdfViewer";
  widget.url = "./widgets/urdf_viewer";

  widget = db.newWidget();
  widget.id = 5;
  widget.name = "LaserScan Viewer";
  widget.alias = "LaserScanViewer";
  widget.url = "./widgets/laser_scan_viewer";

  // insert Widgets JS and CSS tags
  let frontend = new Frontend();
  frontend.InsertWidgetsTags();
}

init();
