var request = require('request');

var diagram = require('../public/resources/process.bpmn');

var moment = require('moment');


function Api(baseUrl) {

  this.getProcessDefinitions = function(idOrName, callback) {

    return [
      {
        name: 'SOME FOO',
        id: 'foo.bar'
      },
      {
        name: 'OTHER FOO',
        id: 'bar.foobar.bar'
      }
    ];

  };


  this.getProcessDefinition = function(id) {

    return {
      name: 'SOME FOO',
      id: 'foo.bar'
    };
  };

  this.getBpmnXML = function(id, callback) {
    callback(null, diagram);
  };

  this.getTopicDefinitions = function(id, callback) {

    var results = [
      {
        activityId: 'processPaymentService',
        topicName: 'foo'
      },
      {
        activityId: 'sid-73454FC8-D69E-41B4-841D-E8E6870E1B04',
        topicName: 'bar'
      }
    ];

    callback(null, results);
  };

  this.getMetrics = function(topicIds, callback) {

    var metrics = {
      foo: {
        lastSeen: moment().subtract(Math.random() > 0.5 ? 50 : 2, 'minutes').toDate()
      }
    };

    callback(null, metrics);
  };
}


module.exports = Api;