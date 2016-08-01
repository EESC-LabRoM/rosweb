// Super classes
import {BasicEvents} from "./super/events/basic.ts";
import {WidgetsEvents} from "./super/events/widgets.ts";
import {MoveWidgetsEvents} from "./super/events/movewidgets.ts";
import {RosEvents} from "./super/events/ros.ts";

function init() {
  let events: BasicEvents = new BasicEvents();
  let widgetsEvents: WidgetsEvents = new WidgetsEvents();
  let moveWidgetsEvents: MoveWidgetsEvents = new MoveWidgetsEvents();
  let rosEvents: RosEvents = new RosEvents();
}

init();
