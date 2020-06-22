import React from 'react';
import findIndex from 'lodash.findindex';
import styled from 'styled-components';
import config from '../../../redux/config';
import NextOfferMobile from './NextOfferMobile';

const { colors } = config;

const TopBar = (props) => {
  const { settings_theme: { top_bar }, offer } = props;
  if (!top_bar.show) {
    return null;
  }

  let background_color = '#212B36';

  if (top_bar.background_color) {
    background_color = top_bar.background_color;
    if (top_bar.background_color.indexOf('gradient_') > -1) {
      const index = findIndex(colors.gradients, [
        'name',
        top_bar.background_color,
      ]);
      if (index > -1) {
        background_color = colors.gradients[index].style;
      }
    }
  }

  const Container = styled.div`
    display: flex;
    width: 100%;
    /* height: 6rem; */
    padding: 1rem;
    background: ${background_color};
    justify-content: center;
    color: ${top_bar.text_color};
    align-items: center;
    position: relative;
  `;

  const Paragraph = styled.p`
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${top_bar.text_color};
    font-size: ${top_bar.text_size / 10}rem;
    line-height:  ${top_bar.font == 'Pacifico' ? 1.8 : 1.3};
    font-family: ${top_bar.font};
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* number of lines to show */
    max-height: 54px;  
    width: 100%;
  `;

  const title = offer.offer_text;
  return (
    <Container id="top-bar">
      <NextOfferMobile {...props} />
      <Paragraph>{title}</Paragraph>
    </Container>
  );
};

export default TopBar;
