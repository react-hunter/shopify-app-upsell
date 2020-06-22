import React, { Component } from 'react';
import styled from 'styled-components';
import ArrowLeft from './icons/ArrowLeft';
import ArrowRight from './icons/ArrowRight';
import config from '../../../redux/config';
import findIndex from 'lodash.findindex';
const { colors } = config;

class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { campaign, active_offer, settings_theme, nextOffer, prevOffer, isPreview } = this.props;

    let background_color = '#212B36';
    if (settings_theme.upsell_page.top_background_color) {
      background_color = settings_theme.upsell_page.top_background_color;
      if (background_color.indexOf('gradient_') > -1) {
        const index = findIndex(colors.gradients, [
          'name',
          background_color,
        ]);
        if (index > -1) {
          background_color = colors.gradients[index].style;
        }
      }
    }

    if (campaign.offers.length === 1) {
      return null;
    }

    const Container = styled.div`
      display: flex;
      background: ${background_color};
      flex-direction: column;
    `;

    const Nav = styled.div`
      display: flex;
      justify-content: space-between;
      padding: 1.1rem 1rem;
    `;

    const Left = styled.div`
      color: ${settings_theme.upsell_page.text_color};
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      line-height: 1.8rem;
      cursor: pointer;
      font-family: 'Open Sans', sans-serif;
    `;

    const Right = styled.div`
      color: ${settings_theme.upsell_page.text_color};       
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      line-height: 1.8rem;
      cursor: pointer;
      font-family: 'Open Sans', sans-serif;
    `;

    return (
      <Container id="top-navigation" top_background_color={settings_theme.upsell_page.top_background_color}>
        <Nav>
          {active_offer !== 0 || isPreview ? (
            <Left
              text_color={settings_theme.upsell_page.text_color}
              onClick={() => {
                prevOffer();
              }}
            >
              <ArrowLeft style={{ width: '1.8rem', height: '1.7rem', fill: settings_theme.upsell_page.text_color }} /> {settings_theme.upsell_page.previous_offer_text || ''}
            </Left>) : <div />}
          {campaign.offers.length !== active_offer + 1 ? (
            <Right
              text_color={settings_theme.upsell_page.text_color}
              onClick={() => {
                nextOffer();
              }}
            >
              {settings_theme.upsell_page.next_offer_text || ''} <ArrowRight style={{ width: '1.8rem', height: '1.7rem', fill: settings_theme.upsell_page.text_color }} />
            </Right>) : null}
        </Nav>
      </Container>
    );
  }
}

export default TopNavigation;
