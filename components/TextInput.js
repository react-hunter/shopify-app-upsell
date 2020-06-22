import React from 'react';
import { TextField } from '@shopify/polaris';

const TextInput = ({ label, input, multiline, placeholder, className, meta: { error, touched }, handleBlur, handleFocus, eventName, }) => {
  return (
    <div className={className}>
      <TextField
        label={label}
        value={input.value}
        onChange={input.onChange}
        placeholder={placeholder}
        onBlur={(event) => {
          if (handleBlur) {
            handleBlur(event);
          }
          if (input.onBlur) {
            input.onBlur(event);
          }
        }}
        onFocus={(event) => {
          if (handleFocus) {
            handleFocus(event);
          }
          if (eventName) {
            amplitude.logEvent(eventName)
          }
        }}
        multiline={multiline}
        error={touched && error || null}
      />
    </div>
  );
};

export default TextInput;
