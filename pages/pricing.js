/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Button, Icon, Link, Modal, Banner, Card } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import Router from 'next/router';
import { Context } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import classNames from 'classnames';
import {
  MobileChevronMajorMonotone,
  CircleInformationMajorMonotone,
} from '@shopify/polaris-icons';
import { connect } from 'react-redux';
import config from '../redux/config';
import { changePlan } from '../redux/actions';
import Cookies from "js-cookie";
// import FreshChat from "react-freshchat";
// import NoSSR from "react-no-ssr";

const CheckCell = (props) => (
  <td className={classNames({ 'bg-color-td': Boolean(props.highlighted) })}>
    {props.checked ? <img src="./static/images/Accept.svg" alt="" /> : <img src="./static/images/Cancel_Small.svg" alt="" />}
  </td>
);

class Pricing extends Component {

  redirect = null;
  static contextType = Context;
  state = {
    active: false,
    planName: '',
    isFree: false,
  };

  componentDidMount() {
    this.redirect = Redirect.create(this.context);
    if (typeof document != 'undefined') {
      const el = document.getElementById('page-pricing');
      const elBg = document.getElementById('container-bg');
      el.style.minHeight = document.documentElement.clientHeight + 'px';
      if (elBg.clientHeight > document.documentElement.clientHeight) {
        el.style.minHeight = elBg.clientHeight;
      }
    }
    if (process.browser) {
      amplitude.logEvent("page_load", { value: "pricing" });
      // TODO: make a get request to log event endpoint in bigbear
      fetch(`https://bigbear.conversionbear.com/report_event`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopify_domain: Cookies.get("shopOrigin"),
          event_name: 'show-pricing_page',
          event_value:{
            ...this.state
          }
        }),
      });
    }
  }

  handleChange = () => {
    this.setState({
      active: false,
    });
  };

  componentWillUnmount() {
    localStorage.removeItem('visitedFromAdvanced');
  }

  render() {
    const { active, planName, isFree } = this.state;
    const { pricingPlan, shop } = this.props;
    const { shopStatus, unlimitedViews, customViewsLimit, customPrice, hasPartnerCode, trialDaysRemain } = (shop || {}) || '';

    let pricing = config.pricing;
    if (!hasPartnerCode) {
      if (!pricingPlan && ['veteran', 'early'].includes(shopStatus)) {
        pricing = [
          pricing[0],
        ];
        if (shopStatus === 'veteran') {
          pricing.push(config.veteranPlan);
        }
        if (shopStatus === 'early') {
          pricing.push(config.earlyPlan);
        }
      }
    }

    const currentPricing = pricing.find((item) => item.name === pricingPlan);

    const title_info = I18n.t('You will not be charged before your trial ends No strings attached - cancel anytime');

    return (
      <div className="Pricing" id="page-pricing">
        <Modal
          open={active}
          onClose={this.handleChange}
          size="Small"
        >
          <Modal.Section>
            <div className="pricing-modal-content">
              <p style={{ textAlign: 'center', marginTop: '7px' }}>
                {isFree ? I18n.t('Are you sure you want to cancel your paid plan?') : I18n.t('Are you sure you want to downgrade your plan?') } 
              </p>
              <div className="pricing-modal-actions">
                <Button onClick={this.handleChange}>Keep Plan</Button>
                <Button destructive onClick={() => {
                   this.props.changePlan(planName, this.redirect);
                }}>{isFree ? I18n.t('Cancel Plan') : I18n.t('Downgrade Plan')}</Button>
              </div>
            </div>
          </Modal.Section>
        </Modal>
        {pricingPlan && <div className="back" onClick={() => { Router.back(); }}>
          <Icon source={MobileChevronMajorMonotone} />
          {I18n.t('Back to app')}
        </div>}
        {!pricingPlan && ['veteran', 'early'].includes(shopStatus) && (<div className="banner-wrapper">
          <Banner
            title={I18n.t('Choose a plan to continue using Honeycomb in your store')}
            status="info"
          >
            <p>
              As an expression of our appreciation and gratitude, you are eligible to claim a one time exclusive partner plan.
            </p>
          </Banner>
        </div>)}
        <div className="container-bg" id="container-bg">
          <table cellSpacing="0">
            <thead>
              <tr>
                <th>&nbsp;</th>
                {pricing.map((item) => <th key={item.name} className={classNames({ 'bg-color-td': Boolean(item.compareAtPrice), 'col-25-perc': pricing.length === 2 })}>{I18n.t(item.name)}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly price</td>
                {pricing.map((item) => (
                  <td key={item.name} className={classNames({ 'bg-color-td': Boolean(item.compareAtPrice), 'compate-price': Boolean(item.compareAtPrice) })}>
                    {Boolean(item.compareAtPrice) &&
                      <React.Fragment>
                        <div className="tooltip-price"><div>LIMITED TIME OFFER</div></div>
                        <span className="at-price">${item.compareAtPrice}/month</span>
                      </React.Fragment>
                    }
                    <span className="price">${item.price}/month</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td>3 Upsell offers per funnel</td>
                {pricing.map((item) => <CheckCell key={item.name} checked={item.item[0]} highlighted={item.compareAtPrice} />)}
              </tr>
              <tr>
                <td>Cart page upsell funnels</td>
                {pricing.map((item) => <CheckCell key={item.name} checked={item.item[2]} highlighted={item.compareAtPrice} />)}
              </tr>
              <tr>
                <td>Post purchase upsell funnels</td>
                {pricing.map((item) => <CheckCell key={item.name} checked={item.item[3]} highlighted={item.compareAtPrice} />)}
              </tr>
              <tr>
                <td>Remove branding</td>
                {pricing.map((item) => <CheckCell key={item.name} checked={item.item[4]} highlighted={item.compareAtPrice} />)}
              </tr>
              <tr>
                <td>Monthly funnel views</td>
                {pricing.map((item) => (
                  <td key={item.name} className={classNames({ 'bg-color-td': Boolean(item.compareAtPrice) })}>
                    {item.limit}
                  </td>
                ))}
              </tr>
              <tr>
                <th>&nbsp;</th>
                {pricing.map((item) => (
                  <th key={item.name} className={classNames({ 'bg-color-td': Boolean(item.compareAtPrice) })}>
                    {this.props.pricingPlan === item.name ? <span className="chosen-plan">Your Plan</span> : (
                      <Button
                        primary={item.compareAtPrice}
                        onClick={() => {
                          if (currentPricing) {
                            if (item.name === 'Free' && pricingPlan !== 'Free') {
                              this.setState({ active: true, isFree: true, planName: item.name });
                              return;
                            } else if (pricingPlan !== 'Free' && item.price < currentPricing.price) {
                              this.setState({ active: true, planName: item.name, isFree: false });
                              return;
                            }
                          }
                          this.props.changePlan(item.name, this.redirect);
                        }}
                      >
                        {(item.name === 'Free')
                          ? I18n.t('Choose')
                          : (!pricingPlan && !hasPartnerCode && ['veteran', 'early'].includes(shopStatus)
                            ? I18n.t('Claim One Time Offer')
                            : (trialDaysRemain === 0 ? I18n.t('Choose') : I18n.t('Start {days} day trial').replace('{days}', trialDaysRemain))
                          )
                        }
                      </Button>
                    )}
                  </th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {pricingPlan && !currentPricing && <div className="custom-plan-wrapper">
          <Card sectioned>
            <p className="header">Your Plan</p>
            <p className="name">{pricingPlan}</p>
            <p className="views">{unlimitedViews ? I18n.t('Unlimited views') : (customViewsLimit + I18n.t(' Monthly funnel views'))}</p>
            <p className="price">${customPrice}/month</p>
          </Card>
        </div>}
        {pricingPlan && <Link url="https://www.conversionbear.com/solutions/enterprise-plan" external>{I18n.t('Need a bigger plan? see our Enterprise Plan')}</Link>}
        {!pricingPlan && <>
          {shopStatus === 'veteran' && <Link url="https://www.conversionbear.com/solutions/honeycomb-veteran-partners" external>{I18n.t('Get more details about our pricing plans here')}</Link>}
          {shopStatus === 'early' && <Link url="https://www.conversionbear.com/solutions/honeycomb-new-partners" external>{I18n.t('Get more details about our pricing plans here')}</Link>}
          {!['veteran', 'early'].includes(shopStatus) && <div className="title-info"><Icon source={CircleInformationMajorMonotone} />{title_info}</div>}
        </>}
        {/* <NoSSR>
          {this.props.shop &&
            this.props.shop.shopInformation &&
            this.props.shop.shopInformation.plan_name !== "trial" ? (
              <FreshChat
                token="d8dad34b-6ddb-43b8-922e-65d42473698a"
                siteId="Honeycomb Upsell"
                config={{
                  cssNames: {
                    widget: "customFreshChatCss",
                    modal: "customModalCss",
                  },
                }}
                onInit={(widget) => {
                  widget.on("widget:opened", function (resp) {
                    amplitude.logEvent("chat_box_opened");
                  });
                  window.fcWidget.on("message:sent", function (resp) {
                    amplitude.logEvent("chat_message_sent");
                  });
                  window.fcWidget.on("message:recieved", function (resp) {
                    amplitude.logEvent("chat_message_recieved");
                  });
                  const shopInformation = this.props.shop.shopInformation;
                  if (shopInformation) {
                    widget.user.setProperties({
                      email: shopInformation.email || null,
                      firstName: shopInformation.shop_owner || null,
                      shop_name: shopInformation.name || null,
                      store_url: shopInformation.domain || null,
                      store_created_at: shopInformation.created_at || null,
                      shopify_plan: shopInformation.plan_name || null,
                      shopStatus: this.props.shop.shopStatus || null,
                    });
                  }
                }}
              />
            ) : null}
        </NoSSR> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pricingPlan: state.settings.data.pricingPlan,
  shop: state.shop,
});

const mapDispatchToProps = {
  changePlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);
