import React, { Component } from 'react';
import { Label, InlineError } from '@shopify/polaris';
import { Field } from 'redux-form';
import { required, numericality } from 'redux-form-validators';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import './DiscountInput.scss';
import TextInput from './TextInput';
import SelectInput from './SelectInput';


class DiscountInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { label, index, className, eventName, rootChange, offer, discountTypeOptions, maxValidatePrice, symbolCurrency } = this.props;
    return (
      <div className={classNames('DiscountInput', className)}>
        <div className="input-block">
          <Label>{label}</Label>
          <div className="input">
            <Field
              eventName={eventName}
              name={`offers[${index}].discount.amount`}
              validate={[
                required({ message: I18n.t('Please enter a value 0-99999') }),
                numericality({
                  msg: {
                    '>': I18n.t('Please enter a value 0-99999'),
                    '<=': I18n.t('Please enter a value 0-99999'),
                  },
                  '>': 0,
                  '<=': offer.discount.discount_type === 'fixed_price' && maxValidatePrice ? maxValidatePrice : 10000000,
                }),
              ]}
              component={TextInput}
              align="right"
              handleBlur={(event, input) => {
                const value = event.target.value;
                if ((offer.discount.discount_type === 'amount_off' || offer.discount.discount_type === 'fixed_price') && !isNaN(parseFloat(value))) {
                  setTimeout(() => {
                    input.onChange(parseFloat(value).toFixed(2));
                  }, 50);
                }
              }}
              eventName='click-campaign_upsell_offer_discount_amount'
            />
            <Field
              eventName={eventName}
              name={`offers[${index}].discount.discount_type`}
              validate={[required()]}
              component={SelectInput}
              options={discountTypeOptions}
              className={classNames({ 'fixed-price': offer.discount.discount_type === 'fixed_price' })}
              handleChange={(value, input) => {
                input.onChange(value);
                if (value === 'fixed_price' || value === 'amount_off') {
                  rootChange(`offers[${index}].discount.amount`, '5.00');
                } else {
                  rootChange(`offers[${index}].discount.amount`, 20);
                }
                amplitude.logEvent('click-campaign_select_upsell_offer_discount_type',{value});
                
              }}
            />
          </div>
        </div>
        {!offer.discount.amount || isNaN(parseFloat(offer.discount.amount)) || parseFloat(offer.discount.amount) < 0 ? <InlineError message={I18n.t('Please enter a value 0-99999')} /> : (
            offer.discount.discount_type === 'fixed_price' && parseFloat(offer.discount.amount) > maxValidatePrice && maxValidatePrice ? <InlineError message={I18n.t('error_price', {price: maxValidatePrice.toFixed(2), currency: symbolCurrency})} /> : null
          )}
      </div>
    );
  }
}

export default DiscountInput;
