import React, { Component } from 'react';
import './PageToShop.scss';
import { I18n } from 'react-redux-i18n';
import { Field } from "redux-form";
import classNames from 'classnames';
import ButtonGroupInput from '../../components/Fields/ButtonGroupInput';
import {
  CartDownMajorMonotone,
  ViewMajorMonotone,
  BillingStatementDollarMajorMonotone,
} from '@shopify/polaris-icons';
import CheckboxInput from '../../components/Fields/CheckboxInput';

const scrollToRef = (ref) => {
  if(ref.current){
    window.scrollTo({
      top: ref.current.offsetTop,
      left: 0,
      behavior: 'smooth'
    });
    return;
  }
} 

const SelectPageInput = ({input, refElementScrollTrigger, changeRoot, formValues, refElementToScroll, isCreate}) => <div className="padding-horizontal selected-page margin-bottom">
  <div 
    className={classNames("item", {active: 'cart_page' == input.value})}
    onClick={() => {
      amplitude.logEvent('click-select_page_to_show',{value: 'cart_page'})
      input.onChange('cart_page');
      if(isCreate && !formValues.page_to_show){
        setTimeout(() => scrollToRef(refElementScrollTrigger), 500);
      }
      
    }}
  >
    <img src='/static/images/cart_upsell.svg' />
    <div className="text">{I18n.t('Cart Page')}</div>
  </div>
  <div
    className={classNames("item", {active: 'thankyou_page' == input.value})}
    onClick={() => {
      input.onChange('thankyou_page');
      changeRoot('offers[0].free_shipping', true)
      if(isCreate && !formValues.page_to_show){
        setTimeout(() => scrollToRef(refElementScrollTrigger), 500);
      }
      amplitude.logEvent('click-select_page_to_show',{value: 'thankyou_page'})
    }}
  >
    <img src='/static/images/thankyou_upsell.svg' />
    <div className="text">{I18n.t('Thank You Page')}</div>
  </div>
</div>

class PageToShop extends Component {
  refElementToScroll = React.createRef();

  render() {
    const {change, formValues, isCreate, refElementScrollTrigger} = this.props;

    let options = [
      {title: 'Add to Cart click', value: 'add_to_cart_click', icon: CartDownMajorMonotone },
      {title: 'Page view', value: 'page_view', icon: ViewMajorMonotone},
    ];

    if(formValues.page_to_show == 'cart_page'){
      options = [
        {title: 'Checkout click', value: 'checkout_click', icon: BillingStatementDollarMajorMonotone },
        {title: 'Page view', value: 'page_view', icon: ViewMajorMonotone},
      ];
    }

    return (
      <div className="PageToShop">
        <h2 className="padding-horizontal margin-bottom Polaris-Heading">
          {I18n.t("Where would you like to upsell?")}
        </h2>
        <p className="padding-horizontal margin-bottom">
          {I18n.t("Select a page to show this funnel in")}
        </p>
        <Field
          name="page_to_show"
          component={SelectPageInput}
          changeRoot={change}
          refElementToScroll={this.refElementToScroll}
          refElementScrollTrigger={refElementScrollTrigger}
          isCreate={isCreate}
          formValues={formValues}
        />
      </div>
    );
  }
}

export default PageToShop;
