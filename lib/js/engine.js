'use strict';

const TrucMachin = function(Immutable) {

  const createImage = function(src) {
    const image = new Image;
    image.src = src;
    return image;
  };

  const Sources = { Player: 'player', IA: 'ia' };

  const Config = Immutable.Record({});

  const Actions = { None: 'none', SetConfig: 'setcf' };

  const Action = Immutable.Record({
    name: null,
    source: null,
    args: null
  });

  const State = Immutable.Record({
    frame: 0,
    config: null,
    action: null
  });

  const incFrameNumber = state => state.set('frame', state.frame + 1);

  const Compute = (action, state) => {
    state = state
      .set('frame', state.frame + 1)
      .set('action', action);
    if (action.name === Actions.SetConfig) {
      return state.set('config', action.args);
    }
    return state;
  };

  return { Config, Sources, Actions, Action, State, Compute };

};

if (typeof(module) !== 'undefined') {
  module.exports = TrucMachin
}
