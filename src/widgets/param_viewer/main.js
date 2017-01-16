var WidgetParamViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.param1 = new ROSLIB.Param({
      ros: ros,
      name: ""
    });
    $(self.selector).find(".jsWidgetParamViewerRefresh").click(function (e) {
      self.refresh();
      e.preventDefault();
    });
    $(self.selector).find(".jsWidgetParamViewerSave").click(function (e) {
      self.save();
      e.preventDefault();
    });
  };
  this.clbkConfirm = function () { };
  this.clbkResized = function () { };
  this.clbkMoved = function () { };

  // Param selector callback
  this.param1Changed = function (selectedParam) {
    $(self.selector).find("p.name").html(selectedParam);
    self.param1.name = selectedParam;
    self.refresh();
  };
  this.clbkTab = function (isMyTab) { };

  // helper methods
  this.refresh = function () {
    $(self.selector).find("button, input").attr("disabled", "disabled");
    self.param1.get(function (a) {
      if (typeof (a) == "object" || a == null) { } else {
        $(self.selector).find("input[type=text]").val(a);
        $(self.selector).find("button, input").removeAttr("disabled");
      }
    });
  };
  this.save = function () {
    var value = $(self.selector).find("input[type=text]").val();
    $(self.selector).find("button, input").attr("disabled", "disabled");
    self.param1.set(value, function (a) {
      $(self.selector).find("button, input").removeAttr("disabled");
    });
  };
}

$(document).ready(function () {
  // If you need an onload callback
});