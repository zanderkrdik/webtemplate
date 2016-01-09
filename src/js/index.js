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
    var $this = this;
    return this.animate({
        a: end
    }, {
        duration: duration / 2,
        step: function(now) {
            $this.css("box-shadow", "0px 0px " + now +
                "px " + $this.css('background-color'));
        }
    }).animate({
        a: start
    }, {
        duration: duration / 2,
        step: function(now) {
            $this.css("box-shadow", "0px 0px " + now +
                "px " + $this.css('background-color'));
        }
    });

};

log.setLevel('debug');

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
        parent: null,
        view: null,
        produced: 1
    },
    initialize: function() {
        log.debug('StructureModel.initialize');
        this.set('view', new StructureView({
            model: this
        }));
        this.get('view').render();
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
        this.listenTo(this.model.get('parent'), 'render',
            this.render);
        this.listenTo(this.model, "change", this.flash);
    },
    render: function() {
        log.debug('StructureView.render');
        this.model.trigger('render');
        this.$el.css('background-color', this.model.get(
            'color'));
        // this.$el.css('width', this.model.get(
        //     'width') + 'em');
        // this.$el.css('height', this.model.get(
        //     'height') + 'em');
        this.model.get('parent').get('view').$el.append(this.$el);
    },
    events: {
        'click': 'fadeToggle',
        'dblclick': 'report'
    },
    flash: function() {
        log.info('flash');
        this.$el.glowEffect(0, 40, 250);
    },
    fadeToggle: function(e) {
        // if ('undefined' !== typeof(e)) {
        //     e.stopPropagation();
        // }
    },
    report: function() {
        log.info(this.model.attributes);
    }
});


var world = new WorldModel();


var StructureCollection = Backbone.Collection.extend({
    model: StructureModel,
    initialize: function() {
        var self = this;
        this.listenTo(controls, 'add', this.add);
        this.listenTo(controls, 'startstop', this.startstop);
        this.on('add', function(o) {
            o.set({
                'color': Math.floor(Math.random() *
                    16777215).toString(16),
                parent: world
            });
            o.listenTo(self, 'start', o.start);
            //o.start();
        });
    },
    startstop: function() {
        log.debug('StructureCollection.start');
        this.trigger('start');
    }
});



var structures = new StructureCollection();
structures.add({
    parent: world
});

structures.add({
    parent: world,
});
structures.add({
    parent: world,
});
structures.add({
    parent: world,
});

world.trigger('render');
structures.listenTo(controls, 'startstop', structures.startstop);
structures.listenTo(controls, 'add', function() {
    structures.add({
        parent: world
    });
});
