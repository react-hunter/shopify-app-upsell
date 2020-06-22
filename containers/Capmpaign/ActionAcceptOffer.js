import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import SelectInput from '../../components/Fields/SelectInput';
import {Field} from "redux-form";

class ActionAcceptOffer extends Component {
  render() {
    const {formValues} = this.props;


    if(formValues.page_to_show == 'thankyou_page' || (formValues.page_to_show == 'cart_page' && formValues.event == 'checkout_click')){
      return null;
    }

    let options = [
      {label: 'Go to checkout', value: 'go_to_checkout'},
      {label: 'Go to cart', value: 'go_to_cart'},
      {label: 'Stay on page', value: 'stay_on_page'},
    ];

    if(formValues.page_to_show == 'cart_page'){
      options = [
        {label: 'Go to checkout', value: 'go_to_checkout'},
        {label: 'Stay on page', value: 'stay_on_page'},
      ];
    }
    return (
      <React.Fragment>
        <hr class="margin-bottom"></hr>
        <div className="padding-horizontal margin-bottom">
          <h2 className="Polaris-Heading margin-bottom">
            {I18n.t("What happens after buyers accept your offers?")}
          </h2>
            <Field
              name="action_accept_offer"
              className="max-width-195"
              component={SelectInput}
              label=""
              options={options}
            />
        </div>
      </React.Fragment>
    );
  }
}

export default ActionAcceptOffer;
