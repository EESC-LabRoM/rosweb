var WidgetLogReader = function (widgetInstanceId) {

  // Mandatory properties
  var self = this; // local variable to represent the object
  this.widgetInstanceId = widgetInstanceId; // setting the ID of the widget
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]"; // setting the HTML selector

  // Mandatory callback methods
  this.clbkCreated = function () { };
  this.clbkConfirm = function () { };
  this.clbkResized = function () { };
  this.clbkMoved = function () { };
  this.clbkTab = function (isMyTab) { };

  // Subscriptions Callbacks
  this.topic = new ROSLIB.Topic({
    ros: ros,
    name: "",
    messageType: ""
  });

  this.on_topic_selected = function (selectedTopic) {
    self.topic.unsubscribe();
    self.topic.name = selectedTopic;
    var elem = $(self.selector).find(".content");
    //$(elem).html("");

    if (selectedTopic == "") return;

    ros.getTopicType(selectedTopic, function (type) {
      self.topic.messageType = type;
        $(self.selector).find("p.name").html(selectedTopic);
        $(self.selector).find("p.type").html(type);

        self.topic.subscribe(self.callback);
    }, function (e) {
      throw new Error(e);
    });
  };


    this.callback = function (message) {
        var time = new Date(message.header.stamp.secs * 1000).toISOString();
        var logLevel = "Undefined";
        console.log(parseInt(message.level));
        switch(parseInt(message.level)) {
        case 1:
            logLevel = "DEBUG";
            break;
        case 2:
            logLevel = "INFO";
            break;
        case 4:
            logLevel = "WARN";
            break;
        case 8:
            logLevel = "ERROR";
            break;
        case 16:
            logLevel = "FATAL";
            break;
        default:
            logLevel = "Undefined";
        }

        var node = message.name;

        var filename = message.file;

        var functionName = message.function;

        var line = message.line;

        var msg = message.msg;

        $(self.selector).find("tbody.body").html(
            $(self.selector).find("tbody.body").html()
                + "<tr>"
                + "<td>" + time + "</td>"
                + "<td>" + logLevel + "</td>"
                + "<td>" + filename + ":" + functionName + ":" + line + "</td>"
                + "<td>" + msg + "</td>"
                + "</tr>"
        );
  }
}
