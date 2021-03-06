/// <reference path='../../typings/bunyan/bunyan.d.ts'/>
import Bunyan = require('bunyan');
import Config = require('./config');

function getISOString ()
{
        const isoString = (new Date()).toISOString();
        return isoString.substring(0, 19) + '+0000';
}

let bunyanLogger: any = null;
if (Config.config.logToFile) {
        bunyanLogger = Bunyan.createLogger({
                name: 'topsecret',
                streams: [
                        {
                                type: 'rotating-file',
                                level: 'info',
                                path: '/var/log/topsecret.log',
                                period: '1d',
                                count: 3
                        }
                ],
        });

        /*
        We override global console as typescript as we cannot import a different logger
        when in client/server (typescript does not support conditional imports)
        */
        console.info = (data: Object) => {
                log.info({ metric: data, time: getISOString() }, 'metric');
                var prettyData = JSON.stringify(data, null, '    ');
                console.log('metric: %s', prettyData);
        };

        console.error = (err: Object, desc: string = '') => {
                log.error({ err, desc, time: getISOString() }, 'error');
                var prettyData = JSON.stringify(err, null, '    ');
                console.log('error: %s', prettyData);
        };
}

export const log = Config.config.logToFile ?
        bunyanLogger : null;
