/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { Heading, Icon } from '@shopify/polaris';
import './AddUpsellOffers.scss';
import { I18n } from 'react-redux-i18n';
import { formValueSelector } from 'redux-form';
import { ExternalMinor, ViewMajorMonotone, ViewMinor } from '@shopify/polaris-icons';
import { connect } from 'react-redux';
import Offer from './Offer';


class AddUpsellOffers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { offers, touch, syncErrorsForm, formValues } = this.props;
    return (
      <div className="AddUpsellOffers">
        <Heading>{I18n.t('Add upsell offers')}</Heading>
        <p className="margin-bottom">{I18n.t('You can show up to 3 upsell offers on each campaign Offers would be displayed one after another')}</p>
        {Array.isArray(offers) && offers.length ? offers.map((offer, index) => (
          <Offer key={`offer-${index}-${offer.product && offer.product ? offer.product.id : 'new'}`} {...this.props} index={index} offer={offer} />
        )) : null}
        {offers.length < 3 ? (
          <div
            className="new-offer"
            onClick={() => {
              const { change } = this.props;
              change('offers', [...offers, {
                product: null,
                upsell_type: 'discount',
                free_shipping: true,
                limit_products_amount: 1,
                limit_products: false,
                offer_text: 'Deal unlocked! Get this product for 20% off',
                discount: {
                  amount: 20,
                  discount_type: 'percent_off',
                },
                free_shipping: formValues.page_to_show == 'thankyou_page' ? true : false
              }]);
              amplitude.logEvent('click-campaign_add_new_offer',{value: offers.length + 1});
            }}
          >
            <img src={require('../../static/images/newButton.svg')} alt="" />
            <p>{I18n.t('Add another offer')}</p>
          </div>
        ) : null}
        <div
          className="preview"
          onClick={() => {
            if (syncErrorsForm && syncErrorsForm.offers) {
              syncErrorsForm.offers.forEach((offer, index) => {
                touch(`offers[${index}].product`);
              });
              return null;
            }
            amplitude.logEvent('click-campaign_preview',{origin: 'edit_campaign'});
            window.open('/default/preview', '_blank');
          }}
        ><div style={{marginRight: '5px'}}><Icon source={ViewMinor} /></div>{I18n.t('Preview')}
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('campaign');

const mapStateToProps = (state) => ({
  offers: selector(state, 'offers'),
  syncErrorsForm: state.form && state.form.campaign && state.form.campaign.syncErrors ? state.form.campaign.syncErrors : {},
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(AddUpsellOffers);
