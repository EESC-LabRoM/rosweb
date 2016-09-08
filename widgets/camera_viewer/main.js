var WidgetCameraViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.host = $(".jsRosUrl").val().split(":")[0];
    self.viewer = self.viewerCreator('/fcu/camera/image_mono');
  };
  this.clbkResized = function (width, height) {
    self.viewer.width = width;
    self.viewer.height = height;
    $("#" + self.viewerElement + " canvas").attr({ width: width, height: height });
  };
  this.clbkMoved = function (x, y) {
  };

  // helper properties and methods
  this.host = '';
  this.viewer = null;
  this.viewerElement = 'mjpeg';
  this.viewerCreator = function (topic) {
    return new MJPEGCANVAS.Viewer({
      querySelector: '.jsWidgetContainer[data-widget-instance-id=\'' + self.widgetInstanceId + '\'] .jsMjpeg',
      host: self.host,
      width: 480,
      height: 360,
      topic: topic
    });
  }

  // Subscriptions
  this.subscription1 = '';
  this.fnCallback = function (topic_name, topic_type, message) {
    self.subscription1 = topic_name;
    if (self.viewer == null) {
      self.viewer = self.viewerCreator(topic_name);
    } else if (self.viewer.topic != self.subscription1) {
      console.log("topic stream changed");
      self.subscription1 = topic_name;
      self.viewer.changeStream(topic_name);
    } else {

    }
  };

};

$(document).ready(function () {
  // If you need an onload callback
});
