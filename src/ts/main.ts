/// <reference path="./typings/tsd.d.ts" />

// Events
import {TabEvents} from "./events/tab";
import {WidgetEvents} from "./events/widget";
import {WidgetInstanceEvents} from "./events/widget_instance";
import {RosEvents} from "./events/ros";
import {WorkspaceEvents} from "./events/workspace";

// Super
import {lightbox} from "./super/lightbox";
import {storage} from "./super/storage";
import {Frontend} from "./super/frontend";

// Models
import {Widget} from "./model/widget";
import {Workspace} from "./model/workspace";
import {currentWorkspace} from "./model/workspace";

function init() {
  $(document).ready(function () {
    var ros: ROSLIB.Ros = new ROSLIB.Ros("");
    window["ros"] = ros;
    events(ros);
    lightbox.CreateLightbox();
    insertWidgets();
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
  new Widget("Topic Viewer", "TopicViewer", "./widgets/topic_viewer");
  new Widget("Param Viewer", "ParamViewer", "./widgets/param_viewer");
  new Widget("Service Viewer", "ServiceViewer", "./widgets/service_viewer");
  new Widget("Google Maps GPS Viewer", "GoogleMapsGpsViewer", "./widgets/gmaps_gps");
  new Widget("Camera Viewer", "CameraViewer", "./widgets/camera_viewer");
  new Widget("Laser Scan Viewer", "LaserScanViewer", "./widgets/laser_scan_viewer");
}

init();

