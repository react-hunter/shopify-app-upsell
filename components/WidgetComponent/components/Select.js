import React from 'react';
import findIndex from 'lodash.findindex';
import styled from 'styled-components';
import config from '../../../redux/config';
import Icon from './ArrorDown';

const { colors } = config;
const Select = ({ name, value, onChange, style, options, label, settings }) => {

  const styles = {
    select: {},
    div: {},
  };

  if (settings.product.variants_text_color) {
    styles.div.color = settings.product.variants_text_color;
    styles.select.color = settings.product.variants_text_color;
  }

  if (settings.product.vartiants_bg_color) {
    styles.select.background = settings.product.vartiants_bg_color;
    if (settings.product.vartiants_bg_color.indexOf('gradient_') > -1) {
      const index = findIndex(colors.gradients, ['name', settings.product.vartiants_bg_color]);
      if (index > -1) {
        styles.select.background = colors.gradients[index].style;
      }
    }
  }

  if (settings.product.font) {
    styles.select.fontFamily = `'${settings.product.font}', sans-serif`;
  }

  if (options.length <= 1) {
    return null;
  }

  const SelectInput = styled.select`
    color: ${styles.select.color ? styles.select.color : 'black'};
    background: ${styles.select.background ? styles.select.background : 'white'};
    font-family: ${styles.select.fontFamily ? styles.select.fontFamily : ''};
    border-radius: 0.5rem;
    border: 0.1rem solid #C6C9CC;
    height: 3.8rem;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 0 1.2rem;
    padding-right: 2.3rem;
    width: 100%;
    font-size: 1.6rem;
    line-height: 1.9rem;
    text-overflow: ellipsis;
  `;

  const SelectDiv = styled.div`
    color: ${styles.div.color ? styles.div.color : 'black'};
    position: relative;
    display: flex;
    align-items: center;
    flex: auto;
  `;

  const Label = styled.label`
    position: absolute;
    right: 1.5rem;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const Container = styled.div`
    display: flex;
    /* min-width: 12rem; */
    width: 50%;
    flex: auto;
    flex-direction: column;
  `;

  const Title = styled.div`
    font-size: 1.4rem;
    color: ${styles.div.color ? styles.div.color : 'black'};
    font-family: ${styles.select.fontFamily ? styles.select.fontFamily : ''};
    line-height: 1.7rem;
    margin-bottom: 0.6rem;
  `;

  return (
    <Container style={style}>
      <Title>{label}</Title>
      <SelectDiv>
        <SelectInput
          // style={styles.select}
          name={name}
          value={value}
          onChange={onChange}
          id={`id-select-${name}`}
        >
          {options.map((item, index) => <option key={`${name}-item-${value}-${index}`} value={item.value}>{item.title}</option>)}
        </SelectInput>
        <Label htmlFor={`id-select-${name}`}>
          <Icon fill={styles.select.color} />
        </Label>
      </SelectDiv>
    </Container>
  );
};

export default Select;
