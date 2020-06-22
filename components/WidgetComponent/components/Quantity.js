import React from 'react';
import findIndex from 'lodash.findindex';
import styled from 'styled-components';
import config from '../../../redux/config';
import IconMinus from './icons/IconMinus';
import IconPlus from './icons/IconPlus';

const { colors } = config;

const Quantity = ({ quantity, settings, style, onChange, label = 'Quantity' }) => {

  const styles = {
    div: {
      color: '#212B36',
      background: '#FFFFFF',
    },
    separator: {
      background: '#212B36',
    },
    bt: {
      color: '#212B36',
    },
  };

  if (settings.product.variants_text_color) {
    styles.div.color = settings.product.variants_text_color;
    styles.bt.color = settings.product.variants_text_color;
  }

  if (settings.product.vartiants_bg_color) {
    styles.div.background = settings.product.vartiants_bg_color;
    if (settings.product.vartiants_bg_color.indexOf('gradient_') > -1) {
      const index = findIndex(colors.gradients, ['name', settings.product.vartiants_bg_color]);
      if (index > -1) {
        styles.div.background = colors.gradients[index].style;
      }
    }
  }

  const styleMinus = { ...styles.bt };

  if (quantity === 1) {
    styleMinus.filter = 'saturate(50%)';
  }

  const QuantityDiv = styled.div`
    color: ${styles.div.color || 'black'};
    background: ${styles.div.background ? styles.div.background : 'white'};
    border-radius: 0.5rem;
    border: 1px solid #C6C9CC;
    font-size: 1.6rem;
    line-height: 1.9rem;
    display: flex;
    flex-direction: row;
    height: 3.8rem;
    align-items: center;
  `;

  const CountDiv = styled.div`
    min-width: '3.6rem';
    text-align: center;
    color: ${styles.div.color || 'black'};
    flex: auto;
    font-family: ${settings.product.font};
  `;

  const Separator = styled.div`
    /* filter: saturate(10%); */
    height: 3.8rem;
    width: 1px;
    /* background: ${styles.separator.background || 'white'}; */
    background: #C6C9CC;
  `;

  const Button = styled.div`
    min-width: 3.8rem;
    height: 3.8rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${styles.bt.color || 'black'};
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  `;

  const Container = styled.div`
    display: flex;
    /* flex: auto; */
    width: 50%;
    flex-direction: column;
    font-size: 1.6rem;
  `;

  const Title = styled.div`
    font-size: 1.4rem;
    font-family: ${settings.product.font ? settings.product.font : ''};
    line-height: 1.7rem;
    color: ${styles.div.color ? styles.div.color : 'black'};
    margin-bottom: 0.6rem;
  `;
  return (
    <Container style={style}>
      <Title>{label}</Title>
      <QuantityDiv>
        <Button
          style={styleMinus}
          onClick={() => {
            if (quantity > 1 && onChange) {
              onChange(parseInt(quantity, 10) - 1);
            }
          }}
        >
          <IconMinus style={{ width: '1.2rem', height: '0.2rem', fill: styles.div.color ? styles.div.color : 'black' }} />
        </Button>
        <Separator />
        <CountDiv>
          {quantity}
        </CountDiv>
        <Separator />
        <Button
          onClick={() => {
            if (onChange) {
              onChange(parseInt(quantity, 10) + 1);
            }
          }}
        >
          <IconPlus style={{ width: '1.2rem', height: '1.2rem', fill: styles.div.color ? styles.div.color : 'black' }} />
        </Button>
      </QuantityDiv>
    </Container>
  );
};

export default Quantity;
