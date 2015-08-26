var BpmnViewer = require('bpmn-js/lib/NavigatedViewer');

var Emitter = require('events');

var moment = require('moment');
var inherits = require('inherits');
var domify = require('domify');

var Api = require('./api');


function Monitor($el, engineUrl) {

  Emitter.call(this);


  var api = new Api(engineUrl);

  var viewer = new BpmnViewer($el);

  var error = function(message, err) {
    this.emit('error', message, err);

    return err;
  }.bind(this);


  var topicDefinitions = null;


  function addExternalTaskOverlay(activityId) {

    var overlays = viewer.get('overlays'),
        canvas = viewer.get('canvas'),
        elementRegistry = viewer.get('elementRegistry');

    var shape = elementRegistry.get(activityId);

    var $overlayHtml = domify('<div class="highlight">');
    $overlayHtml.style.width = (shape.width + 10) + 'px';
    $overlayHtml.style.height = (shape.height + 10) + 'px';

    overlays.add(activityId, {
      position: {
        top: -5,
        left: -5
      },
      html: $overlayHtml
    });

    // add marker
    canvas.addMarker(activityId, 'external-task');
  }


  function updateMetrics(activityId, topicName, metrics) {

    var isDead = moment(metrics.lastSeen).isBefore(moment().subtract(10, 'minutes'));

    var canvas = viewer.get('canvas');

    console.log('dead?', isDead);

    if (isDead) {
      canvas.addMarker(activityId, 'dead');
      canvas.removeMarker(activityId, 'alive');
    } else {
      canvas.removeMarker(activityId, 'dead');
      canvas.addMarker(activityId, 'alive');
    }
  }

  /**
   * Show monitor for process definition id.
   *
   * @param  {String} id
   */
  this.show = function(id) {

    api.getBpmnXML(id, function(err, xml) {

      if (err) {
        return error('failed to fetch BPMN 2.0 XML for process', err);
      }


      viewer.importXML(xml, function(err) {
        if (err) {
          return error('failed to render process', err);
        }

        api.getTopicDefinitions(id, function(err, topicDefinitions) {

          if (err) {
            return error('failed to fetch topics', err);
          }

          topicDefinitions.forEach(function(topicDefinition) {
            addExternalTaskOverlay(topicDefinition.activityId);
          });


          refresh(topicDefinitions);
        });

      });

    });

  };

  function refresh(newDefinitions, callback) {

    if (typeof newDefinitions === 'function') {
      callback = newDefinitions;
      newDefinitions = undefined;
    }

    if (newDefinitions) {
      topicDefinitions = newDefinitions;
    }


    if (!topicDefinitions) {
      var err = error('no topic definitions loaded', new Error('no topic definitions'));

      if (callback) {
        return callback(err);
      }
    }

    console.log('REFRESH!');


    var topicIds = topicDefinitions.map(function(def) { return def.topicName; });

    api.getMetrics(topicIds, function(err, metrics) {

      if (err) {
        return error('failed to fetch metrics', err);
      }


      topicDefinitions.forEach(function(def) {

        var metric = metrics[def.topicName];

        if (metric) {
          updateMetrics(def.activityId, def.topicName, metric);
        }
      });

    });
  }

  this.refresh = refresh;
}


inherits(Monitor, Emitter);


module.exports = Monitor;