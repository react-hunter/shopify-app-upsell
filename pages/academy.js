import React, { Component } from "react";
import { I18n } from "react-redux-i18n";
import styled from "styled-components";
import { ExternalMinor } from "@shopify/polaris-icons";
import { Button } from "@shopify/polaris";
import { connect } from "react-redux";
import SpecialOfferBanner from "../components/SpecialOfferBanner";


const Card = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  text-align: center;
  padding: 25px 30px;
  margin: auto;
  width: 735px;
  height: 160px;
  button {
    margin: auto 0px auto auto;
  }
  @media (max-width: 750px) {
    flex-direction: column;
    width: auto;
    height: auto;
    padding: 15px 15px;
      }
`;

const HeaderImage = styled.img``;

const Title = styled.h2`
  font-size: 18px;
  line-height: 21px;
  text-align: left;
  color: #000000;
  ${props => !props.hasImage ? 'margin-bottom: 20px;' : 'margin-bottom: 10px;'}
  @media (max-width: 750px) {
      margin: auto auto 10px auto;
      text-align: center;
      }
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 17px;
  display: flex;
  text-align: left;
  color: #637381;
  ${props => !props.hasImage && 'min-width: 450px;'}
  @media (max-width: 750px) {
      margin: auto auto 20px auto;
      text-align: center;
      min-width: unset;
      }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto 0px auto 20px;
  ${props => !props.hasImage ? 'max-width: 350px;' : 'max-width: 260px;'}
  @media (max-width: 750px) {
      margin: auto;
      }
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-left: 50px;
  flex: auto;
  @media (max-width: 750px) {
    margin: auto;
      }
`;

const ContentCard = ({
  headerImageSrc,
  headerText,
  descriptionText,
  ctaText,
  href,
  hideIcon,
  customOnClick
}) => {
  return (
    <Card>
      {headerImageSrc && <HeaderImage src={headerImageSrc} />}
      <ContentWrapper hasImage={headerImageSrc}>
        <Title hasImage={headerImageSrc}>{headerText}</Title>
        <Description hasImage={headerImageSrc}>{descriptionText}</Description>
      </ContentWrapper>
      <ButtonWrapper>
        <Button
          icon={!hideIcon && ExternalMinor}
          external
          primary
          onClick={() => {
            if(customOnClick){
              customOnClick();
            } else {
              amplitude.logEvent("click-open_inspiration", { value: headerText });
              window.open(href, "_blank");
            }
          }}
        >
          {ctaText}
          </Button>
      </ButtonWrapper>
    </Card>
  );
};

const GridLayout = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1.6rem;
`;

const UpsellInsightsSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 27px;
`;

const PageTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 33px;
  color: #212B36;  
  margin-bottom: 30px;
`;

const UpsellInsightsVideoCards = styled.div`
    display: grid;
    align-items: center;
    grid-gap: 25px;
    grid-template-columns: repeat(2,1fr);
    margin: auto auto 40px auto;
    @media (max-width: 750px) {
        grid-template-columns: repeat(1,1fr);
      }
`;

const UpsellInsightsVideoCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  max-width: 350px;
`;

const UpsellInsightsVideoCardHeader = styled.img`
  object-fit: contain;
  border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 100%;
`;

const UpsellInsightsVideoCardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;
const UpsellInsightsVideoCardTitle = styled.div`
  font-size: 18px;
  line-height: 21px;
  color: #212B36;
`;

const UpsellInsightsVideoCardSubtitle = styled.div`
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  color: #637381;
  margin: 10px 0px 20px 0px;
`;

const UpsellInsightsVideoCardTime = styled.div`
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  color: #212B36;
`;

const UpsellInspirationSection = styled.div`
    display: flex;
    flex-direction: column;
    padding: 30px 27px;
    margin-bottom:10px;
`;

const UpsellInspirationCards = styled.div`
      display: grid;
      align-items: center;
      grid-gap: 25px;
      grid-template-columns: repeat(1,1fr);
      margin: auto;
      @media (max-width: 750px) {
        grid-template-columns: repeat(1,1fr);
      }
`;

const UpsellCommonQuestionsSection = styled.div`
      display: flex;
    flex-direction: column;
    padding: 30px 27px;
    margin-bottom:10px;
`;

const UpsellCommonQuestionsCards = styled.div`
      display: grid;
      align-items: center;
      grid-gap: 25px;
      grid-template-columns: repeat(1,1fr);
      margin: auto;
`;


const OfferBottomBannerBottomStripOfferButton = styled.a`
      font-weight: 600;
      font-size: 16px;
      line-height: 44px;
      display: flex;
      align-items: center;
      text-align: center;
      background: #ffb800;
      border-radius: 3px;
      color: #ffffff;
      width: 197px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      border: none;
      text-decoration: none;
      @media (max-width: 500px) {
        margin: auto;
      }
`;

const OfferBottomBannerBottomStripOfferPrice = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #212B36;
  margin: 4px auto 10px auto;
`;

const OfferBottomBannerBottomStripOfferComparePrice = styled.div`
  text-decoration: line-through;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #637381;
  margin: auto;
`;

const OfferBottomBannerBottomStripFeaturesFeature = styled.span`
    margin: 0px auto 0px 0px;
      &:before {
        content: url(../static/images/check_bottom.svg);
        padding-top: 1px;
        padding-right: 12px;
      }
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  display: inline-flex;
  align-items: center;
    @media (max-width: 750px) {
      margin: auto;
      }
`;

const OfferBottomBannerBottomStripFeaturesTitle = styled.div`
    margin: 0px auto 0px 0px;
    @media (max-width: 750px) {
      margin: auto auto 10px auto;
}
`;
const OfferBottomBannerBottomStripFeatures = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #212B36;
  justify-content: space-around;
  @media (max-width: 750px) {
    justify-content: center;
    margin-bottom: 20px;
  }
`;
const OfferBottomBannerBottomStripOffer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const OfferBottomBannerBottomStrip = styled.div`
  display: flex;
  flex-direction:row;
  background-color: white;
  padding: 22px 33px;
  justify-content: space-between;
  @media (max-width: 750px) {
    flex-direction: column;
    justify-content: center;
    padding: 22px 15px;
      }
`;
const OfferBottomBannerTopStrip = styled.div`
    display: inline-block;
    width: 100%;
    height: 32px;
    background-color: #000639;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
    color: white;
    letter-spacing: 0.07em;
    font-weight: 800;
`;
const OfferBottomBanner = styled.div`
  display: flex;
  flex-direction:column;
`;


class Academy extends Component {
  constructor(props) {
    super(props);
    this.defaultScrolY = window.scrollY;
    this.state ={
      showSpecialOffer: true,
    }
  }

  componentDidMount() {
    if (process.browser) {
      window.scrollTo(0, this.defaultScrolY);
      amplitude.logEvent("page_load", { value: "academy" });
    }

    //TODO: check if there's a need to show showSpecialOffer
  }

  render() {
    return (
      <div className="tab-academy">
        <UpsellInsightsSection>
          <PageTitle>Upsell Insights</PageTitle>
          <UpsellInsightsVideoCards>

            <UpsellInsightsVideoCard>
              <a href='https://youtu.be/zz_FXYMjYaI' target="_blank" onClick={()=>{}}>
                <UpsellInsightsVideoCardHeader src={require("../static/images/video_cover_1.png")}/>
              </a>
              <UpsellInsightsVideoCardContent>
                <UpsellInsightsVideoCardTitle>Set up virtual products in 60 seconds</UpsellInsightsVideoCardTitle>
                <UpsellInsightsVideoCardSubtitle>See how to add virtual products with no shipping and no inventory managment.</UpsellInsightsVideoCardSubtitle>
                <UpsellInsightsVideoCardTime>2:27</UpsellInsightsVideoCardTime>
              </UpsellInsightsVideoCardContent>
            </UpsellInsightsVideoCard>

            <UpsellInsightsVideoCard>
              <a href='https://www.youtube.com/watch?v=yyvSUm26-Qw' target="_blank" onClick={()=>{}}>
                <UpsellInsightsVideoCardHeader src={require("../static/images/video_cover_2.png")}/>
              </a>
              <UpsellInsightsVideoCardContent>
                <UpsellInsightsVideoCardTitle>How to win multiple offers</UpsellInsightsVideoCardTitle>
                <UpsellInsightsVideoCardSubtitle>See how to nail multiple offers through customer journies.</UpsellInsightsVideoCardSubtitle>
                <UpsellInsightsVideoCardTime>3:40</UpsellInsightsVideoCardTime>
              </UpsellInsightsVideoCardContent>
            </UpsellInsightsVideoCard>

          </UpsellInsightsVideoCards>
          </UpsellInsightsSection>

          <SpecialOfferBanner 
          specialOfferImagePath='../static/images/silver_offer_image.svg'
          title='20% off our Silver plan'
          subtitle='7 day free trial included. Cancel anytime, no strings attached.'
          ctaText='Claim 20% off'
          ctaHref='https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special'
          origin='academy_tab'
          />
  
          <UpsellInspirationSection>
            <PageTitle>Funnel Inspiration</PageTitle>
            <UpsellInspirationCards>
              <ContentCard
              headerImageSrc="../static/images/inspiration/single.svg"
              headerText={I18n.t("Single Product Store")}
              descriptionText={I18n.t(
                "Use extra services to increase order value Add hidden “products” such as extended warranty"
              )}
              ctaText={I18n.t("See Example")}
              href={
                "https://shop.conversionbear.com/pages/thank-you-2?cb_campaign=5e5e67e92b42cd0017631615"
              }
            />
            <ContentCard
              headerImageSrc="../static/images/inspiration/general.svg"
              headerText={I18n.t("General Store")}
              descriptionText={I18n.t(
                "Use product combinations and complementary offers from different collections"
              )}
              ctaText={I18n.t("See Example")}
              href={
                "https://shop.conversionbear.com/pages/thank-you?cb_campaign=5e39b408fca23d0017c9ff28"
              }
            />
            <ContentCard
              headerImageSrc="../static/images/inspiration/niche.svg"
              headerText={I18n.t("Niche Store")}
              descriptionText={I18n.t(
                "Use product variations and other models to appeal your collectors audience"
              )}
              ctaText={I18n.t("See Example")}
              href={
                "https://shop.conversionbear.com/pages/thank-you-3?cb_campaign=5e5e8974a371be0017ce4b4b"
              }
            />
            </UpsellInspirationCards>            
          </UpsellInspirationSection>

          <UpsellCommonQuestionsSection>
          <PageTitle>Common Questions</PageTitle>

            <UpsellCommonQuestionsCards>
              <ContentCard
                headerText={I18n.t("What are draft orders?")}
                descriptionText="Draft orders is our way to apply automatic discounts without the need of discount codes. you should only consider orders that appear in your orders tab as complete upsell purchases..."
                ctaText={I18n.t("Learn more")}
                href={
                  "https://conversionbear.freshdesk.com/support/solutions/articles/48001140187-what-are-draft-orders-"
                }
              />
                <ContentCard
                headerText="How to open Honeycomb in any page"
                descriptionText="Thinking about triggers funnels on top of your blog pages? definetly possible. You can trigger a funnel on top of any page of your store by using your funnel id..."
                ctaText={I18n.t("Learn more")}
                href={
                  "https://conversionbear.freshdesk.com/support/solutions/articles/48000978418-how-to-open-honeycomb-in-any-page-of-your-store"
                }
              />
            </UpsellCommonQuestionsCards>
          </UpsellCommonQuestionsSection>
          
          {this.props.showBanner && <OfferBottomBanner>
            <OfferBottomBannerTopStrip>UNLOCK YOUR UPSELL POTENTIAL</OfferBottomBannerTopStrip>
            <OfferBottomBannerBottomStrip>
                <OfferBottomBannerBottomStripFeatures>
                  <OfferBottomBannerBottomStripFeaturesTitle>Get our Silver plan for a special price.</OfferBottomBannerBottomStripFeaturesTitle>
                  <OfferBottomBannerBottomStripFeaturesFeature>Remove branding</OfferBottomBannerBottomStripFeaturesFeature>
                  <OfferBottomBannerBottomStripFeaturesFeature>2,000 monthly funnel views</OfferBottomBannerBottomStripFeaturesFeature>
                </OfferBottomBannerBottomStripFeatures>
                <OfferBottomBannerBottomStripOffer>
                  <OfferBottomBannerBottomStripOfferComparePrice>$49.99/month</OfferBottomBannerBottomStripOfferComparePrice>
                  <OfferBottomBannerBottomStripOfferPrice>$39.99/month</OfferBottomBannerBottomStripOfferPrice>
                  <OfferBottomBannerBottomStripOfferButton 
                      href='https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special'
                      target="_blank"
                      onClick={()=>{amplitude.logEvent('click-honeycomb_direct_install',{origin: 'academy_bottom_banner', offer: '20% of silver'})}}
                  >Claim 20% off</OfferBottomBannerBottomStripOfferButton>
                </OfferBottomBannerBottomStripOffer>
            </OfferBottomBannerBottomStrip>
          </OfferBottomBanner>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (!state.settings) {
    return {};
  } else {
    return {
      showBanner: state.settings.data.pricingPlan ? (state.settings.data.pricingPlan === 'Free') : false,
    };
  }
};

export default connect(mapStateToProps)(Academy);
