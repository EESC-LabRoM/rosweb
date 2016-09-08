var WidgetLaserScanViewer = function(widgetInstanceId) {
  // Mandatory properties
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  // Mandatory callback methods
  this.clbkCreated = function() {}
  this.clbkResized = function(width, height) {
    $(self.selector + " svg").attr({
      width: width,
      height: height
    });
  }
  this.clbkMoved = function(x, y) {}

  // Subscriptions Callbacks
  this.callback1 = function(topic_name, topic_type, message) {
    var elem = $(".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]").find(".datatopic1");
    self.debugObjectInsideElement(elem, message);
  }

  // helper properties and methods

  // svg methods
  var svgNS = "http://www.w3.org/2000/svg";
  
  this.createElement = function(name, inner, properties, style) {
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

  this.g = function(properties) {
    var g = self.createElement("g", null, properties);
    return g;
  };
  this.line = function(properties, style) {
    var line = self.createElement("line", null, properties, style);
    return line;
  };
  this.text = function(text, properties, style) {
    var line = self.createElement("text", text, properties, style);
    return line;
  };
  this.rect = function(properties, style) {
    var rect = self.createElement("rect", null, properties, style);
    return rect;
  };
  this.path = function(properties, directions, style) {
    var d = "";
    for (i in directions) {
      var direction = directions[i];
      d += direction.k + " " + direction.v + " ";
    }
    properties.d = d;
    return self.createElement("path", null, properties, style);
  }

  // custom methods
  this.quarterCircle = function(properties, x1, y1, x2, y2, points, r, isClockwise) {
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

$(document).ready(function() {
  // If you need an onload callback
});