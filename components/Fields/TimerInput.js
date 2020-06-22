import React from 'react';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { Label } from '@shopify/polaris';
import { required } from 'redux-form-validators';
import './TimerInput.scss';
import TextInput from './TextInput';


const TimerInput = ({ nameInput, label, className }) => {
  return (
    <div className={classNames('TimerInput', className)}>
      <Label>{label}</Label>
      <div className="input">
        <Field
          name={`${nameInput}[0]`}
          component={TextInput}
          validate={[required()]}
          className="input-item"
          handleChange={(value, input) => {
            if (value < 10) {
              input.onChange(value);
            }
          }}
          eventName='click-design_countdown_timer_countdown_10_minutes'
        />
        <Field
          name={`${nameInput}[1]`}
          component={TextInput}
          validate={[required()]}
          className="input-item"
          handleChange={(value, input) => {
            if (value < 10) {
              input.onChange(value);
            }
          }}
          eventName='click-design_countdown_timer_countdown_minutes'
        />
        <div className="points">:</div>
        <Field
          name={`${nameInput}[2]`}
          component={TextInput}
          validate={[required()]}
          className="input-item"
          handleChange={(value, input) => {
            if (value < 10) {
              input.onChange(value);
            }
          }}
          eventName='click-design_countdown_timer_countdown_10_seconds'
        />
        <Field
          name={`${nameInput}[3]`}
          component={TextInput}
          validate={[required()]}
          className="input-item"
          handleChange={(value, input) => {
            if (value < 10) {
              input.onChange(value);
            }
          }}
          eventName='click-design_countdown_timer_countdown_seconds'
        />
      </div>
    </div>
  );
};

export default TimerInput;
