var WidgetLaserScanViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function () {
    self.svg = $(self.selector + " svg")[0];
    var center = self.createElement("circle", null, { cx: 150, cy: 150, r: 5, fill: "red" });
    var min = self.circle({ cx: 150, cy: 150, r: 30, stroke: "red", "stroke-width": 1, fill: "transparent" });
    var max = self.circle({ cx: 150, cy: 150, r: 150, stroke: "red", "stroke-width": 1, fill: "transparent" });
    self.svg.appendChild(center);
    self.svg.appendChild(min);
    self.svg.appendChild(max);
  };
  this.clbkResized = function (width, height) {
    self.resizeSVG(width, height);
  };
  this.clbkMoved = function (x, y) { }

  // Subscriptions Callbacks
  self.console = false;
  this.callback1 = function (topic_name, topic_type, message) {
    var point;
    var point_attr;
    var angle;
    var dist;
    var max = 1080;
    if (self.points.length < max) {
      for (var i in message.ranges) {
        if (i == max) break;
        angle = 180 * (message.angle_min + message.angle_increment * i) / Math.PI;
        dist = 120 - (150 * (message.ranges[i] / message.range_max));
        point_attr = { cx: 150, cy: dist, r: 2, fill: "black", transform: "rotate(" + angle + ", 150, 150)" };
        point = self.createElement("circle", null, point_attr);
        self.svg.appendChild(point);
        self.points.push(point);
      }
    } else {
      for (var i in message.ranges) {
        if (i == max) break;
        dist = 120 - (150 * (message.ranges[i] / message.range_max));
        self.points[i].setAttributeNS(null, "cy", dist);
      }
    }
  };

  // helper properties and methods
  this.svg = null;
  this.points = [];
  this.radius = 150;
  this.resizeSVG = function (width, height) {
    $(self.selector + " svg").attr({ width: width, height: height });
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