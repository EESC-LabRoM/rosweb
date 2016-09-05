this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["templates"] = this["MyApp"]["templates"] || {};
this["MyApp"]["templates"]["rosTopicSelector"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<label>"
    + alias3(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"desc","hash":{},"data":data}) : helper)))
    + "</label>\n<br />\n<select class=\"jsRosTopicSelector cssRosTopicSelector\" name=\"doesnotmatter\" data-widget-topic-id=\""
    + alias3(((helper = (helper = helpers.widget_topic_id || (depth0 != null ? depth0.widget_topic_id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"widget_topic_id","hash":{},"data":data}) : helper)))
    + "\" data-widget-instance-id=\""
    + alias3(((helper = (helper = helpers.widget_instance_id || (depth0 != null ? depth0.widget_instance_id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"widget_instance_id","hash":{},"data":data}) : helper)))
    + "\" data-ros-topic-type=\""
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">\n  <option value=\"\">-- Select a topic to subscribe --</option>\n</select>\n";
},"useData":true});
this["MyApp"]["templates"]["rosTopicSelectorOptions"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" data-ros-topic-type=\""
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" data-ros-topic-name=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" selected=\"selected\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" data-ros-topic-type=\""
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" data-ros-topic-name=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
this["MyApp"]["templates"]["tab"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"cssTab jsTab\" data-tab-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  <a href=\"#\" class=\"cssEventTab jsEventTab\" data-tab-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n  <a href=\"#\" class=\"cssEventCloseTab jsEventCloseTab\" data-tab-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"></a>\n</div>\n";
},"useData":true});
this["MyApp"]["templates"]["tabContent"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"jsTabContent cssTabContent\" data-tab-id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n  \n</div>";
},"useData":true});
this["MyApp"]["templates"]["widget"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<div class=\"jsWidgetContainer cssWidgetContainer\" data-widget-instance-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.WidgetInstance : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" data-widget-conf=\"1\" style=\"left:"
    + alias2(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"left","hash":{},"data":data}) : helper)))
    + ";top:"
    + alias2(((helper = (helper = helpers.top || (depth0 != null ? depth0.top : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"top","hash":{},"data":data}) : helper)))
    + ";width:"
    + alias2(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"width","hash":{},"data":data}) : helper)))
    + ";height:"
    + alias2(((helper = (helper = helpers.height || (depth0 != null ? depth0.height : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"height","hash":{},"data":data}) : helper)))
    + ";\">\n  <!--\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"widgets/"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.WidgetInstance : depth0)) != null ? stack1.Widget : stack1)) != null ? stack1.alias : stack1), depth0))
    + "/main.css\" />\n  <script type=\"text/javascript\" src=\"widgets/"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.WidgetInstance : depth0)) != null ? stack1.Widget : stack1)) != null ? stack1.alias : stack1), depth0))
    + "/main.js\"></script>\n  -->\n\n  <div class=\"jsWidgetConfiguration cssWidgetConfiguration\" data-widget-instance-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.WidgetInstance : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n    <a href=\"#\" class=\"jsWidgetSettings cssWidgetSettings\" data-widget-instance-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.WidgetInstance : depth0)) != null ? stack1.id : stack1), depth0))
    + "\"></a>\n    <!--\n    <a href=\"#\" class=\"jsWidgetDelete cssWidgetDelete shadow\"></a>\n    <a href=\"#\" class=\"jsWidgetConfirm cssWidgetConfirm shadow\"></a>\n    -->\n    <a href=\"#\" class=\"jsWidgetResize cssWidgetResize\"></a>\n  </div>\n\n  <div class=\"jsWidgetContent cssWidgetContent\">\n    <div class=\"jsWidgetMask cssWidgetMask\"></div>\n    "
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n  </div>\n</div>\n";
},"useData":true});
this["MyApp"]["templates"]["widgetList"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <a href=\"#\" class=\"cssWidgetItem jsEventWidgetItem\" data-widget-alias=\""
    + alias3(((helper = (helper = helpers.alias || (depth0 != null ? depth0.alias : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"alias","hash":{},"data":data}) : helper)))
    + "\">#"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + " - "
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});