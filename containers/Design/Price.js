import React from 'react';
import { Card, Label, Icon, Link } from '@shopify/polaris';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { ViewMajorMonotone } from '@shopify/polaris-icons';
import QuestionMark from '../../components/QuestionMark';
import ColorPickerInput from '../../components/Fields/ColorPickerInput';
import TextInput from '../../components/Fields/TextInput';
import FontInput from '../../components/Fields/FontInput';


const Price = ({ setFreeShipping }) => (
  <Card title={I18n.t('Price')} sectioned>
    <QuestionMark className="Question-cart-header" content={I18n.t('The price drop would show if your offer is % or $ off Free shipping offers have a different layout')} />
    <div className="margin-bottom" style={{ color: '#637381' }}>
      <Label>{I18n.t('Discount settings')}</Label>
    </div>
    <Field
      className="margin-bottom"
      name="design.theme.price.old_price_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Old price color')}
      eventName='click-design_price_old_price_color'
    />
    <Field
      className="margin-bottom"
      name="design.theme.price.new_price_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('New price color')}
      eventName='click-design_price_new_price_color'
    />
    <div style={{ position: 'relative' }}>
      <Field
        name="design.theme.price.discount_text"
        className="margin-bottom"
        component={TextInput}
        multiline={3}
        label={I18n.t('Discount text')}
        eventName='click-design_price_discount_text'
        spellCheck
      />
      <QuestionMark style={{ top: 0, right: 0 }} className="Question-cart-header" content={I18n.t('Use {{discount-amount}} to dynamically add your buyer savings on the product')} />
    </div>
    <Link
      onClick={() => {
        setFreeShipping(false);
        amplitude.logEvent('click-design_price_discount_preview');
      }}
    >
      <div style={{ display: 'flex' }}>
        <Icon source={ViewMajorMonotone} />
        <span style={{ marginLeft: '0.9rem' }}>{I18n.t('Preview')}</span>
      </div>
    </Link>

    <div className="margin-bottom" style={{ color: '#637381', marginTop: '2rem' }}>
      <Label>{I18n.t('Free shipping settings')}</Label>
    </div>
    <Field
      name="design.theme.price.text"
      className="margin-bottom"
      component={TextInput}
      label={I18n.t('Text')}
      eventName='click-design_price_free_shipping_text'
      spellCheck
    />
    <Field
      className="margin-bottom"
      name="design.theme.price.text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Text color')}
      eventName='click-design_price_free_shipping_text_color'
    />
    <Link
      onClick={() => {
        setFreeShipping(true);
        amplitude.logEvent('click-design_price_free_shipping_preview');
      }}
    >
      <div style={{ display: 'flex' }}>
        <Icon source={ViewMajorMonotone} />
        <span style={{ marginLeft: '0.9rem' }}>{I18n.t('Preview')}</span>
      </div>
    </Link>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem' }}>
      <div style={{ marginRight: '3rem' }}>
        <Label>{I18n.t('Font')}</Label>
      </div>
      <div style={{ display: 'flex', flex: 'auto' }}>
        <Field
          name="design.theme.price.font"
          label={I18n.t('Font')}
          component={FontInput}
          eventName='click-design_price_font'
        />
      </div>
    </div>
  </Card>
);

export default Price;
