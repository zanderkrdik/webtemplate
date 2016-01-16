


var
    log = require('loglevel'),
    $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');
    
var startstop_state = true;

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
    startstop: function(e) {
        startstop_state = !startstop_state;
        var verb = startstop_state ? 'Start': 'Stop';
        log.debug('ControlsView.startstop');
        this.trigger('startstop');
        if (e) $(e.currentTarget).val(verb);
    },
    add: function() {
        log.debug('ControlsView.add');
        this.trigger('add');
    }

});

module.exports = ControlsView;
