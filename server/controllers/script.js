const fs = require('fs');
const {
  tunnelUrl,
} = require('../config');

module.exports = {
  '->->public': (ctx) => {
    const content = fs
      .readFileSync('./static/widget.js')
      .toString()
      .replace('{{__SHOP__}}', ctx.query.shop)
      .replace('{{__URL__}}', tunnelUrl);
    ctx.res.setHeader('Content-Type', 'application/javascript;charset=utf-8');
    ctx.res.setHeader("Cache-Control","no-cache");
    return content;
  },
};
