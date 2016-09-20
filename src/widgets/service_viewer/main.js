var WidgetServiceViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.service1 = new ROSLIB.Service({ ros: ros, name: "", serviceType: "" });
    $(self.selector).find(".jsWidgetServiceViewerCall").click(function (e) {
      self.call();
      e.preventDefault();
    });
    self.declareSerializeObject();
  };
  this.clbkResized = function () {
  };
  this.clbkMoved = function () {
  };

  // Param selector callback
  this.service1Changed = function (selectedServiceName) {
    // disable button
    $(self.selector).find("input, select").attr("disabled", "disabled");
    // get service type and details
    typeDefs = {};
    ros.getServiceType(selectedServiceName, function (type) {
      selectedServiceType = type;
      ros.getServiceRequestDetails(type, function (typeDefs) {
        console.log(typeDefs);
        self.updateService(selectedServiceName, selectedServiceType, typeDefs);
      }, function (e) {
        console.log("get service request details error");
      });
    });
  };

  // helper methods
  this.service1 = null;
  this.call = function () {
    var request = $(self.selector).find(".serviceRequest form").serializeJSON();
    var serviceRequest = new ROSLIB.ServiceRequest(request.request);
    self.service1.callService(serviceRequest, function (response) {
      console.log(response);
    });
  };
  this.getTypeDef = function (type, typeDefs, request = 1) {
    suffix = request == 1 ? "Request" : "Response";
    var typeDef = {};
    for (i in typeDefs) {
      typeDef = typeDefs[i];
      if (type + suffix == typeDef[0].type) return typeDef[0];
    }
    return null;
  }
  this.updateRequestDetails = function (name, formName, type, typeDefs, level = 0) {
    var elem = $(self.selector).find(".serviceRequest form");
    var typeDef = self.getTypeDef(type, typeDefs);
    var iname, itype;
    if (typeDef == null) {
      input = $("<input type='text' name='" + formName + "' value='' />").prop('outerHTML');
      $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + input + "</p>"));
    } else if (typeDef.fieldnames.length == 0) {
      $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + "</p>"));
    } else {
      $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + "</p>"));
      for (i in typeDef.fieldnames) {
        iname = typeDef.fieldnames[i];
        itype = typeDef.fieldtypes[i];
        self.updateRequestDetails(iname, formName + "[" + iname + "]", itype, typeDefs, level + 1);
      }
    }
  };
  this.declareSerializeObject = function () {
    $.fn.serializeObject = function () {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };
  }
  this.updateService = function (serviceName, serviceType, typeDefs) {
    // html update
    $(self.selector).find("p.name").html(serviceName);
    $(self.selector).find("p.type").html(serviceType);
    // service object update
    self.service1.name = serviceName;
    self.service1.serviceType = serviceType;
    // service request details update
    $(self.selector).find(".serviceRequest form").html = "";
    self.updateRequestDetails(serviceName, "request", serviceType, typeDefs);
    // enable button
    $(self.selector).find("input, select").removeAttr("disabled");
  };
}

$(document).ready(function () {
  // If you need an onload callback
});
