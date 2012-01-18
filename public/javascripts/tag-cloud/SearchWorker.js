(function() {
  var worker;

  worker = new Worker("my_task.js");

  worker.addEventListener("message", (function(event) {
    return console.log("Called back by the worker!\n");
  }), false);

  worker.postMessage();

}).call(this);
