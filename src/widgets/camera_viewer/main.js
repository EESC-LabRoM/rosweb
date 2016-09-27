var WidgetCameraViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.host = $(".jsRosUrl").val().split(":")[0];
  };
  this.clbkResized = function (width, height) {
    self.width = width;
    self.height = height;
    self.viewer.width = width;
    self.viewer.height = height;
    $("." + self.viewerElement + " canvas").attr({
      width: width,
      height: height
    });
  };
  this.clbkMoved = function (x, y) {};

  this.onchange = function (selectedTopic) {
    $("." + self.viewerElement + " canvas").remove();
    self.viewer = new MJPEGCANVAS.Viewer({
      querySelector: '.jsWidgetContainer[data-widget-instance-id=\'' + self.widgetInstanceId + '\'] .jsMjpeg',
      host: self.host,
      width: self.width,
      height: self.height,
      topic: selectedTopic
    });
  };

  // helper properties and methods
  this.host = '';
  this.viewer = null;
  this.viewerElement = 'jsMjpeg';
  this.width = 480;
  this.height = 360;

};

$(document).ready(function () {
  // If you need an onload callback
});