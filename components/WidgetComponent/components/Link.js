import React, { Component } from 'react';
import styled from 'styled-components';

const RedirectText = styled.div`
  margin-left: 1rem;
  text-decoration-line: none;
`

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spiner: false,
    };
  }

  render() {
    const { settings_theme, data, pageToShow, goToCheckout, campaign, hideGoToCheckout } = this.props;
    const { spiner } = this.state;
    if (!data.offers.length && pageToShow == 'thankyou_page') {
      return null;
    }

    if (campaign.offers.length === 1 && pageToShow == 'thankyou_page') {
      return null;
    }

    if (hideGoToCheckout) {
      return null;
    }

    const Container = styled.div`
      width: 100%;
      font-size: 1.6rem;
      line-height: 1.9rem;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      text-decoration-line: underline;
      cursor: pointer;
      background-color: ${settings_theme.product.go_to_checkout_bg_color || '#FFFFFF'};
      color: ${settings_theme.product.go_to_checkout_text_color || '#212B36'};
      font-family: ${settings_theme.product.font};
      padding: ${(props) => props.spiner ? '0.45rem' : '1rem'};
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
        border-left: 2px solid ${settings_theme.product.go_to_checkout_text_color || '#212B36'};
        border-bottom: 2px solid ${settings_theme.product.go_to_checkout_text_color || '#212B36'};
        animation: spin .8s linear 0s infinite;
      }
    `;

    let text_link = '';

    switch (pageToShow) {
      case 'product_page':
        text_link = settings_theme.product.product_page_text;
        break;
      case 'cart_page':
        text_link = settings_theme.product.cart_page_text;
        break;
      default:
        text_link = settings_theme.product.thank_you_page_text;
        break;
    }

    return (
      <Container
        spiner={spiner}
        onClick={() => {
          if (goToCheckout) {
            goToCheckout();
          }
          this.setState({ spiner: true });
        }}
      >
        {spiner ? (
          <React.Fragment>
            <Spiner className="spinner-box">
              <div className="smt-spinner-circle">
                <div className="smt-spinner" />
              </div>
            </Spiner>
            <RedirectText>{settings_theme.product.redirection_text}</RedirectText>
          </React.Fragment>
          ) : `${text_link} ${pageToShow == 'thankyou_page' ? `(${data.offers.length})` : ''}`}
      </Container>
    );
  }
}

export default Link;
