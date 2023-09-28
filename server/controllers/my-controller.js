'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('webstories')
      .service('myService')
      .getWelcomeMessage();
  },
});
