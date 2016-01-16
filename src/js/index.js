/* jshint debug: true */





/*******************************************************************************
Main control script

Builds the instance of the world.

*******************************************************************************/

// -----------------------------------------------------------------------------
// WIP Code
// Models
// -- hold elemental business information and processes
// -- can contain other models / collections
// -- can be associated with a View
// -- notifies parent, if any, of Events
// -- notifies children of events

// views
// -- have business Models
// -- can have rendering Models

// -----------------------------------------------------------------------------

var
    log = require('loglevel'),
    $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

Backbone.$ = $;

$.fn.glowEffect = function(start, end, duration) {
    var 
        self = this,
        animation = {
            duration: duration / 2,
            step: glow
        };
    
    function glow(now) {
        self.css(
            "box-shadow", "0px 0px " + 
            now +
            "px " + 
            self.css('background-color'));
    }
    
    return this
        .animate({
            a: end
        }, animation)
        .animate({
            a: start
        }, animation);
};


function randomColor() {
    return Math.floor(Math.random() *
                    16777215).toString(16);
}




log.setLevel('debug');
console.log(global);

var
    ControlsView = require('./ControlsView.js');

var controls = new ControlsView({
    el: '#controls'
});

var WorldModel = Backbone.Model.extend({
    defaults: {
        view: null,
    },
    initialize: function() {
        log.debug('WorldModel.initialize');
        this.set('view', new WorldView({
            model: this,
            el: '#world'
        }));
    },
});

var WorldView = Backbone.View.extend({
    model: null,
    initialize: function() {
        log.debug('WorldView.initialize');
        this.el = this.model.el;
        this.listenTo(this.model, 'render', this.render);
    },
    render: function() {
        log.debug('WorldView.render');
        //this.trigger('render');
    }
});

var StructureModel = Backbone.Model.extend({
    timer: null,
    defaults: {
        color: 'red',
        width: 1,
        height: 1,
        timeout: 3000,
        parentmodel: null,
        view: null,
        produced: 0
    },
    initialize: function() {
        log.debug('StructureModel.initialize');
        this.set({
            'view': new StructureView({
            model: this
        })},{silent: true});
    },
    start: function() {
        log.debug('StructureModel.start');
        this.timer = setInterval(function(self) {
            // Do something here that evokes a change
            self.set('produced', self.get('produced') + 1);
        }, this.get('timeout'), this);
    },
    stop: function() {
        log.debug('StructureModel.stop');
        clearInterval(this.timer);
    }


});

var StructureView = Backbone.View.extend({
    tagName: 'div',
    className: 'structure',
    initialize: function() {
        log.debug('StructureView.initialize');
        this.listenTo(this.model, "change:produced", this.flash);
        this.listenTo(this.model, "change:color", this.render);
        this.produced_label = this.$el.html('<p class="produced"></p>');
    },
    render: function() {
        log.debug('StructureView.render');
        this.$el.css('background-color', this.model.get(
            'color'));
        this.produced_label.text(this.model.get('produced'));
        this.model.get('parentmodel').get('view').$el.append(this.$el);
    },
    events: {
        'dblclick': 'report'
    },
    flash: function() {
        log.debug('StructureView.flash');
        this.$el.glowEffect(0, 40, 250);
        this.produced_label.text(this.model.get('produced'));
    },
    report: function() {
        log.info(this.model.attributes);
    }
});


var world = new WorldModel();



var StructureCollection = Backbone.Collection.extend({
    model: StructureModel,
    running: false,
    initialize: function() {
        var self = this;
        this.on('add', function(o) {
            o.set({
                'color': randomColor()
            });
            o.listenTo(self, 'start', o.start);
            o.listenTo(self, 'stop', o.stop);
            if (self.running) {
                o.start();
            }
        });
    },
    startstop: function() {
        this.running = !this.running;
        var verb = this.running ? 'start' : 'stop';
        log.debug('StructureCollection.startstop [' + verb +']');
        this.trigger(verb);
    }
});



var structures = new StructureCollection();
structures.add({parentmodel: world});

world.trigger('render');

// Explicitly bind the controls view.
structures.listenTo(controls, 'startstop', structures.startstop);
structures.listenTo(controls, 'add', function() {
    structures.add({parentmodel: world});
});
