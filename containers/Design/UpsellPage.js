import React from 'react';
import { Card } from '@shopify/polaris';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import QuestionMark from '../../components/QuestionMark';
import ColorPickerInput from '../../components/Fields/ColorPickerInput';
import TextInput from '../../components/Fields/TextInput';

const UpsellPage = () => (
  <Card title={I18n.t('Upsell Page')} sectioned>
    <Field
      className="margin-bottom"
      name="design.theme.upsell_page.background_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Background color')}
      eventName='click-design_upsell_page_bg_color'
    />
    <div style={{ position: 'relative' }}>
      <Field
        name="design.theme.upsell_page.next_offer_text"
        className="margin-bottom"
        component={TextInput}
        label={I18n.t('Next offer text')}
        eventName='click-design_upsell_page_next_offer_text'
        spellCheck
      />
      <QuestionMark style={{ top: 0, right: 0 }} className="Question-cart-header" content={I18n.t('Next offer text would show only if your campaign has more than 1 offer')} />
    </div>
    <div style={{ position: 'relative' }}>
      <Field
        name="design.theme.upsell_page.previous_offer_text"
        className="margin-bottom"
        component={TextInput}
        label={I18n.t('Previous offer text')}
        eventName='click-design_upsell_page_previous_offer_text'
        spellCheck
      />
      <QuestionMark style={{ top: 0, right: 0 }} className="Question-cart-header" content={I18n.t('Previous offer text would show only if your campaign has more than 1 offer')} />
    </div>
    <Field
      className="margin-bottom"
      name="design.theme.upsell_page.text_color"
      fullWidth
      component={ColorPickerInput}
      hideGradient
      label={I18n.t('Text color')}
      eventName='click-design_upsell_page_bg_color'
    />
    <Field
      className="margin-bottom"
      name="design.theme.upsell_page.top_background_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Top background color')}
      eventName='click-design_upsell_page_bg_color'
    />
  </Card>
);

export default UpsellPage;
