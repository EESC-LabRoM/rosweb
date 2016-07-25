// Super classes
import {Events} from "./super/events.ts";
import {DragEvents} from "./super/events/drag.ts";

function init() {
  let events: Events = new Events();
  let dragEvents: DragEvents = new DragEvents();
}

init();
