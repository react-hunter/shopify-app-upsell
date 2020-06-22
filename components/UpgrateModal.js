import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Modal, Button } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import { setSettings } from '../redux/actions';

class UpgrateModal extends Component {
  handleChange = () => {
    this.props.setSettings({ displayUpgradeModal: false });
  }

  render() {
    const {displayUpgradeModal} = this.props;
    return (
      <Modal
          open={displayUpgradeModal}
          onClose={this.handleChange}
          size="Small"
        >
          <Modal.Section>
            <div className="upgrate-modal-content">
              <img src="./static/images/congrats.svg" />
              <div className="title">
                {I18n.t('Cheers for more upsells!')}
              </div>
              <div className="text">
                Congrats on upgrading your plan and joining more thousands of merchants who sell more with Honeycomb
              </div>
              <div className="upgrate-modal-actions">
                <Button primary onClick={this.handleChange}>Done</Button>
              </div>
            </div>
          </Modal.Section>
        </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  displayUpgradeModal:
  state.settings.data && state.settings.data.displayUpgradeModal
    ? state.settings.data.displayUpgradeModal
    : false
})

const mapDispatchToProps = {
  setSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(UpgrateModal)
