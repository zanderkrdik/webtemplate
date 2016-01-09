var
    log = require('loglevel'),
    $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');


var ControlsView = Backbone.View.extend({
    template: $('#controls_tpl').html(),
    initialize: function() {
        log.debug('ControlsView.initialize');
        this.render();
    },
    render: function() {
        log.debug('ControlsView.render');
        this.$el.html(this.template);
    },
    events: {
        'click #startstop': 'startstop',
        'click #add': 'add'
    },
    startstop: function() {
        log.debug('ControlsView.startstop');
        this.trigger('startstop');
    },
    add: function() {
        log.debug('ControlsView.add');
        this.trigger('add');
    }

});

module.exports = ControlsView;
