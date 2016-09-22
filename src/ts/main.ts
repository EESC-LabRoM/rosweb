/// <reference path="./typings/tsd.d.ts" />

// Events
import {TabEvents} from "./events/tab.ts";
import {WidgetEvents} from "./events/widget.ts";
import {WidgetInstanceEvents} from "./events/widget_instance.ts";
import {RosEvents} from "./events/ros.ts";
import {WorkspaceEvents} from "./events/workspace.ts";

// Super
import {db} from "./super/db.ts";
import {lightbox} from "./super/lightbox.ts";
import {Frontend} from "./super/frontend.ts";

// Models
import {Widget} from "./model/widget.ts";

export var ros: ROSLIB.Ros = new ROSLIB.Ros("");

function init() {
  window["ros"] = ros;
  insertWidgets();
  events(ros);
  $(document).ready(function () {
    lightbox.CreateLightbox();
  });
}

function events(ros: ROSLIB.Ros): void {
  let tabEvents: TabEvents = new TabEvents();
  let widgetEvents: WidgetEvents = new WidgetEvents(ros);
  let widgetInstanceEvents: WidgetInstanceEvents = new WidgetInstanceEvents(ros);
  let rosEvents: RosEvents = new RosEvents(ros);
  let workspace: WorkspaceEvents = new WorkspaceEvents();
}

function insertWidgets(): void {
  // load list of available widgets
  let count: number = 1;
  let widget = db.newWidget();
  widget.id = count;
  widget.name = "Topic Viewer";
  widget.alias = "TopicViewer";
  widget.url = "./widgets/topic_viewer";
  count++;

  widget = db.newWidget();
  widget.id = count;
  widget.name = "Param Viewer";
  widget.alias = "ParamViewer";
  widget.url = "./widgets/param_viewer";
  count++;

  widget = db.newWidget();
  widget.id = count;
  widget.name = "Service Viewer";
  widget.alias = "ServiceViewer";
  widget.url = "./widgets/service_viewer";
  count++;

  widget = db.newWidget();
  widget.id = count;
  widget.name = "Google Maps GPS Viewer";
  widget.alias = "GoogleMapsGpsViewer";
  widget.url = "./widgets/gmaps_gps";
  count++;

  widget = db.newWidget();
  widget.id = count;
  widget.name = "Camera Viewer";
  widget.alias = "CameraViewer";
  widget.url = "./widgets/camera_viewer";
  count++;

  widget = db.newWidget();
  widget.id = count;
  widget.name = "URDF Viewer";
  widget.alias = "UrdfViewer";
  widget.url = "./widgets/urdf_viewer";
  count++;

  widget = db.newWidget();
  widget.id = count;
  widget.name = "LaserScan Viewer";
  widget.alias = "LaserScanViewer";
  widget.url = "./widgets/laser_scan_viewer";
  count++;

  // insert Widgets JS and CSS tags
  let frontend = new Frontend();
  frontend.InsertWidgetsTags();
}

init();
