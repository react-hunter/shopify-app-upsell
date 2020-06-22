/* eslint-disable no-undef */
import React from 'react';
import classNames from 'classnames';
import { Checkbox } from '@shopify/polaris';
import './CheckboxInput.scss';

const CheckboxInput = ({ input, label, fullWidth, className, eventName }) => {
  return (
    <div className={classNames('CheckboxInput', className)} style={{ width: fullWidth ? '100%' : 'auto' }}>
      <Checkbox
        checked={input.value}
        label={label}
        onChange={input.onChange}
        onFocus={() => {
          if (eventName) {
            amplitude.logEvent(eventName, { value: `${!input.value}` });
          }
        }}
      />
    </div>
  );
};

export default CheckboxInput;
