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
    $(self.selector).find(".jsWidgetServiceViewerClear").click(function (e) {
      self.reset();
      e.preventDefault();
    });
  };
  this.clbkConfirm = function() {

  };
  this.clbkResized = function () {
  };
  this.clbkMoved = function () {
  };
  this.clbkTab = function (isMyTab) { };

  // Param selector callback
  this.service1Changed = function (selectedService) {
    // disable button
    $(self.selector).find("input, select").attr("disabled", "disabled");
    // clear content
    $(self.selector).find(".serviceRequest form").html("");
    // get service type and details
    typeDefs = {};
    if (selectedService == "") return;
    ros.getServiceType(selectedService, function (type) {
      selectedServiceType = type;
      ros.getServiceRequestDetails(type, function (typeDefs) {
        self.updateService(selectedService, selectedServiceType, typeDefs);
      }, function (e) {
        throw new Error(e);
      });
    });
  };

  // elements callbacks
  this.call = function () {
    $(self.selector + " div.serviceResponse").html("");
    var request = self.getObjectForm(self.selector + " .serviceRequest form");
    self.service1.callService(request, function (response) {
      self.debugObjectInsideElement(self.selector + " div.serviceResponse", response);
    }, function (error) {
      $(self.selector + " div.serviceResponse").html($("<p style='color:red;'>" + error + "</p>"));
    });
  };
  this.reset = function () {
    $(self.selector).find("form input").val("");
    $(self.selector).find(".serviceResponse").html("");
  }

  // helper methods and properties
  this.service1 = null;
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
    var hType = $("<span style='color:#777;'>&nbsp;(" + type + ")</span>").prop('outerHTML');
    if (typeDef == null) {
      input = self.generateInputField(formName, type);
      $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + input + "</p>"));
    } else if (typeDef.fieldnames.length == 0) {
      $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + "</p>"));
    } else {
      $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + "</p>"));
      for (i in typeDef.fieldnames) {
        iname = typeDef.fieldnames[i];
        itype = typeDef.fieldtypes[i];
        self.updateRequestDetails(iname, formName + "." + iname, itype, typeDefs, level + 1);
      }
    }
  };
  this.generateInputField = function (name, type) {
    var aInt = ["int8", "uint8", "int16", "uint16", "int32", "uint32", "int64", "uint64"];
    var aFloat = ["float32", "float64"];
    var aString = ["string"];
    var aTime = ["time", "duration"]
    var aBool = ["bool"];

    if (aInt.indexOf(type) != -1) {
      return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
    }
    else if (aFloat.indexOf(type) != -1) {
      return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
    }
    else if (aString.indexOf(type) != -1) {
      return $("<input type='text' name='" + name + "' value='' />").prop('outerHTML');
    }
    else if (aTime.indexOf(type) != -1) {
      return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
    }
    else if (aBool.indexOf(type) != -1) {
      return $("<input type='checkbox' name='" + name + "' value='' />").prop('outerHTML');
    } else {
      throw new Error("Unknown primitive type");
    }
  };
  this.updateService = function (serviceName, serviceType, typeDefs) {
    // html update
    $(self.selector).find("p.name").html(serviceName);
    $(self.selector).find("p.type").html(serviceType);
    // service object update
    self.service1.name = serviceName;
    self.service1.serviceType = serviceType;
    // service request details update
    self.updateRequestDetails(serviceName, "request", serviceType, typeDefs);
    // enable button
    $(self.selector).find("input, select").removeAttr("disabled");
  };
  this.getObjectForm = function (selector) {
    var request = {};
    var input, name, type;
    var tree;
    var inputs = $(selector).find("input[type=text], input[type=checkbox], input[type=number]");
    for (var i = 0; i < inputs.length; i++) {
      input = inputs[i];
      name = $(input).attr("name");
      type = $(input).attr("type");
      switch (type) {
        case 'text':
          eval(name + " = '" + $(input).val() + "'");
          break;
        case 'number':
          eval(name + " = " + parseFloat($(input).val()));
          break;
        case 'checkbox':
          eval(name + " = " + $(input).is(":checked")) ? 1 : 0;
          break;
      }
    }
    return request;
  };
  this.debugObjectInsideElement = function (elem, obj, level = 0) {
    for (var k in obj) {
      if (Array.isArray(obj[k])) {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + " []"));
        var arr = obj[k].slice(0, self.arrayShowLimit);
        if (obj[k].length > self.arrayShowLimit) arr.push("-- more --");
        self.debugObjectInsideElement(elem, arr, level + 1);
      }
      else if (typeof obj[k] == "object") {
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + " { }"));
        self.debugObjectInsideElement(elem, obj[k], level + 1);
      }
      else {
        var val = obj[k].toString().length > self.valueShowLimit ? obj[k].toString().slice(0, self.valueShowLimit) + "..." : obj[k].toString();
        $(elem).append($("<p>").css({ "padding-left": level * 10 + "px" }).html(k + ": " + val));
      }
    }
  }
}

$(document).ready(function () {
  // If you need an onload callback
});
