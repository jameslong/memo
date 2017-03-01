import Data = require('./data');
import DBTypes = require('./dbtypes');
import Helpers = require('./utils/helpers');
import Map = require('./utils/map');
import Profile = require('./profile');

export type NarrativeState = Data.NarrativeData;
export type NarrativeStates = Map.Map<NarrativeState>;
export interface GameState {
        narratives: NarrativeStates;
        promises: DBTypes.PromiseFactories;
}
