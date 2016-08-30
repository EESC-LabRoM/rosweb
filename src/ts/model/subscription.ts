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
  public callback: (message: any) => {};

  public typedef: {};
  public topic: ROSLIB.Topic;

  constructor(WidgetInstance: WidgetInstance, topic_name: string, topic_type: string, callback: (message) => {}) {
    this.WidgetInstance = WidgetInstance;
    this.topic_name = topic_name;
    this.topic_type = topic_type;
    this.callback = callback;

    this._subscribe();
  }

  private _subscribe(): void {
    this.topic = new ROSLIB.Topic({
      ros: ros,
      name: this.topic_name,
      messageType: this.topic_type
    });
    this.topic.subscribe((message: any) => {
      this.callback(message);
    });
  }
  public unsubscribe(): void {
    this.topic.unsubscribe();
  }

}