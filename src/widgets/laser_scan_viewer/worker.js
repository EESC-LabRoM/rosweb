onmessage = function (msgEvnt) {
  // calling a function to work
  var work = new Work();
  work.main(msgEvnt.data);
}

Work = function () {
  var self = this;

  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // helper properties and methods
  var points = [];

  this.main = function (data) {
    var message = data.msg;

    var point;
    var point_attr;
    var angle;
    var dist;
    var max = 1080;
    var distance = 0;
    if (points.length < max) {
      for (var i in message.ranges) {
        if (i == max) break;
        angle = -180 * (message.angle_min + message.angle_increment * i) / Math.PI;
        if (message.ranges[i] === null || message.ranges[i] > message.range_max) {
          message.ranges[i] = message.range_max;
        }
        cy = 150 * (1 - (message.ranges[i] / message.range_max));
        point_attr = { cx: 150, cy: cy, r: 1, fill: "black", transform: "rotate(" + angle + ", 150, 150)" };
        points.push(point_attr);
      }
    } else {
      for (var i in message.ranges) {
        if (i == max) break;
        distance = message.ranges[i] == null ? message.range_max : message.ranges[i];
        dist = 140 - (150 * (distance / message.range_max));
        points[i].cy = dist;
      }
    }
    postMessage(points);
  };
}