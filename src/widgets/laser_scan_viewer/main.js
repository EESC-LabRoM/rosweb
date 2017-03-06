var WidgetLaserScanViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.topic = new ROSLIB.Topic({
      ros: ros,
      name: "",
      messageType: ""
    });

    self.callback1Worker = new Worker("widgets/laser_scan_viewer/worker.js");

    self.svg = $(self.selector + " svg")[0];
    var center = self.createElement("circle", null, {
      cx: 150,
      cy: 150,
      r: 1,
      fill: "red"
    });
    var max = self.circle({
      cx: 150,
      cy: 150,
      r: 150,
      stroke: "red",
      "stroke-width": 1,
      fill: "transparent"
    });
    self.pointsGroup = self.g({
      "class": "points"
    });

    self.svg.appendChild(center);
    self.svg.appendChild(max);
    self.svg.appendChild(self.pointsGroup);
  };
  this.clbkConfirm = function () {

  };
  this.clbkResized = function (width, height) {
    self.resizeSVG(width, height);
  };
  this.clbkMoved = function (x, y) { };
  this.clbkTab = function (isMyTab) { };

  // Topic methods
  this.onchange = function (selectedTopic) {
    self.topic.unsubscribe();
    self.topic.name = selectedTopic;

    if (selectedTopic == "") return;
    ros.getTopicType(selectedTopic, function (type) {
      self.topic.messageType = type;
      self.topic.subscribe(self.callback);
    }, function (e) {
      throw new Error(e);
    });
  }

  // Subscriptions Callbacks
  this.topic = null;
  self.callback1Worker = null;
  self.maxRange = 0;
  this.maxUpdateRate = 1;
  var last_datetime = 0;
  this.callback = function (message) {
    var datetime = new Date();
    var period = 1000 * (1 / self.maxUpdateRate);
    if(datetime - last_datetime > period) {
      message.range_max = self.maxRange;
      self.callback1Worker.postMessage({
        widgetInstanceId: self.widgetInstanceId,
        msg: message
      });
      self.callback1Worker.onmessage = function (msgEvnt) {
        var point;
        var length = self.points.length;
        for (i in msgEvnt.data) {
          if (length == 0) {
            point = self.circle(msgEvnt.data[i]);
            self.svg.appendChild(point);
            self.points.push(point);
          } else {
            self.points[i].setAttributeNS(null, "cy", msgEvnt.data[i].cy);
          }
        }
      };
      last_datetime = datetime;
    }
  };

  // helper properties and methods
  this.svg = null;
  this.pointsGroup;
  this.points = [];
  this.radius = 150;
  this.resizeSVG = function (width, height) {
    $(self.selector + " svg").attr({
      width: width,
      height: height
    });
  };

  // SVG elements methods
  this.createElement = function (name, inner, properties, style) {
    var svgNS = "http://www.w3.org/2000/svg";
    var element = document.createElementNS(svgNS, name);
    element.innerHTML = inner;

    for (var k in properties) {
      var v = properties[k];
      element.setAttributeNS(null, k, v);
    }

    var inlineStyle = "";
    for (var k in style) {
      var v = style[k];
      inlineStyle += k + ":" + v + ";";
    }
    if (inlineStyle !== "") element.setAttributeNS(null, "style", inlineStyle);

    return element;
  };
  this.g = function (properties) {
    var g = self.createElement("g", null, properties);
    return g;
  };
  this.line = function (properties, style) {
    var line = self.createElement("line", null, properties, style);
    return line;
  };
  this.text = function (text, properties, style) {
    var line = self.createElement("text", text, properties, style);
    return line;
  };
  this.rect = function (properties, style) {
    var rect = self.createElement("rect", null, properties, style);
    return rect;
  };
  this.circle = function (properties, style) {
    return self.createElement("circle", null, properties, style);
  }
  this.path = function (properties, directions, style) {
    var d = "";
    for (i in directions) {
      var direction = directions[i];
      d += direction.k + " " + direction.v + " ";
    }
    properties.d = d;
    return self.createElement("path", null, properties, style);
  }

  // custom methods
  this.quarterCircle = function (properties, x1, y1, x2, y2, points, r, isClockwise) {
    // path variables
    var directions = [];

    var rx, ry, clockwise;
    rx = ry = r;
    clockwise = isClockwise ? 1 : 0;
    directions.push({
      k: "M",
      v: x1 + " " + y1
    });
    directions.push({
      k: "A",
      v: r + " " + r + " 0 0 " + clockwise + " " + x2 + " " + y2
    });
    for (i in points) {
      var point = points[i];
      directions.push({
        k: "L",
        v: point.x + " " + point.y
      });
    }
    var properties = {
      fill: "#ccc",
      stroke: "#ccc",
      "stroke-width": 1
    };
    var quarterCircle = self.path(properties, directions, {});
    return quarterCircle;
  }

}

$(document).ready(function () {
  // If you need an onload callback
});