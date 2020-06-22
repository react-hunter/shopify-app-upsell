import React, { Component } from 'react';
import './BarPreview.scss';
import ContentPreview from '../BarPreview/ContentPreview';
import { getCampaignPreview } from '../../redux/actions';
import { I18n } from 'react-redux-i18n';
import { Button, Spinner } from '@shopify/polaris';
import {cloneDeep, isEqual} from 'lodash'

class BarPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNotification: true,
      minimized: true,
      campaign: {},
      showWidget: true,
      isCheckout: false,
      changeOfferActive: 0,
      is_loaded: true
    }

    let minimizedTmp = true;
    const {settings, campaign} = props;

    if(campaign.page_to_show){
      if(
        (campaign.page_to_show == 'product_page' && event == 'page_view') ||
        (campaign.page_to_show == 'cart_page' && event == 'page_view')
      ){
        minimizedTmp = false;
      } else if(campaign.page_to_show == ''){
        minimizedTmp = false;
        if(settings && settings.design && settings.design.theme && settings.design.theme.minimized_view && settings.design.theme.minimized_view.start_minimized){
          minimizedTmp = true
        }
      }
    }

    this.state.minimized = minimizedTmp;
  }

  async componentDidMount(){

    let tmp_offers = this.props.campaign && this.props.campaign.offers && this.props.campaign.offers.filter(offer => offer.product && offer.product.id) || [];
    if(tmp_offers.length){
      this.setState({is_loaded: false});
      const data = await getCampaignPreview({...this.props.campaign, offers: tmp_offers}, this.props.settings.shopify_domain)
      this.setState({
        campaign: data, 
        is_loaded: true, 
        showWidget: true
      });
    } else {
      this.setState({showWidget: false})
    }
  }

  async componentWillReceiveProps(nextProps){

    let TmpCopyCampaign = _.pick(cloneDeep(nextProps.campaign), ['event', 'page_to_show', 'offers', '_id']);
    let TmpCopyCampaignOld = _.pick(cloneDeep(this.props.campaign), ['event', 'page_to_show', 'offers', '_id']);

    TmpCopyCampaign.offers = TmpCopyCampaign.offers && TmpCopyCampaign.offers.map(offer => _.pick(offer, ['discount', 'free_shipping', 'offer_description', 'offer_text', 'product', 'show_offer_description', 'upsell_type','limit_products','limit_products_amount'])) || []
    TmpCopyCampaignOld.offers = TmpCopyCampaignOld.offers && TmpCopyCampaignOld.offers.map(offer => _.pick(offer, ['discount', 'free_shipping', 'offer_description', 'offer_text', 'product', 'show_offer_description', 'upsell_type', 'limit_products','limit_products_amount'])) || []
    

    if(nextProps.campaign && !isEqual(TmpCopyCampaign, TmpCopyCampaignOld)){
      let offers = nextProps.campaign.offers || [];
      let old_offers = this.props.campaign.offers || [];

      const {campaign, settings} = nextProps;

      let minimizedTmp = false;

      if(campaign.page_to_show){
        if(
          (campaign.page_to_show == 'product_page' && campaign.event == 'page_view') ||
          (campaign.page_to_show == 'cart_page' && campaign.event == 'page_view')
        ){
          minimizedTmp = true;
        } else if(campaign.page_to_show == 'thankyou_page'){
          minimizedTmp = false;
          if(settings && settings.design && settings.design.theme && settings.design.theme.minimized_view && settings.design.theme.minimized_view.start_minimized){
            minimizedTmp = true
          }
        }
      }
      
      let tmp_offers = nextProps.campaign.offers.filter(offer => offer.product && offer.product.id);
      if(tmp_offers.length){

        let changeOfferActive = 0;

        if(TmpCopyCampaign.offers.length != TmpCopyCampaignOld.offers.length){
          changeOfferActive = TmpCopyCampaign.offers.length -1;
        } else {
          tmp_offers.some((_i, index) => {
            if(!isEqual(TmpCopyCampaign.offers[index], TmpCopyCampaignOld.offers[index])){
              changeOfferActive=index; 
              return true;
            }
          })
        }

        this.setState({is_loaded: false, showWidget: false})
        const data = await getCampaignPreview({...nextProps.campaign, offers: tmp_offers}, nextProps.settings.shopify_domain);
        this.setState({
          is_loaded: true,
          campaign: data, 
          changeOfferActive: changeOfferActive,
          showWidget: true,
          minimized: minimizedTmp,

        });
      } else {
        this.setState({showWidget: false})
      }
    }
  }

  setMinimized = (status) => {
    this.setState({
      minimized: status
    })
  }

  goToCheckout = (data) => {
    this.setState({showWidget: false, isCheckout: true});
  }

  restart = () => {
    let minimizedTmp = false;
    const {settings} = this.props;

    if(settings && settings.design && settings.design.theme && settings.design.theme.minimized_view && settings.design.theme.minimized_view.start_minimized){
      minimizedTmp = true
    }

    this.setState({
      showWidget: true,
      isCheckout: false,
      minimized: minimizedTmp,
    });
  }
  
  render() {
    const {showNotification, campaign, is_loaded, minimized, showWidget, isCheckout, changeOfferActive} = this.state;

    const {settings} = this.props;

    const campaignProps = this.props.campaign;

    let isValidCampaign = false;

    if(campaign 
      && campaign.offers
      && campaign.offers[0]
      && campaign.offers[0].product
      && campaign.offers[0].product.variants
      && campaign.offers[0].product.variants[0]){
      isValidCampaign = true
    }


    let title = I18n.t('Thank You Page');
    let title_checkout = title;

    switch (campaignProps.page_to_show) {
      case 'product_page':
        title = I18n.t('Product page');
        break;
      case 'cart_page':
        title = I18n.t('Cart page');
        break;
      case 'thankyou_page':
        title = I18n.t('Thank You page');
        break;
      default:
        break;
    }

    if(!campaignProps.page_to_show){
      if(!(campaignProps.page_to_show && campaignProps.page_to_show == 'thankyou_page')){
        return null
      }
    }



    switch (campaignProps.action_accept_offer) {
      case 'go_to_cart':
        title_checkout = I18n.t('Cart Page');
        break;
      case 'go_to_checkout':
        title_checkout = I18n.t('Checkout Page');
        break;
      case 'stay_on_page':
        title_checkout = title;
        break;  
      default:
        break;
    }

    return (
      <div className="BarPreview-campaign">
        <div className="container-preview">
          {!is_loaded && <div className="spiner-content">
            <Spinner accessibilityLabel="Spinner example" size="large" color="teal" />
          </div>}
          <div className="page-content" style={{zIndex: isCheckout ? 2 : -1}}>
            {isCheckout ? 
              <React.Fragment>
                <div className="page-title">{title_checkout}</div>
                <div style={{marginTop: 20}}>
                  <Button primary onClick={this.restart}>{I18n.t('Restart')}</Button>
                </div>
              </React.Fragment>
            : 
              <div className="page-title">{title}</div>
            }
          </div>
          {(isValidCampaign && showWidget && !isCheckout) &&  <ContentPreview
            fontSize={8.8}
            campaign={cloneDeep(campaign)}
            settings={settings}
            minimized={minimized}
            setMinimized={this.setMinimized}
            active_offer_force={changeOfferActive}
            isCampaign
            goToCheckout={this.goToCheckout}
          />}
        </div>
        {showNotification && <div className="notification">
          <div className="text">
            You can design the app in the “design” tab after you’re done creating your funnel.
          </div>
          <div className="action">
            <img src="/static/images/Dismiss.svg" onClick={() => {this.setState({showNotification: false})}} />
          </div>
        </div>}
      </div>
    );
  }
}

export default BarPreview;
