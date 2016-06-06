'use strict';

(($) => {

  const DRAW_INTERVAL = 1000;

  const FIELD_WIDTH = 1024;
  const FIELD_HEIGHT = 768;

  const CANVAS_ID = 'trucmachin';

  const $window = R.always($(window));
  const createElement = type => document.createElement(type);

  const createImage = src => {
    const image = new Image;
    image.src = src;
    return image;
  };

  //const getById = selector => node => node.querySelector(selector);
  //const selectAll = selector => node => node.querySelectorAll(selector);
  const getById = id => document.getElementById(id);

  const setAttribute = (attr, value) => node => {
    node.setAttribute(attr, value);
    return node;
  };

  //const getter = fname => obj => obj[fname]();

  //const widthGetter = getter('width');
  //const heightGetter = getter('height');

  //const screenWidth = R.compose(widthGetter, $window);
  //const screenHeight = R.compose(heightGetter, $window);

  const fieldImage = createImage('images/bg.png');

  const Client = TrucMachin(Immutable);

  const ActionsMap = {
    27: Client.Actions.Pause,
    37: Client.Actions.MoveLeft,
    39: Client.Actions.MoveRight,
    38: Client.Actions.MoveTop,
    40: Client.Actions.MoveBottom
  };

  const ActionKeyCodes = Object.keys(ActionsMap).map(Number);
  const keyCodeToActionName = keyCode => ActionsMap[keyCode];

  const isDefinedKeyCode = keyCode => ActionKeyCodes.indexOf(keyCode) > -1;

  const createCanvas = (id, width, height) => {
    const canvas = R.pipe(
      setAttribute('id', id),
      setAttribute('width', width),
      setAttribute('height', height)
    )(createElement('canvas'));
    document.body.appendChild(canvas);
    return canvas;
  };

  const clearContext = ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);

  const now = () => new Date().getTime();

  const ClientAction = (name, args) => new Client.Action({
    source: Client.Sources.Player,
    name: name,
    args: args,
    ts: now()
  });

  let state;

  const compute = action => state = Client.Compute(action, state);

  const drawField = ctx => {
    const pattern = ctx.createPattern(fieldImage, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const onWindowLoaded = () => {

    const fieldSize = new Client.Size({
      width: FIELD_WIDTH,
      height: FIELD_HEIGHT
    });

    const initialConfig = new Client.Config({ fieldSize: fieldSize });

    const initialAction = ClientAction(Client.Actions.SetConfig, initialConfig);

    state = Client.Compute(initialAction, new Client.State);

    const emitKeyPress = eventName => $(document).asEventStream(eventName)
        .map(R.prop('keyCode'))
        .filter(isDefinedKeyCode)
        .map(keyCodeToActionName)
        .onValue(actionName => { console.log(actionName); compute(ClientAction(actionName)); });

    const drawFrame = () => {
      let canvas = getById(CANVAS_ID);
      if (!canvas) {
        canvas = createCanvas(CANVAS_ID, state.config.fieldSize.width, state.config.fieldSize.height);
      }
      const ctx = canvas.getContext('2d');
      clearContext(ctx);
      drawField(ctx);
      console.log('draw', state.toString());
    };

    emitKeyPress('keydown');

    setInterval(drawFrame, DRAW_INTERVAL);

  };

  window.addEventListener('load', onWindowLoaded);

})(jQuery);
