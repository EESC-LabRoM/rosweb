var WidgetTopicViewer = function (widgetInstanceId) {
  var self = this;
  this.widgetInstanceId;

  // callback1 method
  this.callback1 = function (message) {
    console.log(self.widgetInstanceId);
    console.log(message);
    var elem = $(".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]").find(".datatopic1");
    $(elem).html("");
    debugObjectInsideElement(elem, message);
  }

  // helper method
  var debugObjectInsideElement = function (elem, obj, level = 0) {
    for (var k in obj) {
      if (Array.isArray(obj[k])) {
        $(elem).append($("<p>").css({"padding-left": level * 10 + "px"}).html(k));
        debugObjectInsideElement(elem, obj[k], level + 1);
      }
      else if (typeof obj[k] == "object") {
        $(elem).append($("<p>").css({"padding-left": level * 10 + "px"}).html(k));
        debugObjectInsideElement(elem, obj[k], level + 1);
      }
      else {
        $(elem).append($("<p>").css({"padding-left": level * 10 + "px"}).html(k + ": " + obj[k]));
      }
    }
  }
}

$(document).ready(function () {
  // If you need an onload callback
});
