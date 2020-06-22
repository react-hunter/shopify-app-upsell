import React from 'react';
import { Select } from '@shopify/polaris';

const SelectInput = ({ label, input, options, className, handleChange, eventName }) => {
  return (
    <div className={className}>
      <Select
        label={label}
        options={options}
        onChange={(value) => {
          if (handleChange) {
            handleChange(value, input);
            return;
          }
          if (input.onChange) {
            input.onChange(value);
          }
        }
      }
        value={input.value}
      />
    </div>
  );
};

export default SelectInput;
