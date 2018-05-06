
var WidgetDiagnosticsViewer = function (widgetInstanceId) {
  // Mandatory properties
  var self = this; // local variable to represent the object
  this.widgetInstanceId = widgetInstanceId; // setting the ID of the widget
  this.selector = ".jsWidgetContainer[data-widget-instance-id=" + self.widgetInstanceId + "]"; // setting the HTML selector

  // Mandatory callback methods
  this.clbkCreated = function () { };

  this.clbkConfirm = function () { };

  this.clbkResized = function (width, height) {
    self.width = width;
    self.height = height;
    if(self.svg !== undefined) {
      self.svg.attr("width", width)
        .attr("height", height - 10);
    }
  };

  this.clbkMoved = function () { };
  this.clbkTab = function (isMyTab) { };

  this.svg = undefined;
  this.data = [];
  this.width = 400;
  this.height = 300;
  this.color = [
    'green',        //OK
    'orange',       //WARNING
    'red',          //ERROR
    'grey'          //STALE
  ]
  // Subscriptions Callbacks
  this.topic = new ROSLIB.Topic({
    ros: ros,
    name: "",
    messageType: ""
  });

  this.on_topic_selected = function (selectedTopic) {
    self.data = [];
    self.topic.unsubscribe();
    self.topic.name = selectedTopic;
    var elem = $(self.selector).find(".content");
    $(elem).html("");

    if (selectedTopic == "") return;

    ros.getTopicType(selectedTopic, function (type) {
      self.topic.messageType = type;
      $(self.selector).find("p.name").html(selectedTopic);
      $(self.selector).find("p.type").html(type);
      self.topic.subscribe(self.callback);
    }, function (e) {
      throw new Error(e);
    });
    self.svg = d3.select( elem.toArray()[0] );
  };

  function parseBool(x) {
    if ((typeof x === 'string' && x.toLowerCase() === 'true' || x.toLowerCase() === 'yes')
       || (typeof x === 'number' && x !== 0) ) {
      return true;
    } else if ((typeof x === 'string' && x.toLowerCase() === 'false' || x.toLowerCase() === 'no')
              || (typeof x === 'number' && x === 0) ) {
      return false;
    } else {
      return undefined
    }
  }

  this.callback = function (message) {
    var data = message.status.find(function(elem) {
        return elem.name === self.diagnosticsSubject;
    });

    if (data === undefined) {
      return;
    }

    $(self.selector).find(".header").css('background-color', self.color[data.level]);

    $(self.selector).find("p.msg").html(data.message);

	var parseTime = d3.timeParse("%d-%b-%y");

    self.data.push({
      ts: new Date(message.header.stamp.secs * 1000),
      name: data.name,
      data: data.values
    });

    if(self.data.lenght < 2) {
      return;
    } else if(self.data.length > 1000) {
      self.data.splice(0, 1);
    }

    var svg = self.svg;

    svg.attr("width", self.width);
    svg.attr("height", self.height - 50);

    svg.selectAll('*').remove();
	var margin = {top: 20, right: 20, bottom: 20, left: 30},
	    width = +svg.attr("width") - margin.left - margin.right - 40,
	    height = +svg.attr("height") - margin.top - margin.bottom,
	    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var z = d3.scaleOrdinal(d3.schemeCategory10);

	var x = d3.scaleTime()
	    .rangeRound([0, self.width - 50 - ((self.data[0].data.length-1) * 40)])
        .domain(d3.extent(self.data, function(d) { return d.ts; }));

	g.append("g")
	  .attr("transform", "translate(" + ((self.data[0].data.length - 1) * 40) + "," + (self.height - 110) + ")")
	  .call(d3.axisBottom(x))
	  .select(".domain");

    for(var i = 0; i < self.data[0].data.length; i++) {

      var parser = undefined;

      if(!isNaN(parseFloat(self.data[0].data[i].value))) {
        parser = parseFloat;
      } else if (parseBool(self.data[0].data[i].value) !== undefined) {
        parser = parseBool
      } else {
        continue;
      }


      console.log(typeof self.data[0].data[i].value);
      var y_domain = d3.extent(self.data, function(d) { return parser(d.data[i].value)});
      y_domain[0] = y_domain[0] > 0 ? 0 : y_domain[0];
      y_domain[1] = y_domain[0] === y_domain[1] ? y_domain[1] + 1 : y_domain[1];
;


	  var y = d3.scaleLinear()
	      .rangeRound([self.height - 110, 0])
          .domain(y_domain);

      var line = d3.line()
	      .x(function(d) { return x(d.ts); })
	      .y(function(d) { return y(parser(d.data[i].value)); });

	  g.append("g")
        .attr("fill", z(self.data[0].data[i].key))
        .attr("transform", "translate(" + (i * 40) + "," + 0 + ")")
	    .call(d3.axisLeft(y))
	    .append("text")
        .attr("fill", z(self.data[0].data[i].key))
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", "0.71em")
	    .attr("text-anchor", "end")
	    .text(self.data[0].data[i].key);

	  g.append("path")
	    .datum(self.data)
        .attr("transform", "translate(" + ((self.data[0].data.length-1) * 40) + ", 0 )")
	    .attr("fill", "none")
	    .attr("stroke", z(self.data[0].data[i].key))
	    .attr("stroke-linejoin", "round")
	    .attr("stroke-linecap", "round")
	    .attr("stroke-width", 1.5)
	    .attr("d", line);

    }
  }
}
