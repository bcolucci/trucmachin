'use strict';

(() => {

  const canvasId = R.always('trucmachin');

  const body = R.always(jQuery(document.body));
  const createElement = type => document.createElement(type);

  //const getById = selector => node => node.querySelector(selector);
  //const selectAll = selector => node => node.querySelectorAll(selector);
  const getById = id => document.getElementById(id);

  const setAttribute = (attr, value) => node => {
    node.setAttribute(attr, value);
    return node;
  };

  const getter = fname => obj => obj[fname]();

  const widthGetter = getter('width');
  const heightGetter = getter('height');

  const screenWidth = R.compose(widthGetter, body);
  const screenHeight = R.compose(heightGetter, body);

  const createCanvas = (id, width, height) => {
    document.body.appendChild(R.pipe(
      setAttribute('id', id),
      setAttribute('width', width),
      setAttribute('height', height)
    )(createElement('canvas')));
  };

  const getCanvas = R.compose(getById, canvasId);

  const Client = TrucMachin(Immutable);

  const ClientAction = (name, args) => new Client.Action({
    source: Client.Sources.Player,
    name: name,
    args: args
  });

  const initialConfig = new Client.Config;
  const initialAction = ClientAction(Client.Actions.SetConfig, initialConfig);

  // compute first action in order to set config
  let state = Client.Compute(initialAction, new Client.State);
  console.log('initial state', state.toString());

  const drawFrame = () => {
    const action = ClientAction(Client.Actions.None);
    state = Client.Compute(action, state);
    console.log(state.toString());
    //TODO draw
  };

  //TODO event listeners
  //window.addEventListener('load')
  //window.addEventListener('resize')

  setInterval(drawFrame, 50);

})();
