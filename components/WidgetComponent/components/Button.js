import React, { Component } from 'react';
import styled from 'styled-components';
import findIndex from 'lodash.findindex';
import config from '../../../redux/config';
import isOutOfStock from '../../../lib/isOutOfStock';

const { colors } = config;

const RedirectText = styled.div`
  margin-left: 1rem;
  text-decoration-line: none;
`

const Container = styled.div`
  display: flex;
  background: ${(props) => props.isUnavailable ? props.text_color : props.background_color};
  width: 100%;
  padding: ${(props) => (props.spiner ? '1rem' : '1.4rem')}; 
  font-size: 1.8rem;
  line-height: 2.2rem;
  text-align: center;
  /* margin-top: 2rem; */
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${(props) => props.isUnavailable ? props.background_color : props.text_color};
  font-family: ${(props) => props.settings_theme.product.font};
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

const Text = styled.div`
  overflow: hidden;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;
`;

const Spiner = styled.div`
  
  @keyframes spin {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(359deg);
    }
  }

  &.spinner-box {
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }

  .smt-spinner-circle {
    width: 3rem;
    height: 3rem;
    position: relative;
    border-radius: 50%;
  }
  .smt-spinner {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border-right: 2px solid rgba(255,255,255,0);
    border-top: 2px solid rgba(255,255,255,0);
    border-left: 2px solid ${(props) => props.settings_theme.product.button_text_color || '#FFFFFF'};
    border-bottom: 2px solid ${(props) => props.settings_theme.product.button_text_color || '#FFFFFF'};
    animation: spin .8s linear 0s infinite;
  }
`;


class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spiner: false,
    };
  }

  render() {
    const { onClick, pageToShow, variant, settings_theme, minimized, active_offer, campaign, typeButton, data } = this.props;

    const { spiner } = this.state;

    let background_color = '#212B36';

    if (settings_theme.product.button_color) {
      background_color = settings_theme.product.button_color;
      if (settings_theme.product.button_color.indexOf('gradient_') > -1) {
        const index = findIndex(colors.gradients, [
          'name',
          settings_theme.product.button_color,
        ]);
        if (index > -1) {
          background_color = colors.gradients[index].style;
        }
      }
    }

    let text_button = '';

    switch (pageToShow) {
      case 'product_page':
        text_button = settings_theme.product.product_page_button_text;
        break;
      case 'cart_page':
        text_button = settings_theme.product.cart_page_button_text;
        break;
      default:
        text_button = settings_theme.product.thank_you_page_button_text;
        break;
    }

    text_button = minimized ? settings_theme.minimized_view.minimized_button_text : text_button;

    const text_color = settings_theme.product.button_text_color || '#FFFFFF';

    const isUnavailable = isOutOfStock(variant) || variant.isUnavailable;

    if (isUnavailable) {
      text_button = settings_theme.product.out_of_stock_text;
    }

    return (
      <Container
        id="button-send"
        settings_theme={settings_theme}
        background_color={background_color}
        spiner={spiner}
        isUnavailable={isUnavailable}
        text_color={text_color}
        onClick={() => {
          if (isUnavailable) {
            return null;
          }
          if (typeButton === 'addOffer' && active_offer === campaign.offers.length - 1) {
            this.setState({ spiner: true });
            if (!data.offers.length) {
              this.props.setHideGoToCheckout(true);
            }
          }
          if (onClick) {
            onClick();
          }
        }}
      >
        {spiner ? (
          <React.Fragment>
            <Spiner background_color={background_color} settings_theme={settings_theme} className="spinner-box">
              <div className="smt-spinner-circle">
                <div className="smt-spinner" />
              </div>
            </Spiner>
            <RedirectText>{settings_theme.product.redirection_text}</RedirectText>
          </React.Fragment>
           ) : <Text>{text_button}</Text>}

      </Container>
    );
  }
}

export default Button;
