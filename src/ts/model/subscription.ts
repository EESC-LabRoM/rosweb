/// <reference path="../typings/tsd.d.ts" />

// Db
import {db} from "../super/db.ts";
import {ros} from "../main.ts";

// Models
import {WidgetInstance} from "./widget_instance.ts";

export class Subscription {

  public id: number;
  public WidgetInstance: WidgetInstance;
  public topic_name: string;
  public topic_type: string;
  public typedef: {};

  constructor(WidgetInstance: WidgetInstance, topic_name: string, topic_type: string) {
    console.log("constructing new subscription");
    this.WidgetInstance = WidgetInstance;
    this.topic_name = topic_name;
    this.topic_type = topic_type;

    this._subscribe();
  }

  private _subscribe(): void {
    console.log("Lets subscribe it!!!!");
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: this.topic_name,
      messageType: this.topic_type
    });
    // Then we add a callback to be called every time a message is published on this topic.
    listener.subscribe(function (message: { data: any }) {
      console.log('Received message on ' + listener.name + ': ' + message.data);
      // If desired, we can unsubscribe from the topic as well.
      listener.unsubscribe();
    });
  }

}