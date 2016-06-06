'use strict';

const TrucMachin = function(Immutable) {

  const createImage = function(src) {
    const image = new Image;
    image.src = src;
    return image;
  };

  const Config = Immutable.Record({});

  const Game = function(config) {
  };

  return { Config, Game };

};

if (typeof(module) !== 'undefined') {
  module.exports = TrucMachin
}
