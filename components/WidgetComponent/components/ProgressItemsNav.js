import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 100%;
  z-index:2;
`;

const Item = styled.div`
  padding: 1rem;
  /* background: red; */
  width: 100%;
`;

class ProgressItemsNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { campaign, goToOffer, isMobile } = this.props;

    if (!isMobile) {
      return null;
    }

    return (
      <Container>
        {campaign.offers.map((item, index) => (
          <Item
            key={`nav-click-offer-${index}`}
            onClick={() => {
              console.log('click', index)
              goToOffer(index);
            }}
          />
        ))}
      </Container>
    );
  }
}

export default ProgressItemsNav;
