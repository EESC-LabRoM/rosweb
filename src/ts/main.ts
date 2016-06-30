import {Events} from "./events.ts";
import {Frontend} from "./frontend.ts";

export var events: Events;
function init() {
  events = new Events();
}

init();
