import React, { Component } from 'react';
import { Layout, Card, Button, Link } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import className from 'classnames';
import { connect } from 'react-redux';
import { setSettings } from '../redux/actions';
import TextInput from '../components/TextInput';
import moment from 'moment';
import Router from "next/router";
import SpecialOfferBanner from "../components/SpecialOfferBanner";

class Advanced extends Component {

  constructor(props) {
    super(props);
    this.state = {
      advanced: this.props.advanced || {},
      errors: {},
    };
    this.defaultScrolY = window.scrollY;
  }

  componentDidMount() {
    if (process.browser) {
      window.scrollTo(0, this.defaultScrolY);
      amplitude.logEvent("page_load", { value: "advanced" });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      advanced: { ...nextProps.advanced, ...this.state.advanced },
    });
  }

  render() {
    const { advanced } = this.state;
    const advanced_init = this.props.advanced;
    const {pricingPlan, periodRenewAt} = this.props;
    return (
      <div className="tab-advanced">
        <Layout>
          <Layout.Section secondary>
            <div className="block-info">
              <div className="header-title">{I18n.t('Pixels & Tracking')}</div>
              <div className="message">{I18n.t('Connect Facebook, Pinteres, Snapchat and Google pixels to your upsell')}</div>
            </div>
            <Card sectioned>
              <div className="header-title">{I18n.t('Facebook Pixel ID')}</div>
              <div className={className('input-group', { 'is-error': this.state.errors.facebook_pixel_id })}>
                <TextInput
                  label={I18n.t('Tracking Add to Cart event on Facebook Ads')}
                  className="advanced-input"
                  placeholder="000000000000001"
                  input={{
                    value: advanced.facebook_pixel_id,
                    onChange: (value) => {
                      this.setState({
                        advanced: {
                          ...this.state.advanced,
                          facebook_pixel_id: value,
                        },
                        errors: {
                          ...this.state.errors,
                          facebook_pixel_id: '',
                        },
                      });
                    },
                  }}
                  meta={{
                    error: this.state.errors.facebook_pixel_id,
                    touched: true,
                  }}
                  eventName="click-advanced_fb"
                />
                <Button
                  primary
                  disabled={advanced_init.facebook_pixel_id == advanced.facebook_pixel_id}
                  onClick={() => {
                    if (!advanced.facebook_pixel_id.match(/^\d{15,16}$|^$/)) {
                      this.setState({
                        errors: {
                          ...this.state.errors,
                          facebook_pixel_id: I18n.t('Please follow this format 000000000000001'),
                        },
                      });
                      amplitude.logEvent('click-advanced_fb_error',{value: advanced.facebook_pixel_id});
                      return;
                    }

                    this.props.setSettings({
                      advanced: {
                        ...advanced_init,
                        facebook_pixel_id: advanced.facebook_pixel_id,
                      },
                    });
                    amplitude.logEvent('click-advanced_fb_save',{value: advanced.facebook_pixel_id});
                  }}
                >
                  {I18n.t('Save')}
                </Button>
              </div>
              <div className="header-title mt-20">{I18n.t('Pinterest Tag ID')}</div>
              <div className={className('input-group', { 'is-error': this.state.errors.pinterest_tag_id })}>
                <TextInput
                  label={I18n.t('Tracking Add to Cart event on Pinterest Ads')}
                  className="advanced-input"
                  placeholder="0000000000001"
                  input={{
                    value: advanced.pinterest_tag_id,
                    onChange: (value) => {
                      this.setState({
                        advanced: {
                          ...this.state.advanced,
                          pinterest_tag_id: value,
                        },
                        errors: {
                          ...this.state.errors,
                          pinterest_tag_id: '',
                        },
                      });
                    },
                  }}
                  meta={{
                    touched: true,
                    error: this.state.errors.pinterest_tag_id,
                  }}
                  eventName='click-advanced_pinterest'
                />
                <Button
                  primary
                  disabled={advanced_init.pinterest_tag_id == advanced.pinterest_tag_id}
                  onClick={() => {
                    if (!advanced.pinterest_tag_id.match(/^\d{13}$|^$/)) {
                      this.setState({
                        errors: {
                          ...this.state.errors,
                          pinterest_tag_id: 'Please follow this format 0000000000001',
                        },
                      });
                      amplitude.logEvent('click-advanced_pinterest_error',{value: advanced.pinterest_tag_id});
                      return;
                    }
                    this.props.setSettings({
                      advanced: {
                        ...advanced_init,
                        pinterest_tag_id: advanced.pinterest_tag_id,
                      },
                    });
                    amplitude.logEvent('click-advanced_pintetest_save',{value: advanced.pinterest_tag_id});
                  }}
                >
                  {I18n.t('Save')}
                </Button>
              </div>
              <div className="header-title mt-20">{I18n.t('Snapchat Pixel ID')}</div>
              <div className={className('input-group', { 'is-error': this.state.errors.snapchat_pixel_id })}>
                <TextInput
                  label={I18n.t('Tracking Add to Cart event on Snapchat')}
                  className="advanced-input"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  input={{
                    value: advanced.snapchat_pixel_id,
                    onChange: (value) => {
                      this.setState({
                        advanced: {
                          ...this.state.advanced,
                          snapchat_pixel_id: value,
                        },
                        errors: {
                          ...this.state.errors,
                          snapchat_pixel_id: '',
                        },
                      });
                    },
                  }}
                  meta={{
                    touched: true,
                    error: this.state.errors.snapchat_pixel_id,
                  }}
                  eventName='click-advanced_snapchat'
                />
                <Button
                  primary
                  disabled={advanced_init.snapchat_pixel_id == advanced.snapchat_pixel_id}
                  onClick={() => {
                    if (!advanced.snapchat_pixel_id.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$|^$/)) {
                      this.setState({
                        errors: {
                          ...this.state.errors,
                          snapchat_pixel_id: 'Please follow this format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                        },
                      });
                      amplitude.logEvent('click-advanced_snapchat_error',{value: advanced.snapchat_pixel_id});
                      return;
                    }
                    this.props.setSettings({
                      advanced: {
                        ...advanced_init,
                        snapchat_pixel_id: advanced.snapchat_pixel_id,
                      },
                    });
                    amplitude.logEvent('click-advanced_snapchat_save',{value: advanced.snapchat_pixel_id});
                  }}
                >
                  {I18n.t('Save')}
                </Button>
              </div>
              <div className="header-title mt-20">{I18n.t('Google Analytics ID')}</div>
              <div className={className('input-group', { 'is-error': this.state.errors.google_analytics_id })}>
                <TextInput
                  label={I18n.t('Tracking Add to Cart event on Google Analytics')}
                  className="advanced-input"
                  placeholder="UA-XXXXXX-Y"
                  input={{
                    value: advanced.google_analytics_id,
                    onChange: (value) => {
                      this.setState({
                        advanced: {
                          ...this.state.advanced,
                          google_analytics_id: value,
                        },
                        errors: {
                          ...this.state.errors,
                          google_analytics_id: '',
                        },
                      });
                    },
                  }}
                  meta={{
                    touched: true,
                    error: this.state.errors.google_analytics_id,
                  }}
                  eventName='click-advanced_google_analytics'
                />
                <Button
                  primary
                  disabled={advanced_init.google_analytics_id == advanced.google_analytics_id}
                  onClick={() => {
                    if (!advanced.google_analytics_id.match(/^UA-\d{6,9}-\d*$|^(?![\s\S])|^$/)) {
                      this.setState({
                        errors: {
                          ...this.state.errors,
                          google_analytics_id: 'Please follow this format UA-XXXXXX-Y',
                        },
                      });
                      amplitude.logEvent('click-advanced_google_analytics_error',{value: advanced.google_analytics_id});
                      return;
                    }
                    this.props.setSettings({
                      advanced: {
                        ...advanced_init,
                        google_analytics_id: advanced.google_analytics_id,
                      },
                    });
                    amplitude.logEvent('click-advanced_google_analytics_save',{value: advanced.google_analytics_id});
                  }}
                >
                  {I18n.t('Save')}
                </Button>
              </div>
            </Card>
            <div className="block-info mt-20">
              <div className="header-title">{I18n.t('Custom CSS')}</div>
              <div className="message">{I18n.t('Add custom CSS to further style your bar')}</div>
            </div>
            <Card sectioned>
              <div className="input-group full">
                <TextInput
                  label={I18n.t('Enter your CSS below')}
                  className="advanced-input"
                  input={{
                    value: advanced.custom_css,
                    onChange: (value) => {
                      this.setState({
                        advanced: {
                          ...this.state.advanced,
                          custom_css: value,
                        },
                      });
                    },
                  }}
                  meta={{}}
                  multiline={6}
                  eventName='click-advanced_custom_css'
                />
                <Button
                  primary
                  disabled={advanced_init.custom_css == advanced.custom_css}
                  onClick={() => {
                    this.props.setSettings({
                      advanced: {
                        ...advanced_init,
                        custom_css: advanced.custom_css,
                      },
                    });
                    amplitude.logEvent('click-advanced_custom_css_save')
                  }}
                >
                  {I18n.t('Save')}
                </Button>
              </div>
            </Card>
            <div className="block-info mt-20">
              <div className="header-title">{I18n.t('Custom Javascript')}</div>
              <div className="message">{I18n.t('Add custom Javascript to your bar')}</div>
            </div>
            <Card sectioned>
              <div className="input-group full">
                <TextInput
                  label={I18n.t('Enter your Javascript below')}
                  className="advanced-input"
                  input={{
                    value: advanced.custom_js,
                    onChange: (value) => {
                      this.setState({
                        advanced: {
                          ...this.state.advanced,
                          custom_js: value,
                        },
                      });
                    },
                  }}
                  meta={{}}
                  multiline={6}
                  eventName='click-advanced_custom_js'
                />
                <Button
                  primary
                  disabled={advanced_init.custom_js == advanced.custom_js}
                  onClick={() => {
                    this.props.setSettings({
                      advanced: {
                        ...advanced_init,
                        custom_js: advanced.custom_js,
                      },
                    });
                    amplitude.logEvent('click-advanced_custom_js_save')
                  }}
                >
                  {I18n.t('Save')}
                </Button>
              </div>
            </Card>
            <div className="block-info mt-20">
              <div className="header-title">{I18n.t('Your Bear Account')}</div>
              <div className="message">{I18n.t('Manage your Honeycomb account')}</div>
            </div>
            <Card sectioned>
              <div className="meneger-account">
                <div>
                  <p>{pricingPlan} Plan</p>
                  <p>{I18n.t('Your monthly views quota renews on ')} {moment(periodRenewAt).format('Do MMMM YYYY')}</p>
                </div>
                <div><Link onClick={() => {
                  localStorage.setItem('visitedFromAdvanced', true);
                  Router.push('/pricing');
                }}>{I18n.t('Change Plan')}</Link></div>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
        <div style={{height: '40px', width: '100%'}}></div>
        <SpecialOfferBanner
          specialOfferImagePath='../static/images/silver_offer_image.svg'
          title='20% off our Silver plan'
          subtitle='7 day free trial included. Cancel anytime, no strings attached.'
          ctaText='Claim 20% off'
          ctaHref='https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special'
          origin='advanced_tab'
          />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  advanced: state.settings.data.advanced || {},
  periodRenewAt: state.settings.data.periodRenewAt || moment().add(30, 'days'),
  pricingPlan: state.settings.data.pricingPlan || 'Free',
});

const mapDispatchToProps = {
  setSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
