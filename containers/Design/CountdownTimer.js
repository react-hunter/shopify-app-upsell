import React from 'react';
import { Card, Label } from '@shopify/polaris';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import QuestionMark from '../../components/QuestionMark';
import ColorPickerInput from '../../components/Fields/ColorPickerInput';
import CheckboxInput from '../../components/Fields/CheckboxInput';
import TextInput from '../../components/Fields/TextInput';
import FontInput from '../../components/Fields/FontInput';
import QuantityInput from '../../components/Fields/QuantityInput';
import TimerInput from '../../components/Fields/TimerInput';

const CountdownTimer = () => (
  <Card title={I18n.t('Countdown Timer')} sectioned>
    <QuestionMark className="Question-cart-header" content={I18n.t('Add a sense of urgency to your offer with a countdown timer')} />
    <Field
      className="margin-bottom"
      name="design.theme.countdown_timer.show"
      component={CheckboxInput}
      fullWidth
      label={I18n.t('Show')}
      eventName='click-design_countdown_timer_show'
    />
    <Field
      name="design.theme.countdown_timer.bar_text"
      className="margin-bottom"
      component={TextInput}
      multiline={3}
      label={I18n.t('Bar text')}
      eventName='click-design_countdown_timer_text'
      spellCheck
    />
    <Field
      name="design.theme.countdown_timer.text_size"
      className="margin-bottom"
      component={QuantityInput}
      label={I18n.t('Text size')}
      eventName='click-design_countdown_timer_text_size'
    />
    <Field
      className="margin-bottom"
      name="design.theme.countdown_timer.background_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Background color')}
      eventName='click-design_countdown_timer_bg_color'
    />
    <Field
      className="margin-bottom"
      name="design.theme.countdown_timer.text_color"
      fullWidth
      component={ColorPickerInput}
      label={I18n.t('Text color')}
      eventName='click-design_countdown_timer_text_color'
    />
    <div className="margin-bottom" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '3rem' }}>
        <Label>{I18n.t('Font')}</Label>
      </div>
      <div style={{ display: 'flex', flex: 'auto' }}>
        <Field
          name="design.theme.countdown_timer.font"
          label={I18n.t('Font')}
          component={FontInput}
          eventName='click-design_countdown_timer_font'
        />
      </div>
    </div>
    <Field
      className="margin-bottom"
      nameInput="design.theme.countdown_timer.start_countdown_from"
      name=""
      component={TimerInput}
      fullWidth
      label={I18n.t('Start countdown from')}
    />
  </Card>
);

export default CountdownTimer;
