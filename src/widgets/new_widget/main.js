var WidgetNewWidget = function (widgetInstanceId) {
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
  this.topic1 = new ROSLIB.Topic({
    ros: ros,
    name: "",
    messageType: ""
  });

  this.on_topic_selected = function (selectedTopic) {
    self.topic1.unsubscribe();
    self.topic1.name = selectedTopic;
    var elem = $(self.selector).find(".datatopic1");
    $(elem).html("");

    if (selectedTopic == "") return;

    ros.getTopicType(selectedTopic, function (type) {
      self.topic1.messageType = type;
      $(self.selector).find("p.name").html(selectedTopic);
      $(self.selector).find("p.type").html(type);
      self.topic1.subscribe(self.callback);
    }, function (e) {
      throw new Error(e);
    });
  };

  this.callback = function (message) {
    $(self.selector).find("div.content").html(JSON.stringify(message, null, 4));
  }
}