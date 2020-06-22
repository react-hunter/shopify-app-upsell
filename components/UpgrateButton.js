import React, { Component } from 'react';
import './UpgrateButton.scss';
import { Button } from '@shopify/polaris';
import Router from 'next/router';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import config from '../redux/config';
import { getViews } from '../redux/actions';


class UpgrateButton extends Component {
  state = { views: 0 };

  async componentDidMount() {
    const views = await getViews({ date_start: this.props.periodStartedAt });
    this.setState({ views });
  }

  render() {
    const { pricingPlan } = this.props;
    const { views } = this.state;
    const pricing = config.pricing.find((item) => item.name === pricingPlan) || {};

    const limit = this.props.customViewsLimit || pricing.limit;
    const width = (views * (100 / limit));

    return (
      <div className={classNames('UpgrateButton', { 'bg-btn': pricingPlan === 'Free' })}>
        <div className="counter">
          <div className="container-progress">
            <div
              className={classNames('progress', { 'bg-red': width >= 100 })}
              style={{ width: width > 100 ? '100%' : `${width}%` }}
            />
          </div>
          <div className="text">
            <span style={{ color: width >= 100 ? '#DE3618' : '#637381', fontWeight: width >= 100 ? 600 : 'normal' }}>
              {views} / {limit} {I18n.t('Views')}
            </span>
            {width >= 100 && <span>{I18n.t(' upgrade to continue using Honeycomb')}</span>}
          </div>
        </div>
        {(width > 75 || pricingPlan === 'Free') &&
          <Button outline={pricingPlan !== 'Free'} onClick={() => { Router.push('/pricing'); }}>
            {I18n.t('Upgrade')}
          </Button>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pricingPlan: state.settings.data.pricingPlan || 'Free',
  overLimit: state.settings.data.overLimit || false,
  customViewsLimit: state.shop && state.shop.customViewsLimit || null,
  periodStartedAt: state.settings.data.periodStartedAt || moment().add('days', -1).format('YYYY-MM-DD'),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(UpgrateButton);
