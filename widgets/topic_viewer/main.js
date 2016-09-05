var WidgetTopicViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.afterContent = function () {
  }

  // Subscriptions Callbacks
  this.callback1 = function (message) {
    var elem = $(".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]").find(".datatopic1");
    $(elem).html("");
    self.debugObjectInsideElement(elem, message);
  }

  // helper methods
  this.debugObjectInsideElement = function (elem, obj, level = 0) {
    for (var k in obj) {
      if (Array.isArray(obj[k])) {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k));
        self.debugObjectInsideElement(elem, obj[k], level + 1);
      }
      else if (typeof obj[k] == "object") {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k));
        self.debugObjectInsideElement(elem, obj[k], level + 1);
      }
      else {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + ": " + obj[k]));
      }
    }
  }
}

$(document).ready(function () {
  // If you need an onload callback
});
