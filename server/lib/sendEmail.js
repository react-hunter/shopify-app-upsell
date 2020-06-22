const config = require("../config");
const sendgrid = require("@sendgrid/mail");
const { sendgridTransactionalApiKey } = config;

module.exports = async function sendEmail({
  email,
  templateId,
  dynamicData,
  unsubscribeGroup = 13301,
  sendAt,
  categories,
  sender = {
    email: "lynda@conversionbear.com",
    name: "Lynda from Conversion Bear",
  }
}) {
  console.log(`sending email to: ${email} with template: ${templateId}`);
  if (!sendgridTransactionalApiKey) {
    return;
  }
  sendgrid.setApiKey(sendgridTransactionalApiKey);
  const msg = {
    to: email,
    from: {
      email: sender.email,
      name: sender.name,
    },
    templateId: templateId,
    dynamic_template_data: {
      ...dynamicData,
    },
    asm: {
      groupId: unsubscribeGroup,
    },
    categories,
    sendAt,
  };

  return sendgrid
    .send(msg)
    .then(() => {
      console.log(`email sent succesfully`);
    })
    .catch((error) => console.error(error.toString()));
};
