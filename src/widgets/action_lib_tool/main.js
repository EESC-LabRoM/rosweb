var WidgetActionLibTool = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    $(self.selector).find(".jsWidgetActionLibToolSendGoal").click(function(e) {
      self.sendGoal();
      e.preventDefault();
    });
  };
  this.clbkResized = function () { };
  this.clbkMoved = function () { };
  this.clbkTab = function (isMyTab) { };

  // Subscriptions Callbacks
  this.actionClient = new ROSLIB.ActionClient({ros:ros, serverName:'', actionName: ''});
  this.goal = new ROSLIB.Goal({
    actionClient : self.actionClient,
    goalMessage : {}
  });
  this.onchange1 = function (selectedActionServer) {
    self.actionClient.serverName = "/" + selectedActionServer;
    $(self.selector).find("p.name").html(selectedActionServer);

    if (selectedActionServer == "") return;
    
    ros.getTopicType("/" + selectedActionServer + "/goal", function (goalType) {
      ros.getMessageDetails(goalType, function(typeDefs) {
        var elem = $(self.selector).find(".actionserver.goal form");
        elem.html("");
        self.updateGoalForm(selectedActionServer, "object", goalType, typeDefs);
      });
    }, function (goalError) {
      throw new Error(goalError);
    });
    self.goal.on('feedback', function(feedback) {
      var elem = $(self.selector).find(".actionserver.feedback");
      $(elem).html("");
      self.debugObjectInsideElement(elem, feedback);
    });
    self.goal.on('result', function(result) {
      var elem = $(self.selector).find(".actionserver.result");
      $(elem).html("");
      self.debugObjectInsideElement(elem, result);
    });
  };

  // elementsCallbacks
  this.sendGoal = function() {
    console.log("send goal");
    var form = $(self.selector + " .actionserver.goal form");
    console.log(form);
    var request = self.getObjectForm(self.selector + " .actionserver.goal form");
    console.log(request);
    /*
    self.goal.goalMessage = request;
    console.log(self.goal.goalMessage);
    self.actionClient.send();
    */
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
      console.log(nameSplit);
      for(j in nameSplit) {
        console.log("j: " + j);
        var slice = nameSplit.slice(0, (j+1));
        console.log(slice);
        prop = slice.join(".");
        console.log("prop: " + prop);
        eval("if(" + prop + " == undefined) object." + prop + " = {}");
        console.log(object);
      }
      console.log(obj);
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