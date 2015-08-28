var request = require('request');

var diagram = require('../public/resources/process.bpmn');

var moment = require('moment');

var extend = require('xtend');


function Api(baseUrl) {

  // strip trailing slash
  baseUrl = baseUrl.replace(/\/$/, '');

  function _req(method, path, options, callback) {

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    var opts = extend({
      method: method,
      uri: baseUrl + path
    }, options);

    return request(opts, callback);
  }


  this.getProcessDefinitions = function(processDefinitionKey, callback) {
    _req('get', '/process-definition?sortBy=version&sortOrder=desc&keyLike=' + encodeURIComponent('%' + processDefinitionKey + '%'), { json: true }, function(err, results, body) {
      callback(err, body);
    });
  };

  this.getProcessDefinition = function(processDefinitionId, callback) {
    _req('get', '/process-definition/' + processDefinitionId, { json: true }, function(err, results, body) {
      callback(err, body);
    });
  };

  this.getBpmnXML = function(processDefinitionId, callback) {
    _req('get', '/process-definition/' + processDefinitionId + '/xml', { json: true }, function(err, results, body) {
      callback(err, body.bpmn20Xml);
    });
  };

  this.getTopicDefinitions = function(processDefinitionId, callback) {
    _req('get', '/external-task/topic-definition?processDefinitionId=' + processDefinitionId, { json: true }, function(err, results, body) {
      callback(err, body.definitions);
    });
  };

  this.getStatistics = function(processDefinitionId, callback) {
    _req('get', '/process-definition/' + processDefinitionId + '/statistics', { json: true }, function(err, result, body) {

      if (err) {
        return callback(err);
      }

      return callback(null, body);
    });
  };

  this.getMetrics = function(topicNames, callback) {

    var joinedNames = topicNames.join(',');

    _req('get', '/external-task/topic-metrics?topicNames=' + joinedNames, { json: true }, function(err, result, body) {
      callback(err, body.topics);
    });
  };
}


module.exports = Api;