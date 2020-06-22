import React, { Component } from 'react';
import { Link, Modal } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';

class StepByStepGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  render() {
    const { show } = this.state;
    return (
      <React.Fragment>
        <Link
          url='https://youtu.be/rqum4gl2E-k'
          external
          onClick={() => {
            amplitude.logEvent("click-view_step_by_step_video",{value: 'https://youtu.be/rqum4gl2E-k'});
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={require('../../static/images/playButton.svg')} alt="" />
            <span style={{ marginLeft: '0.9rem' }}>{I18n.t('Step by Step Guide')}</span>
          </div>
        </Link>
        <Modal
          open={show}
          onClose={() => { this.setState({ show: false }); }}
        >
          <Modal.Section>
            <div className="modal-content-video">
              <iframe id="ytplayer" type="text/html" width="100%" height="360" src="https://www.youtube.com/embed/vFUqFopdzuY?autoplay=1" frameborder="0" />
            </div>
          </Modal.Section>
        </Modal>
      </React.Fragment>
    );
  }
}

export default StepByStepGuide;
