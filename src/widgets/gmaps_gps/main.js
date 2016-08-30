var WidgetGoogleMapsGpsViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;

  // Mandatory callback methods
  this.afterContent = function () {

    self.generateGpsVisualizer();
  }

  this.mapGenerated = false;
  this.callback1 = function (message) {
    var latLng = { lat: parseFloat(message.latitude), lng: parseFloat(message.longitude) };
    self.gpsVars.marker.setPosition(latLng);
    self.gpsVars.map.setCenter(latLng);
  }

  this.gpsVars = {
    map: null,
    marker: null
  };

  this.generateGpsVisualizer = function () {
    var elem = $(".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]").find("div.map");
    var map;
    var latLng = { lat: 0, lng: 0 };
    self.gpsVars.map = new google.maps.Map($(elem)[0], {
      center: latLng,
      zoom: 18
    });
    self.gpsVars.marker = new google.maps.Marker({
      position: latLng,
      map: self.gpsVars.map,
      title: 'I\'m here',
    });
  };
}

$(document).ready(function () {
  // If you need an onload callback
});