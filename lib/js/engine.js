'use strict';

const TrucMachin = function(Immutable) {

  const Sources = {
    Player: 'player',
    IA: 'ia'
  };

  const Size = Immutable.Record({
    width: 0,
    height: 0
  });

  const Config = Immutable.Record({
    fieldSize: new Size,
    playerSize: new Size
  });

  const Actions = {
    None: 'none',
    SetConfig: 'setcf',
    Pause: 'pause',
    MoveLeft: 'mleft',
    MoveRight: 'mright',
    MoveTop: 'mtop',
    MoveBottom: 'mbottom'
  };

  const MoveActions = [
    Actions.MoveLeft,
    Actions.MoveRight,
    Actions.MoveTop,
    Actions.MoveBottom
  ];

  const isMoveAction = action => MoveActions.indexOf(action.name) > -1;

  const isInBounds = fieldSize => objSize => {
    const maxX = fieldSize.width - objSize.width;
    const maxY = fieldSize.height - objSize.height;
    return position => position.x >= 0 && position.x <= maxX && position.y >= 0 && position.y <= maxY;
  };

  const Action = Immutable.Record({
    name: null,
    source: null,
    args: null,
    ts: null
  });

  const Position = Immutable.Record({
    x: 0,
    y: 0
  });

  const Player = Immutable.Record({
    position: new Position,
    lastMove: null
  });

  const State = Immutable.Record({
    frame: 0,
    config: null,
    action: null,
    pause: false,
    player: new Player
  });

  const incFrameNumber = state => state.set('frame', state.frame + 1);

  const updatePosition = (position, move) => {
    if (move === Actions.MoveLeft)
      return position.set('x', position.x - 1);
    if (move === Actions.MoveRight)
      return position.set('x', position.x + 1);
    if (move === Actions.MoveTop)
      return position.set('y', position.y - 1);
    if (move === Actions.MoveBottom)
      return position.set('y', position.y + 1);
    return position; // not supposed to happen
  };

  const Compute = (action, state) => {
    state = state.set('action', action);
    if (action.name === Actions.Pause) {
      state = state.set('pause', !state.pause);
    }
    if (state.pause) {
      return state;
    }
    state = state.set('frame', state.frame + 1);
    if (action.name === Actions.SetConfig) {
      return state.set('config', action.args);
    }
    //let player = state.player;
    if (isMoveAction(action)) {
      const isInFieldBounds = isInBounds(state.config.fieldSize)(state.config.playerSize);
      const playerNewPosition = updatePosition(state.player.position, action.name);
      if (isInFieldBounds(playerNewPosition)) {
        const playerOnNewPosition = state.player
          .set('position', playerNewPosition)
          .set('lastMove', action.name);
        state = state.set('player', playerOnNewPosition);
      }
    }
    return state;
  };

  return {
    Config,
    Sources,
    Actions,
    Action,
    Size,
    State,
    Compute
  };

};

if (typeof(module) !== 'undefined') {
  module.exports = TrucMachin
}
