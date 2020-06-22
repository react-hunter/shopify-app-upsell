import React from 'react';
import { TextField } from '@shopify/polaris';

const TextInput = ({ label, style, handleChange, align, inputProps, input, multiline, placeholder, className, meta: { error, touched }, handleBlur, handleFocus, eventName, spellCheck }) => {
  return (
    <div className={className} style={style}>
      <TextField
        {...inputProps}
        label={label}
        value={input.value}
        onChange={(event) => {
          if (handleChange) {
            handleChange(event, input);
          } else {
            input.onChange(event);
          }
        }}
        placeholder={placeholder}
        onBlur={(event) => {
          if (handleBlur) {
            handleBlur(event, input);
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
            amplitude.logEvent(eventName);
          }
        }}
        multiline={multiline}
        align={align}
        error={touched && error || null}
        spellCheck={spellCheck ? true : false}
      />
    </div>
  );
};

export default TextInput;
