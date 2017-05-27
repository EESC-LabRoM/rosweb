///<reference path="../../ts/typings/tsd.d.ts" />

import { WidgetParent } from '../../ts/classmodel/widget'

declare var ros: ROSLIB.Ros;

class WidgetNewWidget extends WidgetParent {
  constructor(widgetInstanceId: number) {
    super(widgetInstanceId);
    this.topic = new ROSLIB.Topic({ ros: ros, name: "", messageType: "" });
  }

  // Properties
  public topic: ROSLIB.Topic;

  // Mandatory callbacks
  clbkCreated(): void {
  }
  clbkResized(): void {
  }
  clbkMoved(): void {
  }
  clbkTab(): void {
  }
  clbkConfirm(): void {
  }

  // Subscription Callbacks
  public on_topic_selected(selectedTopic: string): void {
    this.topic.unsubscribe();
    this.topic.name = selectedTopic;
    var elem = $(this.selector).find(".content");
    $(elem).html("");

    if (selectedTopic == "") return;

    ros.getTopicType(selectedTopic, (type): void => {
      this.topic.messageType = type;
      $(this.selector).find("p.name").html(selectedTopic);
      $(this.selector).find("p.type").html(type);
      this.topic.subscribe(this.callback);
    }, (e): void => {
      throw new Error(e);
    });
  }

  callback = (message: any): void => {
    $(this.selector).find("div.content").html(JSON.stringify(message, null, 4));
  }
}

window["WidgetNewWidget"] = WidgetNewWidget;
