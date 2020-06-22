import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const OfferBannerBottomStripOfferButton = styled.a`
  font-weight: 600;
  font-size: 16px;
  line-height: 44px;
  display: flex;
  align-items: center;
  text-align: center;
  background-color: #5d6cc1;
  border-radius: 3px;
  color: #ffffff;
  width: 197px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  border: none;
  text-decoration: none;
  @media (max-width: 750px) {
    margin: auto auto 20px auto;
  }
`;

const OfferBannerBottomStripFeaturesTitle = styled.div`
  margin: 0px auto 0px 0px;
`;
const OfferBannerBottomStripFeatures = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #212b36;
  justify-content: center;
  margin-right: 38px;
  @media (max-width: 750px) {
    margin: auto;
  }
`;
const OfferBannerBottomStripOffer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const OfferBannerBottomStrip = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  padding: 22px 33px;
  justify-content: center;
  @media (max-width: 750px) {
    flex-direction: column;
    margin: 0px;
    padding: 5px;
  }
`;
const OfferBannerTopStrip = styled.div`
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
const OfferBanner = styled.div`
  display: flex;
  flex-direction: column;
`;

const OfferBannerBottomStripFeaturesImage = styled.img`
  @media (max-width: 750px) {
    margin: auto auto 20px auto;
    height: auto;
    width: 320px;
  }
`;

const OfferBannerBottomStripOfferTitle = styled.div`
  font-weight: 600;
  font-size: 22px;
  line-height: 26px;
  display: flex;
  align-items: center;
  color: #212b36;
  margin-bottom: 4px;
  @media (max-width: 750px) {
    margin: auto auto 10px auto;
  }
`;

const OfferBannerBottomStripOfferSubtitle = styled.div`
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  color: #212b36;
  margin-bottom: 10px;
  @media (max-width: 750px) {
    margin: auto auto 20px auto;
    text-align: center;
  }
`;
class SpecialOfferBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      specialOfferImagePath,
      title,
      subtitle,
      ctaText,
      ctaHref,
      showBanner,
      origin
    } = this.props;

    return (<div>
        {showBanner ?
        (<OfferBanner>
          <OfferBannerTopStrip>DEAL UNLOCKED 🎉</OfferBannerTopStrip>
          <OfferBannerBottomStrip>
            <OfferBannerBottomStripFeatures>
              <OfferBannerBottomStripFeaturesImage src={specialOfferImagePath} />
            </OfferBannerBottomStripFeatures>
            <OfferBannerBottomStripOffer>
              <OfferBannerBottomStripOfferTitle>
                {title}
              </OfferBannerBottomStripOfferTitle>
              <OfferBannerBottomStripOfferSubtitle>
                {subtitle}
              </OfferBannerBottomStripOfferSubtitle>
              <OfferBannerBottomStripOfferButton
                href={ctaHref}
                target="_blank"
                onClick={() => {
                  amplitude.logEvent("click-claim_special_offer", {
                    origin: `banner-${origin}`,
                    value: "honeycomb-silver-special",
                  });
                }}
              >
                {ctaText || "Claim now"}
              </OfferBannerBottomStripOfferButton>
            </OfferBannerBottomStripOffer>
          </OfferBannerBottomStrip>
        </OfferBanner>) : null}
      </div>);
  }
}

const mapStateToProps = (state) => {
  if (!state.settings) {
    return {};
  } else {
    return {
      bigBear: state.bigBear || null,
      shop: state.bigBear.shop,
      apps: state.bigBear.apps,
      currentApp: window ? window.location.hostname.split(".")[0] : null,
      showBanner: state.settings.data.pricingPlan ? (state.settings.data.pricingPlan === 'Free') : false,
    };
  }
};

export default connect(mapStateToProps)(SpecialOfferBanner);
