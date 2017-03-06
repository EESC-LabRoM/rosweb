///<reference path="../../ts/typings/tsd.d.ts" />

import { WidgetParent } from '../../ts/classmodel/widget'
import { Helper } from '../../ts/helpers/html';

declare var ros: ROSLIB.Ros;

class WidgetTopicPublisher extends WidgetParent {
  constructor(widgetInstanceId: number) {
    super(widgetInstanceId);
    this.topic = new ROSLIB.Topic({ ros: ros, name: "", messageType: "" });
  }
  // Mandatory callbacks
  clbkCreated(): void {
    $(document).delegate(this.selector + " .jsWidgetTopicPublisherOnce", 'click', (e) => {
      $(this.selector).find(".jsWidgetTopicPublisherOnce").attr("disabled", "disabled");
      $(this.selector).find(".jsWidgetTopicPublisherPublish").attr("disabled", "disabled");
      $(this.selector).find(".jsWidgetTopicPublisherStop").attr("disabled", "disabled");
      this.publishOnce();
      $(this.selector).find(".jsWidgetTopicPublisherOnce").removeAttr("disabled");
      $(this.selector).find(".jsWidgetTopicPublisherPublish").removeAttr("disabled");
      $(this.selector).find(".jsWidgetTopicPublisherStop").removeAttr("disabled");
    });
    $(document).delegate(this.selector + " .jsWidgetTopicPublisherPublish", 'click', (e) => {
      $(this.selector).find(".jsWidgetTopicPublisherOnce").attr("disabled", "disabled");
      $(this.selector).find(".jsWidgetTopicPublisherPublish").attr("disabled", "disabled");
      $(this.selector).find(".jsWidgetTopicPublisherStop").removeAttr("disabled");
      this.publish();
    });
    $(document).delegate(this.selector + " .jsWidgetTopicPublisherStop", 'click', (e) => {
      $(this.selector).find(".jsWidgetTopicPublisherOnce").removeAttr("disabled");
      $(this.selector).find(".jsWidgetTopicPublisherPublish").removeAttr("disabled");
      $(this.selector).find(".jsWidgetTopicPublisherStop").removeAttr("disabled");
      this.stop();
    });
  }
  clbkResized(): void {
  }
  clbkMoved(): void {
  }
  clbkTab(): void {
  }
  clbkConfirm(): void {
    ros.getMessageDetails(this.topicType, (typeDefs) => {
      var elem = $(this.selector + " .form form").html("");
      let htmlHelper = new Helper.FormHelper();
      $(this.selector).find("p.name").html(this.topicName);
      $(this.selector).find("p.type").html(this.topicType);
      htmlHelper.typeDefToHtmlForm(elem, "Object", "formObject", this.topicType, typeDefs, 0);
    }, (error: any) => {
      alert("Topic type not found, please try again");
      console.log(error);
    });
  }

  // button callbacks
  publishOnce(): void {
    let obj: any = this.getObjectForm(this.selector + " .form form");
    let name: string = this.topicName;
    let messageType: string = this.topicType;
    let publisher = new ROSLIB.Topic({
      ros: ros,
      name: name,
      messageType: messageType
    });
    publisher.publish(obj);
  }

  public interval: any;
  publish(): void {
    let name: string = this.topicName;
    let messageType: string = this.topicType;
    let publisher = new ROSLIB.Topic({
      ros: ros,
      name: name,
      messageType: messageType
    });
    this.interval = window.setInterval(() => { publisher.publish(this.getObjectForm(this.selector + " .form form")); }, 1000);
  }

  stop(): void {
    window.clearInterval(this.interval);
  }

  // helper methods
  getObjectForm(selector: string): any {
    var input, name, type;
    var tree;
    var formObject: any = {};
    var inputs = $(selector).find("input[type=text], input[type=checkbox], input[type=number]");
    for (var i = 0; i < inputs.length; i++) {
      input = inputs[i];
      name = $(input).attr("name");
      type = $(input).attr("type");
      var nameSplit = name.split('.');
      for (let j: number = 0; j < nameSplit.length; j++) {
        let slice = nameSplit.slice(0, (j + 1));
        let prop: string = slice.join(".");
        eval("if(" + prop + " == undefined) " + prop + " = {}");
      }
      switch (type) {
        case 'text':
          eval(name + " = '" + $(input).val() + "'");
          break;
        case 'number':
          eval(name + " = " + parseFloat($(input).val()));
          break;
        case 'checkbox':
          eval(name + " = " + $(input).is(":checked")) ? 1 : 0;
          break;
      }
    }
    return formObject;
  };

  // ===== widget params =====
  public topicName: string;
  public topicType: string;
  public topic: ROSLIB.Topic;
}

window["WidgetTopicPublisher"] = WidgetTopicPublisher;
