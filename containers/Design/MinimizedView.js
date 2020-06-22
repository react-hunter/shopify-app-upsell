import React from 'react';
import { Card, Link, Icon } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { ViewMajorMonotone } from '@shopify/polaris-icons';
import QuestionMark from '../../components/QuestionMark';
import CheckboxInput from '../../components/Fields/CheckboxInput';
import TextInput from '../../components/Fields/TextInput';
import { required } from 'redux-form-validators';

const MinimizedView = (props) => {
  return (
    <Card title={I18n.t('Minimized View')} sectioned>
      <QuestionMark className="Question-cart-header" content={I18n.t('The app appears in minimal state when it’s closed')} />
      <Field
        className="margin-bottom"
        name="design.theme.minimized_view.start_minimized"
        component={CheckboxInput}
        fullWidth
        label={I18n.t('Start minimized')}
        eventName='click-design_minimized_view_start_minimized'
      />
      <Field
        name="design.theme.minimized_view.minimized_button_text"
        className="margin-bottom"
        component={TextInput}
        label={I18n.t('Minimized button text')}
        eventName='click-design_minimized_view_button_text'
        spellCheck
        validate={[required()]}
      />
      <Link
        onClick={() => {
          props.setMinimized(true);
          amplitude.logEvent('click-design_minimized_view_preview');
          setTimeout(() => {
            props.setMinimized(false);
          }, 10000);
        }}
      >
        <div style={{ display: 'flex' }}>
          <Icon source={ViewMajorMonotone} />
          <span style={{ marginLeft: '0.9rem' }}>{I18n.t('Preview')}</span>
        </div>
      </Link>
    </Card>
  );
};

export default MinimizedView;
