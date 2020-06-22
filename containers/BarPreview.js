import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import {Icon} from '@shopify/polaris';
import {
  ExternalMinor,
} from '@shopify/polaris-icons';
import './BarPreview.scss';
import Mobile from './BarPreview/Mobile';

class BarPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BarPreview">
        <div className="link">
          <p>{I18n.t('Preview full screen')}</p>
          <a href="/default/preview" target="blank" 
          onClick={()=>{
            amplitude.logEvent('click-design_preview_full_screen');
          }}>
            <Icon source={ExternalMinor} />
          </a>
        </div>
        <Mobile {...this.props} />
      </div>
    );
  }
}

export default BarPreview;
