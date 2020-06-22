const _ = require('lodash');
const PartnerCode = require('../models/PartnerCode');

module.exports = {

    'partner_code->post->public': async (ctx) => {

        const {
            code,
            name,
            trialDays,
            price,
            viewsLimit,
            unlimitedViews,
            isActive
        } = ctx.request.body;
        if(!code || !name){
            return null;
        }
    
        const partnerCode = await PartnerCode.findOne({ code });
        let newPartnerCode;
        if(!partnerCode){
            newPartnerCode = await PartnerCode.create({
                code,
                name,
                trialDays,
                price,
                viewsLimit,
                unlimitedViews,
                isActive
            })
        } else {
            return null;
        }
        return newPartnerCode;
      },
}