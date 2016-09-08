var WidgetCameraViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.afterContent = function () {
    self.host = $(".jsRosUrl").val().split(":")[0];
  };

  this.host = '';
  this.viewer = null;
  this.fnCallback = function(message) {
    if(self.viewer == null) {
      self.viewer = new MJPEGCANVAS.Viewer({
        divID: 'mjpeg',
        host: self.host,
        width: 480,
        height: 360,
        topic: '/wide_stereo/left/image_color'
      });
    }
  };

};

$(document).ready(function () {
  // If you need an onload callback
});
