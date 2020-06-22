import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Stack, RadioButton } from '@shopify/polaris';
import { connect } from 'react-redux';
import { formValueSelector, Field } from 'redux-form';
import { required, numericality, length } from 'redux-form-validators';
import QuestionMark from '../../components/QuestionMark';
import SearchProducts from '../../components/Fields/SearchProducts';
import SizeInput from '../../components/Fields/SizeInput';
import SearchCollections from '../../components/Fields/SearchCollections';

class SetCampaignTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (value, id) => {
    this.props.change('trigger', id);
    amplitude.logEvent('click-campaign_select_trigger',{trigger: id});
  };

  render() {
    const { trigger, default_money_format, formValues } = this.props;
    const symbolCurrency = default_money_format.replace(/\{\{.*?\}\}/, '').replace(/<[^>]*>/g, '');

    const page_to_show = formValues && formValues.page_to_show || '';

    const tooltip = {
      
      trigger_products: {
        product_page: 'Buyers would see this funnel only if they are in these products pages',
        cart_page: 'Buyers would see this funnel only if they added these products',
        thankyou_page: 'Buyers would see this funnel only if they purchased these products',
      },
      trigger_collections: {
        product_page: 'Buyers would see this funnel only if they are in these collections products pages',
        cart_page: 'Buyers would see this funnel only if they added at least 1 item of these collections',
        thankyou_page: 'Buyers would see this funnel only if they purchased at least 1 item of these collections',
      },
      trigger_amount: {
        product_page: 'Buyers would see this funnel only if their cart / order value is above a specific amount',
        cart_page: 'Buyers would see this funnel only if their cart / order value is above a specific amount',
        thankyou_page: 'Buyers would see this funnel only if their cart / order value is above a specific amount',
      },
      trigger_all: {
        product_page: 'Select this option if you want to show this funnel for all buyers',
        cart_page: 'Select this option if you want to show this funnel for all buyers',
        thankyou_page: 'Select this option if you want to show this funnel for all buyers',
      },
    };

    return (
      <React.Fragment>
        <h2 className="Polaris-Heading padding-horizontal margin-bottom">{I18n.t('Upsell trigger')}</h2>
        {page_to_show === 'cart_page' ? <p className="padding-horizontal margin-bottom" dangerouslySetInnerHTML={{__html: I18n.t('Customers will see this funnel after they click "Continue to Checkout" Your funnel will be triggered based on these rules')}}></p> :
        <p className="padding-horizontal margin-bottom">{I18n.t('Your funnel will be triggered based on these rules')}</p>
        }
        <div className="padding-horizontal margin-bottom">
          <Stack vertical>
          <RadioButton
              label={
                <div className="label-radio-button">
                  {I18n.t('Show for all')} <QuestionMark content={page_to_show && I18n.t(tooltip['trigger_all'][page_to_show])} />
                </div>
              }
              id="trigger_all"
              name="accounts"
              checked={trigger === 'trigger_all'}
              onChange={this.handleChange}
            />
            <RadioButton
              label={
                <div className="label-radio-button">
                  {I18n.t('Show only for specific products')} <QuestionMark content={page_to_show && I18n.t(tooltip['trigger_products'][page_to_show])} />
                </div>
              }
              checked={trigger === 'trigger_products'}
              id="trigger_products"
              name="accounts"
              onChange={this.handleChange}
            />
            {trigger === 'trigger_products' ? (
              <Field
                name="trigger_products"
                component={SearchProducts}
                search_field="query"
                validate={[required({ message: I18n.t('Please select at least 1 product') }), length({ minimum: 1, message: I18n.t('Please select at least 1 product') })]}
                source='campaign_trigger'
              />
              ) : null}
            <RadioButton
              label={
                <div className="label-radio-button">
                  {I18n.t('Show only for specific collections')} <QuestionMark content={page_to_show && I18n.t(tooltip['trigger_collections'][page_to_show])} />
                </div>
              }
              id="trigger_collections"
              name="accounts"
              checked={trigger === 'trigger_collections'}
              onChange={this.handleChange}
            />
            {trigger === 'trigger_collections' ? (
              <Field
                name="trigger_collections"
                component={SearchCollections}
                validate={[required({ message: I18n.t('Please select at least 1 collection') }), length({ minimum: 1, message: I18n.t('Please select at least 1 collection') })]}
                source='campaign_trigger'
              />)
              : null}
            <RadioButton
              label={
                <div className="label-radio-button">
                  {I18n.t('Show only above a specific cart value')} <QuestionMark content={page_to_show && I18n.t(tooltip['trigger_amount'][page_to_show])} />
                </div>
              }
              id="trigger_amount"
              name="accounts"
              checked={trigger === 'trigger_amount'}
              onChange={this.handleChange}
            />
            {trigger === 'trigger_amount' ? (
              <Field
                name="trigger_amount"
                component={SizeInput}
                symbol={symbolCurrency}
                className="trigger-amount-input"
                validate={[required({ message: I18n.t('Please anter a value 0-99999') }), numericality({ '>': 0, message: I18n.t('Please anter a value 0-99999') })]}
                eventName="click-trigger_amount_value"
              />
            ) : null}
          </Stack>
        </div>
        <hr className=""></hr>
      </React.Fragment>
    );
  }
}

const selector = formValueSelector('campaign');

const mapStateToProps = (state) => ({
  trigger: selector(state, 'trigger'),
  trigger_products: selector(state, 'trigger_products'),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(SetCampaignTrigger);
