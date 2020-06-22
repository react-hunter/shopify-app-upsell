const axios = require('axios');
const Amplitude = require('amplitude');
const config = require('../config');

const {
  amplitudeApiKey,
  dev,
} = config;


let amplitude;
try {
  amplitude = new Amplitude(amplitudeApiKey);
} catch (err) {
  console.log(err.message);
}

module.exports = function reportEvent(shopOrigin, eventName, eventValue, userProps) {
  if (!amplitude) {
    return;
  }
  if (!eventName) {
    console.debug('reportEvent(): no eventName/shop were provided as input');
    return;
  }
  let eventProps = {}
  if(typeof(eventValue) === 'string'){
    eventProps = {
      value: eventValue
    }
  } else if(typeof(eventValue) === 'object'){
    eventProps = eventValue;
  }
  const data = {
    user_id: shopOrigin || 'undefined',
    event_type: eventName,
    event_properties: {
      ...eventProps,
    },
    user_properties: {
      appName: 'upsell',
      ...userProps
    },
  };
  try {
    amplitude.track(data)
    .catch((e)=>{
      //do nothing
    })
    console.log(`event`)
  } catch (error) {
    console.debug(error);
  }
};
