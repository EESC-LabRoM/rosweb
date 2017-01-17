var WidgetGoogleMapsGpsViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.generateGpsVisualizer();
    $(document).delegate(self.selector + " .jsCenterMap", "click", self.centerMap);
  };
  this.clbkConfirm = function() { };
  this.clbkResized = function () {
    google.maps.event.trigger(self.gpsVars.map, "resize");
    self.gpsVars.map.setCenter(self.latLng);
  };
  this.clbkMoved = function () { };
  this.clbkTab = function (isMyTab) {
    self.generateGpsVisualizer();
    google.maps.event.trigger(self.gpsVars.map, "resize");
    self.gpsVars.marker.setPosition(self.latLng);
    self.gpsVars.map.setCenter(self.latLng);
  };

  // Subscriptions Callbacks
  this.topic1 = new ROSLIB.Topic({
    ros: ros,
    name: "",
    messageType: ""
  });
  this.onchange = function (selectedTopic) {
    self.topic1.unsubscribe();
    self.topic1.name = selectedTopic;

    if (selectedTopic == "") return;
    ros.getTopicType(selectedTopic, function (type) {
      self.topic1.messageType = type;
      self.topic1.subscribe(self.callback);
    }, function (e) {
      throw new Error(e);
    });
  };

  // Subscriptions Callbacks
  this.callback = function (message) {
    self.latLng = {
      lat: parseFloat(message.latitude),
      lng: parseFloat(message.longitude)
    };
    self.gpsVars.marker.setPosition(self.latLng);
  }

  // helper properties and methods
  this.latLng = {
    lat: 0,
    lng: 0
  };
  this.centerMap = function () {
    google.maps.event.trigger(self.gpsVars.map, "resize");
    self.gpsVars.map.setCenter(self.latLng);
  };
  this.gpsVars = {
    map: null,
    marker: null
  };
  this.generateGpsVisualizer = function () {
    var divMap = $(self.selector).find("div.map");
    var map;
    var latLng = {
      lat: 0,
      lng: 0
    };
    self.gpsVars.map = new google.maps.Map($(divMap)[0], {
      center: latLng,
      zoom: 18
    });
    self.gpsVars.marker = new google.maps.Marker({
      position: latLng,
      map: self.gpsVars.map,
      title: 'I\'m here',
    });
  };
};

$(document).ready(function () {
  // If you need an onload callback
});