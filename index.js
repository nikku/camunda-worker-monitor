var Monitor = require('./lib/monitor');

var query = require('dom-query');
var on = require('dom-event').on;

var forEach = require('foreach');

var debounce = require('debounce');


var queryParamDefinitions = {
  processDefinition: /[?&]{1}processDefinition=([^&]+)/,
  engineUrl: /[?&]{1}engineUrl=([^&]+)/
};


var $diagramElement = query('#diagram-container'),
    $chooserInput = query('#process-input'),
    $refreshButton = query('#refresh-button');

var params = extractParamsFromUrl();

if (params.processDefinition) {
  // set process definition id
  $chooserInput.value = params.processDefinition;
}

// you may specify another url via the ?engineUrl=... parameter
var engineUrl = params.engineUrl || 'http://localhost:8080/engine-rest';

var monitor = new Monitor($diagramElement, engineUrl);

function updateMonitor() {

  if ($chooserInput.value) {
    monitor.show($chooserInput.value, function(err, definitions) {
      var definition;

      if (definitions.length === 1) {
        definition = definitions[0];

        $chooserInput.value = definition.key;

        query('#header').textContent = definition.name;
      }
    });
  }
}

function extractParamsFromUrl() {
  var data = {};

  forEach(queryParamDefinitions, function(regex, name) {
    var match = location.search.match(regex);

    if (match) {
      data[name] = decodeURIComponent(match[1]);
    }
  });

  return data;
}


// interactivity
on($chooserInput, 'input', debounce(updateMonitor));

on($refreshButton, 'click', function() {

  console.log('REFRESH');

  monitor.refresh();
});


// initial check
updateMonitor();