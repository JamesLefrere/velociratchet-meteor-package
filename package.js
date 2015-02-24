Package.describe({
    name: 'zendy:velociratchet',
    summary: 'Ratchet UI with native-looking page transitions for Meteor mobile apps.',
    version: '2.0.0',
    git: 'https://github.com/zendylabs/velociratchet-meteor-package.git'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.2.1');
    api.use(['iron:router@1.0.7','percolate:momentum-iron-router@0.7.0', 'percolate:momentum@0.7.2', 'reactive-var', 'spacebars', 'templating'], 'client');
    api.addFiles('zendy-velociratchet.js', 'client');
    api.addFiles('css/ratchet.css','client');
    api.addFiles('fonts/ratchicons.eot','client');
    api.addFiles('fonts/ratchicons.svg','client');
    api.addFiles('fonts/ratchicons.ttf','client');
    api.addFiles('fonts/ratchicons.woff','client');
    api.export('Velociratchet')
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('zendy:velociratchet');
});

