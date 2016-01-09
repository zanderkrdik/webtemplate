var
    $ = require('jquery'),
    Backbone = require('backbone'),
    u = require('underscore'),
    log = require('loglevel');

log.setLevel('debug');

log.info('*** Node Transporter ***');

console.log($.window);

var
    ContainerView = require('./src/js/ContainerView.js'),
    ContainerModel = require('./src/js/ContainerModel.js');

// Models are the only thing manipulated.
// var container01 = new ContainerModel();
// var container02 = new ContainerModel();
// var container03 = new ContainerModel();
// var container10 = new ContainerModel();

//container10.add(container01);
