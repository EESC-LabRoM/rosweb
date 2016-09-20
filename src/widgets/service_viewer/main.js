var WidgetServiceViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.service1 = new ROSLIB.Service({ ros: ros, name: "", serviceType: "" });
    $(self.selector).find(".jsWidgetServiceViewerCall").click(function (e) {
      self.refresh();
      e.preventDefault();
    });
  };
  this.clbkResized = function () {
  };
  this.clbkMoved = function () {
  };

  // Param selector callback
  this.service1Changed = function (selectedServiceName, selectedServiceType = "") {
    // disable button
    $(self.selector).find("input, select").attr("disabled", "disabled");
    // get service type
    if (selectedServiceType == "") {
      ros.getServiceType(selectedServiceName, function (type) {
        selectedServiceType = type;
        self.updateService(selectedServiceName, selectedServiceType);
      });
    } else {
      self.updateService(selectedServiceName, selectedServiceType);
    }
  };

  // helper methods
  this.call = function () {
  };
  this.updateService = function (serviceName, serviceType) {
    // html update
    $(self.selector).find("p.name").html(serviceName);
    $(self.selector).find("p.type").html(serviceType);
    // service object update
    self.service1.name = serviceName;
    self.service1.serviceType = serviceType;
    // enable button
    $(self.selector).find("input, select").removeAttr("disabled");
  };
}

$(document).ready(function () {
  // If you need an onload callback
});
