import React, { Component } from 'react';
import { StyleSheetManager } from 'styled-components';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import WidgetComponent from '../../components/WidgetComponent/WidgetComponent';
import campaignData from '../../static/campaign.json';
import ContentPreview from './ContentPreview';

class Mobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaign: campaignData,
      fontSize: 8.8,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { campaign } = this.state;
    campaign.offers[0].free_shipping = nextProps.free_shipping;
    this.setState({ campaign });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    const element = document.getElementById('mobile-preview');
    if (element) {
      const clientHeight = element.clientHeight;
      const width = (343 * clientHeight) / 717.94;

      this.setState({
        fontSize: width * 10 / 360,
      });

      if (width >= 193) {
        element.style.width = width + 'px';
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  render() {
    const { campaign, fontSize } = this.state;
    const {settings} = this.props;
    return (
      <div id="mobile-preview" className="Mobile">
        <div className="Mobile-content-mobile-block">
          <div className="Mobile-content-mobile-header">
            <div className="mic" />
            <div className="cam" />
          </div>
          <div className="Mobile-content-mobile-body">
            <ContentPreview 
              {...this.props}
              fontSize={fontSize}
              campaign={campaign}
              isPreview
            />
          </div>
          <div className="Mobile-content-mobile-footer">
            <div className="mic" />
          </div>
        </div>
      </div>
    );
  }
}

export default Mobile;
