import React, { Component } from 'react';
import { Link } from '@shopify/polaris';
import './Baner.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { setSettings } from '../../redux/actions';

class Baner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bar_notice_hidden_animate: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bar_notice_dashboard_hidden && !this.props.bar_notice_dashboard_hidden) {
      this.setState({
        bar_notice_hidden_animate: true,
      }, () => {
        setTimeout(() => {
          this.setState({ bar_notice_hidden_animate: false });
        }, 500);
      });
    }
  }

  render() {
    const { bar_notice_dashboard_hidden } = this.props;

    return !bar_notice_dashboard_hidden || this.state.bar_notice_hidden_animate ? (
      <div className={classNames('Baner animated delay-500s', { fadeOut: this.state.bar_notice_hidden_animate })}>
        <img src={require('../../static/images/Baner_logo.svg')} alt="" />
        <div className="body">
          <h1 className="Polaris-Heading">{I18n.t('Here you’ll see how your campaigns perform')}</h1>
          <p>{I18n.t('A wize bear once said: “If you measure it, it will grow!” Here you can track how your upsell campaigns are performing')}</p>
          <Link
            onClick={() => {
              this.props.setSettings({ bar_notice_dashboard_hidden: true });
              amplitude.logEvent('click-dashboard_banner_got_it')
            }}
          >
            {I18n.t('Got It')}
          </Link>
        </div>
      </div>) : null;
  }
}

const mapStateToProps = (state) => ({
  bar_notice_dashboard_hidden: state.settings.data.bar_notice_dashboard_hidden,
});

const mapDispatchToProps = {
  setSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(Baner)

