import React, { Component } from 'react';
import './ButtonGroupInput.scss';
import { ButtonGroup, Button } from '@shopify/polaris';
import classNames from 'classnames';

class ButtonGroupInput extends Component {
  render() {
    const {input, options, className, handleChange} = this.props;
    return (
      <div className={classNames("ButtonGroupInput", className)}>
        <ButtonGroup segmented>
          {options.map((item, index) => 
            <Button 
              icon={item.icon} 
              key={input.vame + '-' + index + '-' + item.value} 
              primary={item.value == input.value} 
              onClick={() => {
                if(handleChange){
                  handleChange(input, item.value);
                  return;
                }
                input.onChange(item.value)
              }}
            >{item.title}</Button>
          )}
        </ButtonGroup>
      </div>
    );
  }
}

export default ButtonGroupInput;
