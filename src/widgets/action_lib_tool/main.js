var WidgetActionLibTool = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkConfirm = function() {
    $(self.selector).find(".jsWidgetActionLibToolSendGoal").click(function(e) {
      self.sendGoal();
      e.preventDefault();
    });
    $(self.selector).find(".jsWidgetActionLibToolCancelGoal").click(function(e) {
      self.cancelGoal();
      e.preventDefault();
    });
  };
  this.clbkCreated = function () {
  };
  this.clbkResized = function () { };
  this.clbkMoved = function () { };
  this.clbkTab = function (isMyTab) { };

  // Subscriptions Callbacks
  this.actionClient = {};
  this.goal = {};
  this.onchange1 = function (selectedActionServer) {
    if (selectedActionServer == "") return;
    
    $(self.selector).find("p.name").html(selectedActionServer);
    
    ros.getTopicType("/" + selectedActionServer + "/goal", function (type) {
      self.actionClient = new ROSLIB.ActionClient({
        ros:ros,
        serverName: "/" + selectedActionServer,
        actionName: type.slice(0, -4)
      });
      ros.getMessageDetails(type, (typeDefs) => {
        var elem = $(self.selector).find(".actionserver.goal form");
        elem.html("");
        self.updateGoalForm(selectedActionServer, "object", type, typeDefs);
      }, (error) => {
        console.log(error);
      });
    }, function (goalError) {
      throw new Error(goalError);
    });
  };
  this.feedbackCallback = function(feedback) {
    var elem = $(self.selector).find(".actionserver.feedback");
    $(elem).html("");
    self.debugObjectInsideElement(elem, feedback);
  };
  this.resultCallback = function(result) {
    var elem = $(self.selector).find(".actionserver.result");
    $(elem).html("");
    self.debugObjectInsideElement(elem, result);
  };
  this.statusCallback = function(status) {
    var elem = $(self.selector).find(".actionserver.status");
    $(elem).html("");
    self.debugObjectInsideElement(elem, status);
  };

  // elementsCallbacks
  this.sendGoal = function() {
    self.goal = new ROSLIB.Goal({
      actionClient: self.actionClient,
      goalMessage: self.getObjectForm(self.selector + " .actionserver.goal form").goal
    });
    self.goal.on('feedback', function(feedback) {
      self.feedbackCallback(feedback);
    });
    self.goal.on('result', function(result) {
      self.resultCallback(result);
    });
    self.goal.on('status', function(status) {
      self.statusCallback(status);
    });
    self.goal.send();
  };
  this.cancelGoal = function() {
    self.actionClient.cancel();
  };

  // helper methods
  this.getTypeDef = function (type, typeDefs, request = 1) {
    var typeDef = {};
    for (i in typeDefs) {
      typeDef = typeDefs[i];
      if (type == typeDef.type) return typeDef;
    }
    return null;
  }
  this.updateGoalForm = function(name, formName, type, typeDefs, level = 0) {
    if(["std_msgs/Header", "actionlib_msgs/GoalID"].indexOf(type) > -1) return;
    var elem = $(self.selector).find(".actionserver.goal form");
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
        var prefix = formName != "" ? formName + "." : "";
        self.updateGoalForm(iname, prefix + iname, itype, typeDefs, level + 1);
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
  this.getObjectForm = function (selector) {
    var object = {};
    var input, name, type;
    var tree;
    var inputs = $(selector).find("input[type=text], input[type=checkbox], input[type=number]");
    for (var i = 0; i < inputs.length; i++) {
      input = inputs[i];
      name = $(input).attr("name");
      type = $(input).attr("type");
      var nameSplit = name.split('.');
      for(j = 0; j < nameSplit.length; j++) {
        var slice = nameSplit.slice(0, (j+1));
        prop = slice.join(".");
        eval("if(" + prop + " == undefined) " + prop + " = {}");
      }
      switch (type) {
        case 'text':
          eval(name + " = '" + $(input).val() + "'");
          break;
        case 'number':
          var val = parseFloat($(input).val());
          val = isNaN(val) ? 0 : val;
          eval(name + " = " + val);
          break;
        case 'checkbox':
          eval(name + " = " + $(input).is(":checked")) ? 1 : 0;
          break;
      }
    }
    return object;
  };
  this.debugObjectInsideElement = function (elem, obj, level = 0) {
    for (var k in obj) {
      if (Array.isArray(obj[k])) {
        $(elem).append($("<p>").css({
          "padding-left": level * 10 + "px"
        }).html(k + " []"));
        var arr = obj[k].slice(0, self.arrayShowLimit);
        if (obj[k].length > self.arrayShowLimit) arr.push("-- more --");
        self.debugObjectInsideElement(elem, arr, level + 1);
      } else if (typeof obj[k] == "object") {
        $(elem).append($("<p>").css({
          "padding-left": level * 10 + "px"
        }).html(k + " { }"));
        self.debugObjectInsideElement(elem, obj[k], level + 1);
      } else {
        var val = obj[k].toString().length > self.valueShowLimit ? obj[k].toString().slice(0, self.valueShowLimit) + "..." : obj[k].toString();
        $(elem).append($("<p>").css({
          "padding-left": level * 10 + "px"
        }).html(k + ": " + val));
      }
    }
  };
}

$(document).ready(function () {
  // If you need an onload callback
});