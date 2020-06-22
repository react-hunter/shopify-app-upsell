import React, { Component } from 'react';

import styled from 'styled-components';
import findIndex from 'lodash.findindex';
import config from '../../../redux/config';
import TopNavigation from './TopNavigation';
import TopBar from './TopBar';
import CountdownTimer from './CountdownTimer';
import Product from './Product';
import Button from './Button';
import Link from './Link';
import ProgressItems from './ProgressItems';
import ProgressItemsNav from './ProgressItemsNav';

const { colors } = config;

const Container = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  /* background-color: red; */
  height: 100%;
  flex-direction: column;
  background: ${(props) => props.background_color};
`;

const Scroll = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: auto; 
  flex: auto;
  overflow: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { 
    display: none;
  }
`;

const ContainerMinimized = styled.div`
  display: flex;
  flex: 1;
  position: absolute;
  bottom: 0;
  width: 100%;
  /* background-color: red; */
  /* height: 100%; */
  flex-direction: column;
  justify-content: flex-end;
  background: ${(props) => props.background_color};
`;


const AnimateOffer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 9;
  &.fade-in-out {
    opacity: 0;
    animation-name: fadeInOpacity;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
  }

  @keyframes fadeInOpacity {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  &.fade-down {
    opacity: 1;
    animation-name: fadeDownOpacity;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
  }

  @keyframes fadeDownOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

class Mobile extends Component {

  constructor(props) {
    super(props);
    this.elementRef = React.createRef();
    this.scrollPosition = 0;
    this.state = {
      showAnimation: false,
      fadeInOpacity: false,
      fadeDownOpacity: false,
    };
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.active_offer !== this.props.active_offer) {
      this.setState({ showAnimation: true }, () => {
        setTimeout(() => {
          // this.state.showAnimation = false;
          this.setState({ showAnimation: false });
        }, 600);
      });
      this.scrollPosition = 0;
    } else if (this.elementRef.current) {
      this.scrollPosition = this.elementRef.current.scrollTop;
    }
  }

  componentDidUpdate() {
    if (this.elementRef.current) {
      this.elementRef.current.scrollTop = this.scrollPosition;
    }
  }

  render() {
    const { settings_theme, campaign, pageToShow, data, goToCheckout, addOffer, minimized, setMinimized, variant } = this.props;
    const { showAnimation } = this.state;
    let background_color = '#FFFFFF';
    if (settings_theme.upsell_page.background_color) {
      background_color = settings_theme.upsell_page.background_color;
      if (settings_theme.upsell_page.background_color.indexOf('gradient_') > -1) {
        const index = findIndex(colors.gradients, [
          'name',
          settings_theme.upsell_page.background_color,
        ]);
        if (index > -1) {
          background_color = colors.gradients[index].style;
        }
      }
    }

    if (minimized) {
      return (
        <ContainerMinimized id="minimize-container" background_color={background_color}>
          <div style={{ position: 'relative' }}>
            <ProgressItemsNav {...this.props} />
            <ProgressItems {...this.props} />
          </div>
          <TopBar {...this.props} />
          <CountdownTimer {...this.props} />
          <Button
            pageToShow={pageToShow}
            settings_theme={settings_theme}
            minimized={minimized}
            variant={variant}
            onClick={() => {
              setMinimized(false);
            }}
          />
        </ContainerMinimized>);
    }

    return (
      <Container background_color={background_color}>
        <div style={{ display: 'block' }} id="block-progress-wrap">
          <TopNavigation {...this.props} />
          <div style={{ position: 'relative' }}>
            <ProgressItemsNav {...this.props} />
            <ProgressItems {...this.props} />
          </div>
        </div>
        <Scroll ref={this.elementRef}>
          <div style={{ display: 'block' }} id="block-product-wrap">
            {showAnimation ? <AnimateOffer className="fade-in-out" /> : null}
            <TopBar {...this.props} />
            <CountdownTimer {...this.props} />
            <Product {...this.props} elementScroll={this.elementRef}/>
          </div>
        </Scroll>
        <div style={{ display: 'block' }} id="block-actions">
          <Button
            {...this.props}
            settings_theme={settings_theme}
            typeButton="addOffer"
            variant={variant}
            onClick={() => {
              addOffer();
            }}
          />
          <Link {...this.props} settings_theme={settings_theme} campaign={campaign} data={data} goToCheckout={goToCheckout} />
        </div>
      </Container>
    );
  }
}

export default Mobile;

