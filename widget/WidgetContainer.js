import React, { Component } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import styled, { StyleSheetManager } from "styled-components";
import classNames from "classnames";
import WidgetComponent from "../components/WidgetComponent/WidgetComponent";
import Header from "./components/Head";
import Brend from "./components/Brend";

const Bg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999998;
  &.not-minimized {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    &.fadeInColorBlack {
      animation-name: fadeInOpacity;
      animation-timing-function: linear;
      animation-duration: 0.5s;
      &.isMobile {
        border-radius: 8px;
      }
    }
    &.fadeDownColorBlack {
      animation-name: fadeDownColorBlack;
      animation-timing-function: linear;
      animation-duration: 0.5s;
      background-color: rgba(0, 0, 0, 0);
    }
  }
`;

const WrappContent = styled.div`
  position: relative;
  ${({isCartPage, isMobile}) => 
    isCartPage && !isMobile ? `display: flex; align-items: center; justify-content: center; position: absolute; top: 0; height: 100vh; width: 100%;` : ''
  }
  .cb-widget-component {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    position: fixed;
    z-index: 99999999999;
    ${({isCartPage, isMobile}) => isCartPage && !isMobile ? 'max-width: 514px;' : 'width: 414px;'}
    ${({isCartPage, isMobile}) => isCartPage && !isMobile ? 'margin: 0px; width: calc(-160px + 100vw);' : 'margin: 20px;'}
    ${({isCartPage, isMobile}) => isCartPage && !isMobile ? '' : 'right: 0; bottom: 0;'}
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
     ${({isShowBrend}) => isShowBrend ? 'padding-bottom: 26px;' : ''}
    .cb-widget-header {
      height: 26px;
      min-height: 26px;
      background: white;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      svg {
        cursor: pointer;
      }
    }
    .cb-widget-content {
      display: flex;
      height: 100%;
    }
  }
  &.minimized {
    .cb-widget-component {
      height: ${props => props.height}px;
      &.fadeInOpacity {
        opacity: 1;
        animation-name: fadeInOpacity;
        animation-timing-function: linear;
        animation-duration: 0.5s;
      }
      &.countDownTimerAnimate {
        transition: height 0.5s linear;
        -moz-transition: height 0.5s linear;
        -webkit-transition: height 0.5s linear;
        height: ${props => props.height - props.countDownTimerHeigth}px;
      }
    }
  }
  &.not-minimized {
    .cb-widget-component {
      height: ${props => props.widgetHeight};
      ${({isCartPage, maxHeightContent, isMobile}) => isCartPage && !isMobile ? `max-height: ${maxHeightContent > 824 ? 824 : (maxHeightContent || 824)}px;` : ''}
      &.fadeInOpacity {
        opacity: 1;
        animation-name: fadeInOpacity;
        animation-timing-function: linear;
        animation-duration: 0.5s;
      }
      &.fadeDownCB {
        height: ${props => props.height}px;
        animation-name: fadeDownCB;
        animation-timing-function: linear;
        animation-duration: 0.5s;
      }
      &.fadeUpCB {
        height: ${props => props.widgetHeight};
        animation-name: fadeUpCB;
        animation-timing-function: linear;
        animation-duration: 0.5s;
      }
      .cb-widget-content {
        ${({isCartPage}) => isCartPage ? '' : `min-height: ${props => props.widgetHeightContent};`}
      }
    }
  }

  &.isMobile {
    .cb-widget-component {
      margin: 0px;
      width: 100vw;
      border-radius: 5px 5px 0 0;
      box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.12);
    }
  }
`;

class WidgetContainer extends Component {
  constructor(props) {
    super(props);
    const settings_theme =
      (props.settings &&
        props.settings.design &&
        props.settings.design.theme) ||
      {};
    let minimized =
      settings_theme.minimized_view &&
      settings_theme.minimized_view.hasOwnProperty("start_minimized")
        ? settings_theme.minimized_view.start_minimized
        : true;

    if (props.isCartPage) {
      minimized = false;
    }
    const isShowBrend = props.settings.showBranding;
    const deltaHeightBrand = isShowBrend ? '16px' : '0px';
    this.state = {
      height: 0,
      maxHeightContent: 824,
      countDownTimerHeigth: 0,
      countDownTimerAnimate: false,
      widgetHeight: props.isCartPage ? `calc(100vh - 160px - ${deltaHeightBrand})` :  `calc(100vh - 40px - ${deltaHeightBrand})`,
      widgetHeightContent: props.isCartPage ? 'calc(100vh - 160px)' : 'calc(100vh - 66px)',
      minimized: true,
      animations: {
        fadeInOpacity: true,
        fadeUpCB: false,
        fadeDownCB: false,
        fadeInColorBlack: false,
        fadeDownColorBlack: false
      },
    };

    this.resizeTimeout = null;

    this.widgetRef = React.createRef();
    this.frameContext = null;
    this.isMobile = window.innerWidth <= 767;

    if (this.isMobile) {
      this.state.widgetHeight = `${window.innerHeight}px`;
      this.state.widgetHeightContent = isShowBrend ? window.innerHeight - 52 + "px" : window.innerHeight -26 + "px";
    }

    if (!minimized) {
      // setTimeout(() => {
      //   this.setMinimized(false);
      // }, 200);
      document.documentElement.style.overflow = "hidden";
      this.state.minimized = false;

      if (props.isCartPage && !this.isMobile) {
        this.state.animations.fadeUpCB = false;
        this.state.animations.fadeInColorBlack = true;
        this.state.animations.fadeInOpacity = true;
        setTimeout(() => {
          this.state.animations.fadeInOpacity = false;
          this.state.animations.fadeInColorBlack = false;
        }, 500);
      } else {
        this.state.animations.fadeUpCB = true;
        this.state.animations.fadeInColorBlack = true;
        this.state.animations.fadeInOpacity = false;
        setTimeout(() => {
          this.state.animations.fadeUpCB = false;
          this.state.animations.fadeInColorBlack = false;
        }, 500);
      }
    }

    setTimeout(() => {
      this.state.animations.fadeInOpacity = false;
    }, 2000);
  }

  componentDidMount(){
    window.addEventListener('resize', (e) => {
      if (!this.resizeTimeout) {
        this.resizeTimeout = setTimeout(() => {
          this.resizeTimeout = null;
          this.getHeight();
        }, 66);
      }
    }, false);
    console.log('%c 🍯 Honeycomb by Conversion Bear: displayed', 'background: #FBCE10; color: white');
  }

  setMinimized = status => {
    const { animations } = this.state;
    if (status) {
      document.documentElement.style.overflow = "auto";

      const elements = document.getElementsByClassName("content");
      Array.from(elements).forEach(el => {
        el.style.overflow = "auto";
        el.style.maxHeight = "100%";
      });

      this.setState(
        {
          animations: {
            ...animations,
            fadeDownCB: true,
            fadeDownColorBlack: true
          }
        },
        () => {
          this.getHeight(true);
          setTimeout(() => {
            this.getHeight(true);
            this.setState(
              {
                minimized: true,
                animations: {
                  ...animations,
                  fadeDownCB: false,
                  fadeDownColorBlack: false
                }
              },
              () => {
                this.getHeight(true);
              }
            );
          }, 500);
        }
      );
    } else {
      document.documentElement.style.overflow = "hidden";
      const elements = document.getElementsByClassName("content");

      Array.from(elements).forEach(el => {
        el.style.overflow = "hidden";
        el.style.maxHeight = "80vh";
      });
      this.setState(
        {
          minimized: status,
          animations: {
            ...animations,
            fadeUpCB: true,
            fadeInColorBlack: true
          }
        },
        () => {
          this.getHeight(true);
          setTimeout(() => {
            this.state.animations.fadeUpCB = false;
            this.state.animations.fadeInColorBlack = false;
            this.getHeight(true);
          }, 500);
        }
      );
    }
  };

  getHeight = (notRerender = false) => {
    const elmnt = this.frameContext.document.getElementById(
      "minimize-container"
    );
    let heightComponent = 0;
    let maxHeightContent = 0;


    let block_progress_wrap = this.frameContext.document.getElementById('block-progress-wrap');
    let block_product_wrap = this.frameContext.document.getElementById('block-product-wrap');
    let block_actions = this.frameContext.document.getElementById('block-actions');

    if(block_progress_wrap){
      maxHeightContent += block_progress_wrap.clientHeight;
    }
    if(block_product_wrap){
      maxHeightContent += block_product_wrap.clientHeight;
    }
    if(block_actions){
      maxHeightContent += block_actions.clientHeight;
    }
  

    let countDownTimerHeigth = 0;

    const countDownTimer = this.frameContext.document.getElementById(
      "count-down-timer"
    );
    if (countDownTimer) {
      countDownTimerHeigth = countDownTimer.clientHeight;
    }

    heightComponent = 0;
    const progressItems = this.frameContext.document.getElementById(
      "progress-items"
    );
    const topBar = this.frameContext.document.getElementById("top-bar");
    const buttonSend = this.frameContext.document.getElementById("button-send");

    if (progressItems) {
      heightComponent += progressItems.clientHeight;
    }
    if (topBar) {
      heightComponent += topBar.clientHeight;
    }
    if (countDownTimer) {
      heightComponent += countDownTimer.clientHeight + 10;
    }
    if (buttonSend) {
      heightComponent += buttonSend.clientHeight;
    }

    const isShowBrend = this.props.settings.pricingPlan === 'Free';

    if (this.isMobile) {
      this.state.widgetHeight = `${window.innerHeight}px`;
      this.state.widgetHeightContent = isShowBrend ? window.innerHeight - 52 + "px" : window.innerHeight - 26 + "px";
    }

    if (heightComponent !== 0) {
      if (notRerender) {
        this.state.countDownTimerHeigth = countDownTimerHeigth;
        this.state.height = heightComponent;
        this.state.maxHeightContent = maxHeightContent;
      } else {
        
        this.setState({
          height: heightComponent,
          maxHeightContent,
          countDownTimerHeigth
        });
      }
    } else {
      if (countDownTimerHeigth) {
        this.state.countDownTimerHeigth = countDownTimerHeigth;
      }
      setTimeout(() => {
        this.getHeight();
      }, 1000);
    }
  };

  setCountDownTimerAnimate = () => {
    this.setState(
      {
        countDownTimerAnimate: true
      },
      () => {
        setTimeout(() => {
          this.state.countDownTimerAnimate = false;
        }, 500);
      }
    );
  };

  render() {
    const {
      minimized,
      animations: {
        fadeInOpacity,
        fadeUpCB,
        fadeDownCB,
        fadeDownColorBlack,
        fadeInColorBlack
      },
      widgetHeightContent,
      maxHeightContent,
      height,
      countDownTimerAnimate,
      countDownTimerHeigth,
      widgetHeight
    } = this.state;
    const { forseIsMobile, url, isDemo, settings, isCartPage } = this.props;
    const isMobile =
      typeof forseIsMobile !== "undefined" ? forseIsMobile : this.isMobile;

    const isShowBrend = settings.showBranding;

    return (
      <React.Fragment>
        <Bg
          className={classNames({
            minimized,
            isMobile,
            "not-minimized": !minimized,
            fadeInColorBlack,
            fadeDownColorBlack
          })}
          isMobile={isMobile}
          onClick={() => {
            if(!isCartPage){
              this.getHeight();
              this.setMinimized(true);
            }
          }}
        />
        <WrappContent
          height={height}
          isCartPage={isCartPage}
          isMobile={isMobile}
          widgetHeight={widgetHeight}
          maxHeightContent={maxHeightContent}
          widgetHeightContent={widgetHeightContent}
          countDownTimerHeigth={countDownTimerHeigth}
          isShowBrend={isShowBrend}
          className={classNames({
            minimized,
            isMobile,
            "not-minimized": !minimized,
            fadeInColorBlack,
            fadeDownColorBlack
          })}
        >
          <div
            className={classNames("cb-widget-component", {
              fadeInOpacity,
              fadeUpCB,
              fadeDownCB,
              countDownTimerAnimate
            })}
          >
            {!minimized && !isCartPage ? (
              <Header
                isMobile={isMobile}
                isDemo={isDemo}
                setMinimized={status => {
                  this.getHeight();
                  this.setMinimized(status);
                }}
              />
            ) : null}
            <div className="cb-widget-content">
              <Frame
                title="widget"
                id="widget"
                frameBorder="0"
                border="0"
                width="100%"
                height="100%"
                cellSpacing="0"
                scrolling="no"
                style={{ pointerEvents: "all" }}
                contentDidMount={() => {
                  this.getHeight();
                  if (settings.advanced && settings.advanced.custom_js) {
                    const script = document.createElement("script");
                    script.type = "text/javascript";
                    script.innerHTML = settings.advanced.custom_js;
                    if (document.body) {
                      document.body.appendChild(script);
                    }
                  }
                }}
                initialContent={`<!DOCTYPE html><html>
                  <head>
                    <link href="https://fonts.googleapis.com/css?family=Acme|Bitter|Josefin+Slab|Lato|Montserrat|Noto+Sans|Open+Sans|Pacifico|Raleway|Roboto|Ubuntu&display=swap" rel="stylesheet" >
                    <link href="https://fonts.googleapis.com/css?family=Archivo|Asap|Barlow|Cabin|Catamaran|Didact+Gothic|Fjalla+One|Fredoka+One|Hammersmith+One|Josefin+Sans|Kalam|Lexend+Zetta|Lora|Manjari|Mansalva|Neuton|Notable|Oswald|Overpass|Ultra|Vidaloka|Vollkorn&display=swap" rel="stylesheet" >
                  </head>
                  <body>
                    <div class="frame-root"></div>
                  </body>
                </html>`}
                head={[
                  <style key="default_css">
                    {`
                    
                    body,.frame-root,.frame-content{
                      margin: 0;
                      width: 100%;
                      height: 100%;
                    }
                    html {
                      box-sizing: border-box;
                      width: 100%;
                      height: 100%;
                      font-size: 10px;
                    }
                    *, *:before, *:after {
                      box-sizing: inherit;
                    }
                    @-moz-document url-prefix() {
                      select {
                        text-indent: -2px
                      }
                    }
                    .control-arrow {
                      top: calc(50% - 2.9rem) !important;
                      opacity: 1 !important;
                      width: 29px;
                      height: 40px;
                      background: rgba(0, 0, 0, 0.2) !important;
                    }

                    .control-arrow:before{
                      border-top: none !important;
                      border-bottom: none !important;
                    }
    
                    .control-arrow:before, .control-arrow:after {
                        border-right: 2px solid !important;
                        content: '' !important;
                        display: block !important;
                        height: 8px !important;
                        margin-top: -6px !important;
                        position: absolute !important;
                        -moz-transform: rotate(45deg) !important;
                        -o-transform: rotate(45deg) !important;
                        -webkit-transform: rotate(45deg) !important;
                        transform: rotate(45deg) !important;
                        right: 10px !important;
                        top: 50% !important;  
                        width: 0 !important;
                    }
                    
                    .control-prev:after {
                        margin-top: -1px !important;
                        -moz-transform: rotate(135deg) !important;
                        -o-transform: rotate(135deg) !important;
                        -webkit-transform: rotate(135deg) !important;
                        transform: rotate(135deg) !important;
                        right: 52% !important;
    
                    }
    
                    .carousel .control-next.control-arrow::before {
                        border-left: none !important;
                        -moz-transform: rotate(135deg) !important;
                        -o-transform: rotate(135deg) !important;
                        -webkit-transform: rotate(135deg) !important;
                        transform: rotate(135deg) !important;
                    }
    
                    .control-next:after{
                        margin-top: -1px !important;
                        -moz-transform: rotate(45deg) !important;
                        -o-transform: rotate(45deg) !important;
                        -webkit-transform: rotate(45deg) !important;
                        transform: rotate(45deg) !important;
                        right: 52% !important;
                    }
                    .slide {
                        padding: 0 5px !important;
                        background: none !important;
                    }

                    .slider div{
                      margin: 0 !important;
                    }

                    .slide:first-child {
                      padding-left: 1rem !important;
                    }

                    .slide:last-child {
                      padding-right: 1rem !important;
                    }
    
                    .control-arrow:hover {
                      opacity: 1 !important;
                    }

                    @keyframes fadeDownColor {
                      0% {
                        opacity: 1;
                      }
                      100% {
                        opacity: 0;
                      }
                    }
                  `}
                    {settings.advanced && settings.advanced.custom_css
                      ? settings.advanced.custom_css
                      : ""}
                  </style>,               
                ]}
              >
                <FrameContextConsumer>
                  {frameContext => {
                    this.frameContext = frameContext;
                    return (
                      <StyleSheetManager target={frameContext.document.head}>
                        <WidgetComponent
                          {...this.props}
                          minimized={minimized}
                          setMinimized={this.setMinimized}
                          isMobile={isMobile}
                          getHeight={this.getHeight}
                          setCountDownTimerAnimate={
                            this.setCountDownTimerAnimate
                          }
                          containerHeight={height}
                          appEvent={this.props.appEvent}
                        />
                      </StyleSheetManager>
                    );
                  }}
                </FrameContextConsumer>
              </Frame>
              {isShowBrend && <Brend isMobile={isMobile} isCartPage={isCartPage} maxHeightContent={maxHeightContent}/>}
            </div>
          </div>
        </WrappContent>
      </React.Fragment>
    );
  }
}

export default WidgetContainer;
