import React, { Component } from 'react';
import classNames from 'classnames';
import './ErrorBlock.scss';
import { connect } from 'react-redux';
import {
  getFormValues,
  getFormInitialValues,
  getFormSyncErrors,
  getFormMeta,
  getFormAsyncErrors,
  getFormSyncWarnings,
  getFormSubmitErrors,
  getFormError,
  getFormNames,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed
} from 'redux-form';
import { I18n } from 'react-redux-i18n';

class ErrorBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: 'fadeInUp',
      show: false,
    };
  }

  componentDidMount() {
    // this.show();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invalid && (nextProps.isSubmit || nextProps.isPreview) && !this.state.show) {
      this.show();
    }
  }

  show = () => {
    this.setState({ show: true, className: 'fadeInUp' }, () => {
      setTimeout(() => {
        this.setState({ className: 'fadeOutDown' }, () => {
          setTimeout(() => {
            this.setState({ className: '', show: false });
          }, 1200);
        });
      }, 5000);
    });
  };

  render() {
    const { className, show } = this.state;

    if (!show) {
      return null;
    }

    return (
      <div className={classNames('ErrorBlock animated', className)}>
        <div><img src={require('../../static/images/error_icon.svg')} alt="" /></div>
        <div style={{ paddingBottom: '2px' }}>{I18n.t('Some mandatory campaign details are missing Fill in the missing fields to save')}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // formSyncErrors: getFormSyncErrors('campaign')(state),
  invalid: isInvalid('campaign')(state),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBlock);
