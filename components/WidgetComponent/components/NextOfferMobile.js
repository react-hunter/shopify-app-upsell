import React, { Component } from 'react';
import styled from 'styled-components';

const ContainerRight = styled.div`
  position: absolute;
  height: 100%;
  width: 30%;
  right: 0;
`;

const ContainerLeft = styled.div`
  position: absolute;
  height: 100%;
  width: 30%;
  left: 0;
`;

class NextOfferMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { nextOffer, campaign, active_offer, prevOffer, isMobile } = this.props;


    if (!isMobile) {
      return null;
    }

    return (
      <React.Fragment>
        {active_offer !== 0 ? <ContainerLeft
          onClick={() => {
            if (prevOffer) {
              prevOffer();
            }
          }}
        /> : null}
        {campaign.offers.length !== active_offer + 1 ? <ContainerRight
          onClick={() => {
            if (nextOffer) {
              nextOffer();
            }
          }}
        /> : null}
      </React.Fragment>
    );
  }
}

export default NextOfferMobile;
