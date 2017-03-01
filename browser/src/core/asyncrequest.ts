/// <reference path="../../../typings/jquery/jquery.d.ts" />

import $ = require('jquery');
import Data = require('../../../core/src/data');
import Helpers = require('../../../core/src/utils/helpers');
import State = require('../../../core/src/gamestate');

export function narratives (url: string)
{
        const requestURL = url + '/narratives';
        return get<Data.Narratives>(requestURL, {});
}

export function get<T> (
        url: string,
        data: Object): Promise<T>
{
        return new Promise((resolve, reject) => {
                $.ajax({
                        url: url,
                        data: data,
                        success: (data, textStatus, jqXHR) => resolve(data),
                        error: (jqXHR, textStatus, err) => reject(err),
                });
        });
}
