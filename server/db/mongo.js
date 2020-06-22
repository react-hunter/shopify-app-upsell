const mongoose = require('mongoose');
const AppSpec = require('../models/AppSpec');
const { mongodbUri } = require('../config');

module.exports = () => {
  mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false });
  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error(`🚫 Database Error 🚫  → ${err}`);
  });
  db.once('open', async () => {
    console.log('🙌 We\'re connected to mongo!');
    const premiumEnabledDoc = await AppSpec.findOne({
      key: 'premiumEnabled',
    });
    if (!premiumEnabledDoc) {
      await AppSpec.create({ key: 'premiumEnabled', value: false });
      console.log('creating app spec map');
    } else {
      console.log(`app spec map is: ${premiumEnabledDoc}`);
    }
  });
};
