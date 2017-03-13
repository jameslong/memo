/// <reference path="../../typings/es6-polyfill/es6-polyfill.d.ts" />

import Config = require('./config');
import Logging = require('./logging'); // IMPORTANT: This must be included before any logging takes place
const log = Logging.log; // Required for bunyan module to be included in build

import App = require('./app');
import Helpers = require('../../core/src/utils/helpers');
import Log = require('./../../core/src/log');

Log.debug(`${Config.config.mode} MODE`);
const config = Config.loadCredentials(Config.config, './');

App.createState(config).then(state =>
        App.init(state)
).catch(err => {
        Log.error(err, 'createState');
});
