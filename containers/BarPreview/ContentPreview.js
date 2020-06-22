import React, { Component } from 'react';
import { StyleSheetManager } from 'styled-components';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import WidgetComponent from '../../components/WidgetComponent/WidgetComponent';

class ContentPreview extends Component {
  render() {
    const {fontSize, campaign, isPreview, active_offer_force} = this.props;
    return (
      <Frame
        title="widget"
        width="100%"
        height="100%"
        id="widget"
        frameBorder="0"
        border="0"
        cellSpacing="0"
        scrolling="no"
        head={[
          <style key="default_css">{`
            @import url('https://fonts.googleapis.com/css?family=Acme|Bitter|Josefin+Slab|Lato|Montserrat|Noto+Sans|Open+Sans|Pacifico|Raleway|Roboto|Ubuntu&display=swap');
            @import url('https://fonts.googleapis.com/css?family=Archivo|Asap|Barlow|Cabin|Catamaran|Didact+Gothic|Fjalla+One|Fredoka+One|Hammersmith+One|Josefin+Sans|Kalam|Lexend+Zetta|Lora|Manjari|Mansalva|Neuton|Notable|Oswald|Overpass|Ultra|Vidaloka|Vollkorn&display=swap');
            body,.frame-root,.frame-content{
              margin: 0;
              width: 100%;
              height: 100%;
            }
            html {
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              font-size: ${fontSize}px;
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
                padding: 0 0.5rem !important;
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
                opacity: .4 !important;
            }
          `}
          </style>,
        ]}
      >
        <FrameContextConsumer>
          {
            (frameContext) => (
              <StyleSheetManager target={frameContext.document.head}>
                <WidgetComponent {...this.props} active_offer_force={active_offer_force} campaign={campaign} isMobile isPreview />
              </StyleSheetManager>
            )
          }
        </FrameContextConsumer>
      </Frame>
    );
  }
}

export default ContentPreview;
