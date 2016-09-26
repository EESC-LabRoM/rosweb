var WidgetUrdfViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.afterContent = function () {
    var viewer = new ROS3D.Viewer({
      divID : 'urdf',
      width : 800,
      height : 600,
      antialias : true
    });

    viewer.addObject(new ROS3D.Grid());

    var tfClient = new ROSLIB.TFClient({
      ros : ros,
      angularThres : 0.01,
      transThres : 0.01,
      rate : 10.0
    });

    var urdfClient = new ROS3D.UrdfClient({
      ros : ros,
      tfClient : tfClient,
      path : 'http://resources.robotwebtools.org/',
      //path: 'http://localhost:8080/',
      rootObject : viewer.scene,
      loader : ROS3D.COLLADA_LOADER_2
    });
  }

};

$(document).ready(function () {
  // If you need an onload callback
});