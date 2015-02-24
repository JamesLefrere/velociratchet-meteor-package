// Namespace for package
Velociratchet = {};

Velociratchet.history = new ReactiveVar( [] );

Velociratchet.addToHistory = function( routeName ){
    history = Velociratchet.history.get();
    history.push( routeName )
    Velociratchet.history.set( history );
}
Velociratchet.removeFromHistory = function(){
    history = Velociratchet.history.get();
    history.pop();
    Velociratchet.history.set( history );
}
Velociratchet.clearHistory = function() {
    Velociratchet.history.set( [] );
}

// Events for layout template
// Add the following to your Meteor app:
// Template.myLayoutTemplateName.events(Velociratchet.events);
Velociratchet.events = {
    'click': function ( evt ) {
        Velociratchet.transition = 'vratchet-fade';
    },
    'click .icon-right-nav': function () {
        Velociratchet.addToHistory( Router.current().route.getName() );
        Velociratchet.transition = 'vratchet-right-to-left';
    },
    'click .navigate-right': function () {
        Velociratchet.addToHistory( Router.current().route.getName() );
        Velociratchet.transition = 'vratchet-right-to-left';
    },
    'click .icon-left-nav': function () {
        Velociratchet.removeFromHistory();
        Velociratchet.transition = 'vratchet-left-to-right';
    },
    'click .navigate-left': function () {
        Velociratchet.removeFromHistory();
        Velociratchet.transition = 'vratchet-left-to-right';
    },
    'click .toggle': function( event ){
        var toggle = $(event.target);
        if( toggle.hasClass( 'active' ) ){
            toggle.removeClass( 'active' );
        }else{
            toggle.addClass( 'active' );
        }
    },
    'click .toggle-handle': function( event ){
        var toggle = $(event.target).parent();
        if( toggle.hasClass( 'active' ) ){
            toggle.removeClass( 'active' );
        }else{
            toggle.addClass( 'active' );
        }
    }

};

// Helpers for layout template
// Add the following to your Meteor app:
// Template.myLayoutTemplateName.helpers(Velociratchet.helpers);
Velociratchet.helpers = {
    transition: function () {
        return function (from, to, element) {
            return Velociratchet.transition || 'vratchet-fade';
        }
    },
    route: function () {
        options = {};
        currentRoute = Router.current();
        if (typeof currentRoute.router.options.vratchet !== "object")
            return false;
        vratchet = (currentRoute.router.options.vratchet) ? currentRoute.router.options.vratchet : {};
        controller = (currentRoute.route.options.controller && typeof currentRoute.route.options.controller.vratchet === "object") ? currentRoute.route.options.controller.vratchet : {};
        route = (typeof currentRoute.route.options.vratchet === "object") ? currentRoute.route.options.vratchet : {};
        return _.extend(options, vratchet, route);
    }
};

// Spacebar helpers
if( Meteor.isClient ) {

    UI.registerHelper('getPreviousPage', function () {
        return Velociratchet.history[Velociratchet.history.length-1];
    });
    UI.registerHelper('isActive', function (args) {
        return args.hash.menu === args.hash.active ? 'active' : '';
    });
    UI.registerHelper('getCurrentRoute', function () {
        return Router.current().route.getName();
    });
    // XXX: make this a plugin itself?
    var sideToSide = function(fromX, toX) {
        return function(options) {
            options = _.extend({
                duration: 500,
                easing: 'ease-in-out'
            }, options);

            return {
                insertElement: function(node, next, done) {
                    var $node = $(node);

                    $node
                        .css('transform', 'translateX(' + fromX + ')')
                        .insertBefore(next)
                        .velocity({
                            translateX: [0, fromX]
                        }, {
                            easing: options.easing,
                            duration: options.duration,
                            queue: false,
                            complete: function() {
                                $node.css('transform', '');
                                done();
                            }
                        });
                },
                removeElement: function(node, done) {
                    var $node = $(node);

                    $node
                        .velocity({
                            translateX: [toX]
                        }, {
                            duration: options.duration,
                            easing: options.easing,
                            complete: function() {
                                $node.remove();
                                done();
                            }
                        });
                }
            }
        }
UI.registerHelper('canGoBack', function () {
    return Velociratchet.history.get().length > 0 || this.backRoute;
});
UI.registerHelper('getPreviousPage', function () {
    history = Velociratchet.history.get();
    if (history.length) {
        return history[history.length-1];
    } else {
        return this.backRoute;
    }
    Momentum.registerPlugin('vratchet-right-to-left', sideToSide('100%', '-100%'));
    Momentum.registerPlugin('vratchet-left-to-right', sideToSide('-100%', '100%'));
    Momentum.registerPlugin('vratchet-fade', function(options) {
        Velociratchet.clearHistory();
        return {
            insertElement: function(node, next) {
                $(node)
                    .hide()
                    .insertBefore(next)
                    .velocity('fadeIn');
            },
            removeElement: function(node) {
                $(node).velocity('fadeOut', function() {
                    $(this).remove();
                });
            }
        }
    });
}
