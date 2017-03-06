var WidgetROS3DViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkConfirm = function() {

  };
  this.clbkCreated = function () {
    // Create the main viewer.
    self.viewer = new ROS3D.Viewer({
      divID: self.viewerElement,
      width: self.width,
      height: self.height,
      antialias: true
    });
  };
  this.clbkResized = function (width, height) {
    self.width = width;
    self.height = height;
    if (self.viewer != null) {
      self.viewer.width = width;
      self.viewer.height = height;
    }
    $("#" + self.viewerElement + " canvas").attr({
      width: width,
      height: height
    });
  };
  this.clbkMoved = function (x, y) { };
  this.clbkTab = function (isMyTab) { };

  this.onchange = function (selectedTopic) {
    // Setup a client to listen to TFs.
    self.tfClient = new ROSLIB.TFClient({
      ros: ros,
      angularThres: self.angularThres,
      transThres: self.transThres,
      rate: self.rate,
      fixedFrame: self.fixedFrame
    });

    // Setup the marker client.
    self.markerClient = new ROS3D.MarkerClient({
      ros: ros,
      tfClient: self.tfClient,
      topic: selectedTopic,
      rootObject: self.viewer.scene
    });
  };

  // helper properties and methods
  this.viewer = null;
  this.tfClient = null;
  this.markerClient = null;
  this.viewerElement = 'js3DVisualizer' + this.widgetInstanceId;
  this.width = 400;
  this.height = 300;
  this.angularThres = 0.1;
  this.transThres = 0.1;
  this.rate = 20;
  this.fixedFrame = '/base_link';

};

$(document).ready(function () {
  // If you need an onload callback
});