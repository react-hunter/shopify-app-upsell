import React from 'react';
import { findIndex } from 'lodash';
import config from '../../redux/config';
import CustomDrop from './CustomDropDown';
import './FontInput.scss';

const { fonts } = config;

const FontInput = (props) => {
  const index = findIndex(fonts, ['font-family', props.input.value]);
  const classNameInputValue = index > -1 ? fonts[index].class : '';
  return (
    <CustomDrop
      {...props}
      classNameInputValue={classNameInputValue}
      options={fonts.map((item) => (
        {
          title: item.caption,
          value: item['font-family'],
          className: item.class,
        }
      ))}
    />
  );
};

export default FontInput;
