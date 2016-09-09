var WidgetTopicViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
  }
  this.clbkResized = function () {
  }
  this.clbkMoved = function () {
  }

  // Subscriptions Callbacks
  this.callback1 = function (topic_name, topic_type, message) {
    var elem = $(self.selector).find(".datatopic1");
    $(elem).html("");
    $(self.selector).find("p.name").html(topic_name);
    $(self.selector).find("p.type").html(topic_type);
    self.debugObjectInsideElement(elem, message);
  }

  // helper methods
  this.debugObjectInsideElement = function (elem, obj, level = 0) {
    for (var k in obj) {
      if (Array.isArray(obj[k])) {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + " []"));
        var arr = obj[k].slice(0, 10);
        if (obj[k].length > 10) arr.push("-- more --");
        self.debugObjectInsideElement(elem, arr, level + 1);
      }
      else if (typeof obj[k] == "object") {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + " { }"));
        self.debugObjectInsideElement(elem, obj[k], level + 1);
      }
      else {
        var maxLength = 50;
        var val = obj[k].toString().length > maxLength ? obj[k].toString().slice(0, maxLength) + "..." : obj[k].toString();
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + ": " + val));
      }
    }
  }
}

$(document).ready(function () {
  // If you need an onload callback
});
