var WidgetTests = function(widgetInstanceId) {
  this.callback1 = function (message) {
    console.log("YES, WE CAN!");
    console.log(message);
  }
}

$(document).ready(function() {
  // If you need an onload callback
});