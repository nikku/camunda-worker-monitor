var Monitor = require('./lib/monitor');

var query = require('dom-query');
var on = require('dom-event').on;

var debounce = require('debounce');


var $diagramElement = query('#diagram-container'),
    $chooserInput = query('#process-input'),
    $refreshButton = query('#refresh-button');

var monitor = new Monitor($diagramElement);


function updateMonitor() {
  if ($chooserInput.value) {
    monitor.show($chooserInput.value);
  }
}


function extractProcessDefinitionFromUrl() {
  var match = location.search.match(/[?&]{1}processDefinition=([^&]+)/);

  return match && match[1];
}


// interactivity
on($chooserInput, 'input', debounce(updateMonitor));

on($refreshButton, 'click', function() {

  console.log('REFRESH');

  monitor.refresh();
});


// set process definition id
$chooserInput.value = decodeURIComponent(extractProcessDefinitionFromUrl() || 'some:process:def');


// initial check
updateMonitor();
