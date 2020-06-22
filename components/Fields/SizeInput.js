/* eslint-disable quotes */
import React from 'react';
import { Label, TextField, InlineError } from '@shopify/polaris';
import classNames from 'classnames';
import './SizeInput.scss';

const SizeInput = ({ input, label, symbol, meta: { error, touched }, className, eventName }) => {

  return (
    <div className={classNames('SizeInput', className)}>
      <div className="input-block">
        {label ? <Label>{label}</Label> : null}
        <div className="input">
          <TextField
            value={input.value}
            onChange={input.onChange}
            onBlur={input.onBlur}
            error={touched && error || null}
            onFocus={() => {
              if (eventName) {
                amplitude.logEvent(eventName, { value: input.value });
              }
            }}
          />
          <div className={classNames("hint-text", { 'is-error': touched && error })}>
            {symbol}
          </div>
        </div>
      </div>
      {touched && error && <InlineError message={error} />}
    </div>
  );
};

export default SizeInput;
