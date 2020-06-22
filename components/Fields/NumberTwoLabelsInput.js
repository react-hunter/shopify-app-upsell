import React from 'react';
import { Label, TextField, InlineError } from '@shopify/polaris';
import classNames from 'classnames';
import './NumberTwoLabelsInput.scss';

const NumberTwoLabelsInput = ({ input, label1, label2, meta: { error, touched }, className, eventName }) => {
  return (
    <div className={classNames('NumberTwoLabelsInput', className)}>
      <div className="input-block">
        <Label>{label1}</Label>
        <div className="input">
          <TextField
            value={input.value}
            onChange={input.onChange}
            onBlur={input.onBlur}
            type="number"
            min={1}
            error={touched && error || null}
            onFocus={() => {
              if (eventName) {
                amplitude.logEvent(eventName, { value: input.value });
              }
            }}
          />
        </div>
        <Label>{label2}</Label>
      </div>
      {touched && error && <InlineError message={error} />}
    </div>
  );
};

export default NumberTwoLabelsInput;
