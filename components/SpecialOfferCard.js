import React from "react";
import { Card, Button } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import { connect } from "react-redux";
import styled from "styled-components";
import './SpecialOfferCard.scss';

const OfferBottomBannerBottomStripFeaturesFeature = styled.span`
    margin: 5x auto;
      &:before {
        content: url(../static/images/check_bottom.svg);
        padding-top: 1px;
        padding-right: 8px;
      }
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
  display: inline-flex;
  align-items: center;
`;

const OfferBottomBannerBottomStripOfferPrice = styled.div`
  font-weight: 600;
  font-size: 22px;
  line-height: 26px;  
  color: #212B36;
  margin: 0px auto 4px auto;
`;

const OfferBottomBannerBottomStripOfferComparePrice = styled.div`
  text-decoration: line-through;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #637381;
  margin: 10px auto 10px auto;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #637381;
  margin: 20px auto;
`;

const SpecialOfferCard = ({showCard }) => (
  <div style={{margin: showCard ? '20px 0px' : '20px 0px 0px 0px'}}>
    {showCard ? <Card sectioned>
    <div className="SpecialOfferCard">
      <div className="new-label">
        {I18n.t("SPECIAL OFFER")}
      </div>

      {/* <div className="title">{I18n.t('BOOST YOUR MOBILE SALES 🎉')}</div>
      <div className="logo">
      <img className="refToOtherAppAppLogo" src='../static/images/appRefAppLogo.svg'/>
      </div>
      <h1>{I18n.t('Ultimate Sticky Add to Cart')}</h1>
      <p>{I18n.t('Speed up checkout and boost sales with Sticky Add to Cart')}</p> */}
          <Title>SILVER PLAN</Title>
          <OfferBottomBannerBottomStripFeaturesFeature>Remove branding</OfferBottomBannerBottomStripFeaturesFeature>
          <OfferBottomBannerBottomStripFeaturesFeature>2,000 monthly views</OfferBottomBannerBottomStripFeaturesFeature>
          <OfferBottomBannerBottomStripFeaturesFeature>7 day free trial</OfferBottomBannerBottomStripFeaturesFeature>
          <OfferBottomBannerBottomStripOfferComparePrice>$49.99/month</OfferBottomBannerBottomStripOfferComparePrice>
          <OfferBottomBannerBottomStripOfferPrice>$39.99/month</OfferBottomBannerBottomStripOfferPrice>

        <Button
        primary
        external
        url={`https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special`}
        onClick={()=>{
          amplitude.logEvent("click-claim_special_offer",{value: 'honeycomb-silver-special', origin: 'special_offer_card'});
        }}
      >
        {I18n.t('Claim 20% off')}
      </Button>
    </div>
  </Card> : null}
    </div>
);

const mapStateToProps = (state) => {
  if (!state.settings) {
    return {};
  } else {
    return {
      showCard: state.settings.data.pricingPlan ? (state.settings.data.pricingPlan === 'Free') : false,
    };
  }
};

export default connect(mapStateToProps)(SpecialOfferCard);
