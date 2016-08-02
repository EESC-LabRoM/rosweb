/// <reference path="./typings/tsd.d.ts" />

// Super classes
import {BasicEvents} from "./events/basic.ts";
import {WidgetsEvents} from "./events/widgets.ts";
import {MoveWidgetsEvents} from "./events/movewidgets.ts";
import {RosEvents} from "./events/ros.ts";
import {Manager} from "./super/manager.ts"; 

function init() {
  let manager: Manager = new Manager();
  let ros: ROSLIB.Ros = new ROSLIB.Ros("");

  let events: BasicEvents = new BasicEvents(manager);
  let widgetsEvents: WidgetsEvents = new WidgetsEvents(ros);
  let moveWidgetsEvents: MoveWidgetsEvents = new MoveWidgetsEvents();
  let rosEvents: RosEvents = new RosEvents(ros);
}

init();
