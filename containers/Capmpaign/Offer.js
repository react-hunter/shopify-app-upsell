import React, { Component } from 'react';
import { Heading, Stack, RadioButton } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { required, numericality } from 'redux-form-validators';
import { newNotification, getProduct } from '../../redux/actions';
import SearchProducts from '../../components/Fields/SearchProducts';
import CheckboxInput from '../../components/Fields/CheckboxInput';
import NumberTwoLabelsInput from '../../components/Fields/NumberTwoLabelsInput';
import DiscountInput from '../../components/Fields/DiscountInput';
import TextInput from '../../components/Fields/TextInput';
import QuestionMark from '../../components/QuestionMark';

class Offer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxValidatePrice: null,
    };
  }

  async componentDidMount() {
    const { offer } = this.props;

    if (offer && offer.product && offer.product.id) {
      const product = await getProduct(offer.product.id);
      let maxValidatePrice = parseFloat(product.variants[0].price);
      product.variants.forEach((variant) => {
        if (maxValidatePrice > parseFloat(variant.price)) {
          maxValidatePrice = parseFloat(variant.price);
        }
      });
      this.setState({ maxValidatePrice });
    }

  }

  handleChange = (value, id) => {
    const { change, index } = this.props;
    change(`offers[${index}].upsell_type`, id.replace(`-${index}`, ''));
    amplitude.logEvent('click-campaign_select_upsell_offer',{offer: id});
  };

  render() {
    const { index, offer, change, offers, default_money_format } = this.props;
    const symbolCurrency = default_money_format.replace(/\{\{.*?\}\}/, '').replace(/<[^>]*>/g, '');
    const { maxValidatePrice } = this.state;
    return (
      <div className="Offer">
        {index > 0 ? (
          <div
            className="delete-action"
            onClick={() => {
              change('offers', offers.filter((_, i) => i !== index));
              this.props.newNotification('Offer deleted');
              amplitude.logEvent('click-campaign_delete_upsell_offer');
            }}
          >
            <img src={require('../../static/images/Delete.svg')} alt="" />
          </div>
        ) : null}
        <div className="content-block">
          <div className="margin-bottom" style={{display: 'flex'}}>
            <div className="offer-name-item">{I18n.t('Offer')} #{index+1}</div>
          </div>
          <Heading>{I18n.t('Select upsell product')}</Heading>
          <p className="margin-bottom">{I18n.t('Select a product that would be offered to your buyer')}</p>
          <Field
            name={`offers[${index}].product`}
            component={SearchProducts}
            onlyOne
            className="margin-bottom"
            validate={[required({ message: I18n.t('Please select at least 1 product') })]}
            source='campaign_offer'
          />
          <Heading>{I18n.t('Select upsell type')}</Heading>
          <div className="margin-bottom">
            <Stack vertical>
              <RadioButton
                label="Discount"
                checked={offer.upsell_type === 'discount'}
                id={`discount-${index}`}
                name={`upsell_type-${index}`}
                onChange={this.handleChange}
              />
              {offer.upsell_type === 'discount' ? (
                <DiscountInput
                  rootChange={this.props.change}
                  index={index}
                  maxValidatePrice={maxValidatePrice}
                  offer={offer}
                  symbolCurrency={symbolCurrency}
                  label={I18n.t('Offer the product for')}
                  discountTypeOptions={[
                    {
                      label: '% off',
                      value: 'percent_off',
                    },
                    {
                      label: `${symbolCurrency} off`,
                      value: 'amount_off',
                    },
                    {
                      label: 'Fixed price',
                      value: 'fixed_price',
                    },
                  ]}
                />
              ) : null}
              <RadioButton
                label="None"
                checked={offer.upsell_type === 'none'}
                id={`none-${index}`}
                name={`upsell_type-${index}`}
                onChange={this.handleChange}
              />
            </Stack>
          </div>
          <div style={{ display: 'flex' }}>
            <Heading>{I18n.t('Offer Text')}</Heading>
            <QuestionMark style={{ marginLeft: '1rem' }} content={I18n.t('Entice your buyer to take this offer The text would appear at the top of this offer page')} />
          </div>
          <Field
            name={`offers[${index}].offer_text`}
            component={TextInput}
            className="margin-bottom"
            validate={[required()]}
            eventName='click-campaign_offer_text'
            spellCheck
          />
          <div style={{ display: 'flex' }}>
          <Field
            name={`offers[${index}].show_offer_description`}
            component={CheckboxInput}
            className="margin-bottom"
            label={I18n.t('Show offer description')}
            eventName='click-show_campaign_offer_description'
          />
          <QuestionMark style={{ marginLeft: '1rem' }} content={I18n.t('Add a short and sweet offer description This would show below the product variants and images')} />
          </div>
          {offer.show_offer_description && <Field
            name={`offers[${index}].offer_description`}
            component={TextInput}
            className="margin-bottom"
            eventName='click-campaign_offer_description_text'
            multiline={3}
            placeholder={I18n.t('For example: Keep the eco-friendly vibe going This product is made from 100% organic recyclable materials Get the total green look now')}
            spellCheck
          />}
          <Heading>{I18n.t('Advanced')}</Heading>
          <Field
            name={`offers[${index}].free_shipping`}
            component={CheckboxInput}
            className="margin-bottom"
            label={I18n.t('Include free shipping for clients who accept this offer')}
            eventName='click-campaign_offer_free_shipping'
          />
          <Field
            name={`offers[${index}].limit_products`}
            component={CheckboxInput}
            className={offer.limit_products ? "margin-bottom" : ""}
            label={I18n.t('Limit the number of products your buyer could buy')}
            eventName='click-campaign_offer_limit_num_of_products'
          />
          {offer.limit_products ? (
            <Field
              name={`offers[${index}].limit_products_amount`}
              component={NumberTwoLabelsInput}
              className=""
              label1={I18n.t('Your buyer could buy')}
              label2={I18n.t('units of this product')}
              validate={[
                required({ message: 'Please enter a value 1-99999' }),
                numericality({ message: 'Please enter a value 1-99999', '>': 0 }),
              ]}
              eventName='click-campaign_offer_limit_num_of_products_value'
            />
          )
          : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {
  newNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Offer);
