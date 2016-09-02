var WidgetCameraViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.afterContent = function () {
    var viewer = new MJPEGCANVAS.Viewer({
      divID: 'mjpeg',
      host: '192.168.1.105',
      width: 640,
      height: 480,
      topic: '/wide_stereo/left/image_color'
    });
  }

};

$(document).ready(function () {
  // If you need an onload callback
});
