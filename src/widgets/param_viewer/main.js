var WidgetParamViewer = function (widgetInstanceId) {
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

  // param changed
  this.callback1 = function (val) {

  }
}

$(document).ready(function () {
  // If you need an onload callback
});
