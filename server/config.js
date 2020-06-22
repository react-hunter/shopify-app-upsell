/* eslint-disable no-process-env */
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  appName: process.env.APP_NAME || 'upsell',
  realCharge: process.env.REAL_CHARGE === 'ON',
  port: parseInt(process.env.PORT, 10) || 3000,
  dev: process.env.NODE_ENV !== 'production',
  shopifyApiSecretKey: process.env.SHOPIFY_API_SECRET_KEY_PROD || process.env.SHOPIFY_API_SECRET_KEY,
  shopifyApiKey: process.env.SHOPIFY_API_KEY,
  tunnelUrl: process.env.TUNNEL_URL,
  apiVersion: process.env.API_VERSION,
  appPrice: 19.99,
  debugMode: process.env.DEBUG_MODE,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopify-upsell-app',
  amplitudeApiKey: process.env.NODE_ENV === 'production' ? process.env.AMPLITUDE_API_KEY : process.env.AMPLITUDE_API_KEY_DEV,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridTransactionalApiKey: process.env.SENDGRID_TRANSACTIONAL_API_KEY,
  cloudflareZoneIdentifier: process.env.CLOUDFLARE_ZONE_IDENTIFIER,
  cloudflareToken: process.env.CLOUDFLARE_TOKEN,
  bigBearSecret: process.env.BIGBEAR_SECRET,
  defaultTrialDays: 7,
  scopes: [
    'write_draft_orders',
    'read_draft_orders',

    'read_orders',
    'write_orders',

    'write_order_edits',
    'read_order_edits',

    'read_products',
    'write_products',
    'write_script_tags',
    'read_script_tags',
    'read_themes',
    'write_themes',
  ],
  pricing: [
    {
      name: 'Free',
      price: 0,
      limit: 100, 
    },
    {
      name: 'Silver',
      price: 49.99,
      limit: 2000,
    },
    {
      name: 'Gold',
      compareAtPrice: 119.99,
      price: 99.99,
      limit: 5000,
    },
    {
      name: 'Platinum',
      price: 149.99,
      limit: 10000,
    },
  ],
  veteranPlan: {
    name: 'Partner Plan',
    price: 19.99,
    limit: 'unlimited',
  },
  earlyPlan: {
    name: 'Partner Plan',
    price: 29.99,
    limit: 'unlimited',
  },
};
