import React from 'react';
import { Card, Label } from '@shopify/polaris';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import QuestionMark from '../../components/QuestionMark';
import ColorPickerInput from '../../components/Fields/ColorPickerInput';
import FontInput from '../../components/Fields/FontInput';
import QuantityInput from '../../components/Fields/QuantityInput';

const TopBar = () => (
  <Card title={I18n.t('Top Bar')} sectioned>
    <QuestionMark className="Question-cart-header" content={I18n.t('Top bar text is added dynamically according to your offer settings')} />
    <Field
      name="design.theme.top_bar.text_size"
      className="margin-bottom"
      component={QuantityInput}
      label={I18n.t('Text size')}
      eventName='click-design_top_bar_text_size'
    />
    <Field
      className="margin-bottom"
      name="design.theme.top_bar.background_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Background color')}
      eventName='click-design_top_bar_bg_color'
    />
    <Field
      className="margin-bottom"
      name="design.theme.top_bar.text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Text color')}
      eventName='click-design_top_bar_text_color'
    />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '3rem' }}>
        <Label>{I18n.t('Font')}</Label>
      </div>
      <div style={{ display: 'flex', flex: 'auto' }}>
        <Field
          name="design.theme.top_bar.font"
          label={I18n.t('Font')}
          component={FontInput}
          eventName='click-design_top_bar_font'
        />
      </div>
    </div>
  </Card>
);

export default TopBar;
