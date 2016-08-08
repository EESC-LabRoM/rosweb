WidgetTest = function() {
  console.log("here I am!");

  this.testFn = function(message) {
    console.log(message);
  }
}

$(document).ready(function() {
  console.log("here I am!");
  test = function(message) {
    console.log(message);
  }
});