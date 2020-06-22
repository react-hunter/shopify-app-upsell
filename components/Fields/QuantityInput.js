/* eslint-disable no-undef */
import React from 'react';
import { Label, TextField, InlineError } from '@shopify/polaris';
import classNames from 'classnames';
import './QuantityInput.scss';

const QuantityInput = ({ input, label, label2, meta: { error, touched }, className, eventName }) => {

  return (
    <div className={classNames('QuantityInput', className)}>
      <div className="input-block">
        <Label>{label}</Label>
        <div className="input">
          <TextField
            value={input.value}
            type="number"
            onChange={input.onChange}
            onBlur={input.onBlur}
            error={touched && error || null}
            onFocus={() => {
              if (eventName) {
                amplitude.logEvent(eventName, { value: input.value });
              }
            }}
          />
        </div>
        {label2 ? <Label>{label2}</Label> : null}
      </div>
      {touched && error && <InlineError message={error} />}
    </div>
  );
};

export default QuantityInput;
