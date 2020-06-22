/* eslint-disable no-unreachable */
const sendgridClient = require('@sendgrid/client');
const {
  sendgridApiKey,
} = require('../config');
const reportEvent = require('./reportEvent');

sendgridClient.setApiKey(sendgridApiKey);

function addSubscriberToUninstalledList(shopEmailAddress) {
  console.log('removing shopEmailAddress from sendgrid installed list');
  const uninstalledEmailListId = '2fa6411d-4c49-48df-88c1-fd535ae15dc5';
  const didNotReviewEmailListId = '8884c611-e003-4cbe-afa9-55e27d46dd84';
  // 1. Search for the shop email in sendgrid
  const getRecipientRequest = {
    method: 'POST',
    url: '/v3/marketing/contacts/search',
    body: {
      query: `primary_email LIKE '${shopEmailAddress}%'`,
    },
  };
  sendgridClient.request(getRecipientRequest)
    .then(([, body]) => {
      if (body.result.length !== 1) {
        return;
      }
      // then take the id of that user and remove him from the first list, and add him to the uninstalled list
      const updatedContact = body.result[0];
      updatedContact.list_ids = [uninstalledEmailListId];
      const updateContactRequest = {
        method: 'PUT',
        url: '/v3/marketing/contacts',
        body: {
          list_ids: [uninstalledEmailListId],
          contacts: [{
            email: updatedContact.email,
            id: updatedContact.id,
            list_ids: [uninstalledEmailListId],
          }],
        },
      };
      // eslint-disable-next-line promise/no-nesting
      sendgridClient.request(updateContactRequest)
        .then((/* [ response, body ] */) => {
          const deleteContactFromList = {
            method: 'DELETE',
            url: `v3/mc/lists/${didNotReviewEmailListId}/contacts?contact_ids=${updatedContact.id}`,
          };
          // eslint-disable-next-line promise/no-nesting
          sendgridClient.request(deleteContactFromList)
            // eslint-disable-next-line no-empty-function
            .then((/* [response, body] */) => {

            })
            .catch((error) => {
              console.debug(`error when trying to update sendgrid : ${error}`);
              reportEvent(null, 'error', `sendgrid error error ${error}`);
            });
        })
        .catch((error) => {
          console.debug(`error when trying to update sendgrid: ${error}`);
          reportEvent(null, 'error', `sendgrid error error ${error}`);
        });
    })
    .catch((error) => {
      console.debug(`error when trying to send email to sendgrid: ${error}`);
      reportEvent(null, 'error', `sendgrid error error ${error}`);
    });
}

// removes the subcriber from the did not review list and moves him to
// the uninstalled emailing list
function addNewSubscriberToEmailList(shopInfo) {
  if (!shopInfo) {
    return null;
  }
  const didNotReviewEmailListId = '8884c611-e003-4cbe-afa9-55e27d46dd84';
  const shopCustomFieldId = 'e1_T';
  const languageCustomFieldId = 'e2_T';
  const shopNameCustomFieldId = 'e3_T';
  const myshopifyDomainCustomFieldId = 'e4_T';
  const hasTrust = 'e6_T';
  const request = {
    method: 'PUT',
    url: '/v3/marketing/contacts',
    body: {
      list_ids: [didNotReviewEmailListId],
      contacts: [{
        email: shopInfo.email,
        first_name: shopInfo.shop_owner,
        custom_fields: {
          [shopCustomFieldId]: shopInfo.domain,
          [languageCustomFieldId]: shopInfo.primary_locale,
          [shopNameCustomFieldId]: shopInfo.name,
          [myshopifyDomainCustomFieldId]: shopInfo.myshopify_domain,
          [hasTrust]: 'yes',
        },
      }],
    },
  };
  sendgridClient.request(request)
    .then(([response, body]) => {
      console.log(response.statusCode);
      console.log(body);
    })
    .catch((error) => {
      console.debug(`error when trying to send email to sendgrid: ${error}`);
      reportEvent(shopInfo.myshopify_domain, 'error', error);
    });
}

module.exports = {
  addSubscriberToUninstalledList,
  addNewSubscriberToEmailList,
};
