///<reference path="../../ts/typings/tsd.d.ts" />

import { WidgetParent } from '../../ts/classmodel/widget'
import { Helper } from '../../ts/helpers/html';

declare var ros: ROSLIB.Ros;

class WidgetTopicPublisher extends WidgetParent {
  constructor(widgetInstanceId: number) {
    super(widgetInstanceId);
    console.log(this.widgetInstanceId);
    console.log(this.selector);
    this.topic = new ROSLIB.Topic({ ros: ros, name: "", messageType: "" });
  }
  clbkCreated(): void {
    console.log(this);
    $(this.selector).find(".jsWidgetTopicPublisherOnce").click(function (e) {
      alert("ouch!");
    });
  }
  clbkResized(): void {
    console.log(this);
  }
  public clbkMoved(): void {
  }
  public clbkTab(): void {
  }
  public clbkConfirm(): void {
    ros.getMessageDetails(this.topicType, (typeDefs) => {
      var elem = $(this.selector + " .form form").html("");
      let htmlHelper = new Helper.FormHelper();
      htmlHelper.typeDefToHtmlForm(elem, "Object", "formName", this.topicType, typeDefs, 0);
    }, (error: any) => {
      console.log(error);
    });
  }

  // ===== widget params =====
  public topicName: string;
  public topicType: string;
  public topic: ROSLIB.Topic;
}

window["WidgetTopicPublisher"] = WidgetTopicPublisher;
