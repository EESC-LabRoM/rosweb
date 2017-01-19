WidgetImuViewer = function (widgetInstanceId) {
  var self = this;
  this.widgetInstanceId = widgetInstanceId;
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]";

  this.clbkCreated = function () {
    self.generateAttitudeVisualizer();
  };
  this.clbkConfirm = function () { };
  this.clbkResized = function (width, height) { };
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

  this.attitudeVisualizerConfiguration = {
    pixelsPerDegree: 3,
    svgWidth: 400,
    svgHeight: 400,
    crownWidth: 50
  };
  this.generateAttitudeVisualizer = function () {
    var svg = new self.svg();
    var jSvgElement = $(self.selector + " .datatopic1 svg");
    var svgElement = jSvgElement[0];
    jSvgElement.css("width", self.attitudeVisualizerConfiguration.svgWidth);
    jSvgElement.css("height", self.attitudeVisualizerConfiguration.svgHeight);
    var svgWidth = self.attitudeVisualizerConfiguration.svgWidth;
    var svgHeight = self.attitudeVisualizerConfiguration.svgHeight;
    var crownWidth = self.attitudeVisualizerConfiguration.crownWidth;

    // container like
    var gContainer = svg.g({ "data-id": "container" });
    svgElement.appendChild(gContainer);
    var gRollAffected = svg.g({ "data-id": "rollAffected" });
    gContainer.appendChild(gRollAffected);

    // pitch and roll areas
    var rectSky = svg.rect({
      x: 0,
      y: 0,
      width: svgWidth,
      height: svgHeight,
      "data-id": "rectSky"
    }, {
        fill: "#0080ff"
      });
    gContainer.appendChild(rectSky);
    var rectLand = svg.rect({
      x: -svgWidth / 2,
      y: svgHeight / 2,
      width: 2 * svgWidth,
      height: svgHeight,
      "data-id": "rectLand"
    }, {
        fill: "#5C4033"
      });
    gRollAffected.appendChild(rectLand);

    // pitch grid
    var bx1, bx2, sx1, sx2, y1, y2, x, y;
    var pixel_per_degree = self.attitudeVisualizerConfiguration.pixelsPerDegree;
    var min = -7, max = 7;
    var bLineWidth = 20;
    var sLineWidth = 10;
    for (var i = min; i <= max; i++) {
      bx1 = (svgWidth / 2) - (bLineWidth / 2);
      bx2 = (svgWidth / 2) + (bLineWidth / 2);
      sx1 = (svgWidth / 2) - (sLineWidth / 2);
      sx2 = (svgWidth / 2) + (sLineWidth / 2);
      y1 = y2 = (self.attitudeVisualizerConfiguration.svgHeight / 2) - (5 * pixel_per_degree * i);
      x = bx2 + 5;
      y = y1 + 4;
      gRollAffected.appendChild(svg.line({
        x1: bx1,
        x2: bx2,
        y1: y1,
        y2: y2,
        stroke: "black",
        "stroke-width": 1
      }));

      if (i < max) {
        for (var j = 1; j <= 4; j++) {
          gRollAffected.appendChild(svg.line({
            x1: sx1,
            x2: sx2,
            y1: y1 - (pixel_per_degree * j),
            y2: y2 - (pixel_per_degree * j),
            stroke: "black",
            "stroke-width": 1
          }));
        }
      }
      gRollAffected.appendChild(svg.text(5 * i + "º", {
        x: bx2 + 5,
        y: y,
        "font-size": 12
      }));
    }


    // pitch and roll lines
    var linePitch = svg.line({
      x1: -svgWidth / 2,
      x2: 1.5 * svgWidth,
      y1: svgHeight / 2,
      y2: svgHeight / 2,
      stroke: "yellow",
      "stroke-width": 1,
      "data-id": "linePitch"
    });
    gRollAffected.appendChild(linePitch);
    var lineRoll = svg.line({
      x1: svgWidth / 2,
      x2: svgWidth / 2,
      y1: -svgHeight / 2,
      y2: 1.5 * svgHeight,
      stroke: "yellow",
      "stroke-width": 1,
      "data-id": "lineRoll"
    });
    gRollAffected.appendChild(lineRoll);


    // magnetometer
    var gBackground = svg.g({ "data-id": "background" });
    var squareSide = svgWidth;
    var halfSquareSide = squareSide / 2;
    var quarterCircle1 = svg.quarterCircle({ fill: "#ccc", stroke: "#ccc", "stroke-width": 1 },
      crownWidth, halfSquareSide,
      halfSquareSide, crownWidth,
      [{ x: halfSquareSide, y: 0 }, { x: 0, y: 0 }, { x: 0, y: halfSquareSide }],
      halfSquareSide - crownWidth, true);
    gBackground.appendChild(quarterCircle1);
    var quarterCircle2 = svg.quarterCircle({ fill: "#ccc", stroke: "#ccc", "stroke-width": 1 },
      halfSquareSide, crownWidth,
      squareSide - crownWidth, halfSquareSide,
      [{ x: squareSide, y: halfSquareSide }, { x: squareSide, y: 0 }, { x: halfSquareSide, y: 0 }],
      halfSquareSide - crownWidth, true);
    gBackground.appendChild(quarterCircle2);
    var quarterCircle3 = svg.quarterCircle({ fill: "#ccc", stroke: "#ccc", "stroke-width": 1 },
      squareSide - crownWidth, halfSquareSide,
      halfSquareSide, squareSide - crownWidth,
      [{ x: halfSquareSide, y: squareSide }, { x: squareSide, y: squareSide }, { x: squareSide, y: halfSquareSide }],
      halfSquareSide - crownWidth, true);
    gBackground.appendChild(quarterCircle3);
    var quarterCircle4 = svg.quarterCircle({ fill: "#ccc", stroke: "#ccc", "stroke-width": 1 },
      halfSquareSide, squareSide - crownWidth,
      crownWidth, halfSquareSide,
      [{ x: 0, y: halfSquareSide }, { x: 0, y: squareSide }, { x: halfSquareSide, y: squareSide }],
      halfSquareSide - crownWidth, true);
    gBackground.appendChild(quarterCircle4);


    // compass background
    var gCompassBackground = svg.g({ "data-id": "compassBackground" });
    var properties = { fill: "#222", stroke: "#222", "stroke-width": 0 };
    var directions = [
      { k: "M", v: crownWidth + " " + halfSquareSide },
      { k: "A", v: (halfSquareSide - crownWidth) + " " + (halfSquareSide - crownWidth) + " 0 0 1 " + (squareSide - crownWidth) + " " + halfSquareSide },
      { k: "L", v: squareSide + " " + halfSquareSide },
      { k: "A", v: halfSquareSide + " " + halfSquareSide + " 0 0 0 " + "0 " + halfSquareSide }
    ];
    var style = {};
    var circle1 = svg.path(properties, directions, style);
    gCompassBackground.appendChild(circle1);

    var properties = { fill: "#222", stroke: "#222", "stroke-width": 0 };
    var directions = [
      { k: "M", v: crownWidth + " " + halfSquareSide },
      { k: "A", v: (halfSquareSide - crownWidth) + " " + (halfSquareSide - crownWidth) + " 0 0 0 " + (squareSide - crownWidth) + " " + halfSquareSide },
      { k: "L", v: squareSide + " " + halfSquareSide },
      { k: "A", v: halfSquareSide + " " + halfSquareSide + " 0 0 1 " + "0 " + halfSquareSide }
    ];
    var style = {};
    var circle2 = svg.path(properties, directions, style);
    gCompassBackground.appendChild(circle2);


    // yaw affected
    var gYawAffected = svg.g({ "data-id": "yawAffected" });
    gYawAffected.appendChild(svg.text("N", {x:194, y: 30, "font-size": 20, fill: "#ddd"}));
    gYawAffected.appendChild(svg.text("S", {x:194, y: 380, "font-size": 20, fill: "#ddd"}));
    gYawAffected.appendChild(svg.text("E", {x:20, y: 207, "font-size": 20, fill: "#ddd"}));
    gYawAffected.appendChild(svg.text("W", {x:365, y: 207, "font-size": 20, fill: "#ddd"}));

    // add elements in the correct order
    gContainer.appendChild(gRollAffected);
    gContainer.appendChild(gBackground);
    gContainer.appendChild(gCompassBackground);
    gContainer.appendChild(gYawAffected);
  };

  this.svg = function () {

    var self = this;
    var svgNS = "http://www.w3.org/2000/svg";

    this.createElement = function (name, inner, properties, style) {
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
      directions.push({ k: "M", v: x1 + " " + y1 });
      directions.push({ k: "A", v: r + " " + r + " 0 0 " + clockwise + " " + x2 + " " + y2 });
      for (i in points) {
        var point = points[i];
        directions.push({ k: "L", v: point.x + " " + point.y });
      }
      var properties = { fill: "#ccc", stroke: "#ccc", "stroke-width": 1 };
      var quarterCircle = self.path(properties, directions, {});
      return quarterCircle;
    }

  }

}