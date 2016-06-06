'use strict';

(() => {

  const canvasId = R.always('trucmachin');

  const body = R.always(jQuery(document.body));
  const createElement = type => document.createElement(type);

  const select = selector => node => node.querySelector(selector);
  const selectAll = selector => node => node.querySelectorAll(selector);

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

  const getCanvas = (selector, widthFn, heightFn) => {
    const canvas = select(selector)(document);
    if (canvas) {
      return canvas;
    }
    return createCanvas(screenWidth, screenHeight);
  };

  const Client = TrucMachin(Immutable);
  console.log(Client);

  //TODO event listeners
  //window.addEventListener('load')
  //window.addEventListener('resize')

})();
