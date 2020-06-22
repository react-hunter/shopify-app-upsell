import React, { Component } from "react";
import { I18n } from "react-redux-i18n";
import styled from "styled-components";
import InspirationCard from "../components/InspirationCard";

const GridLayout = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 1.6rem;
`;

class Inspiration extends Component {
  constructor(props) {
    super(props);
    this.defaultScrolY = window.scrollY;
  }

  componentDidMount() {
    if (process.browser) {
      window.scrollTo(0, this.defaultScrolY);
      amplitude.logEvent("page_load", { value: "inspiration" });
    }
  }

  render() {
    return (
      <div className="tab-inspiration">
        <GridLayout>
          <InspirationCard
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
          <InspirationCard
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
          <InspirationCard
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
          <InspirationCard
            headerImageSrc="../static/images/inspiration/your_store.svg"
            headerText={I18n.t("Your Store")}
            descriptionText={I18n.t(
              "Our team of funnel experts are at your service Let us help you create better funnels"
            )}
            ctaText={I18n.t("Get Expert Setup")}
            href={
              "https://shop.conversionbear.com/pages/thank-you-2?cb_campaign=5e5e67e92b42cd0017631615"
            }
            hideIcon
            customOnClick={()=>{
              if (window.fcWidget) {
                window.fcWidget.open({
                  name: "Lynda",
                  replyText:
                    "Hey conversion bear 👋"
                });
              } else {
                window.open(
                  "mailto:lynda+honeycomb@conversionbear.com?subject=Hey conversion bear 👋"
                );
              }
              amplitude.logEvent("click-get_expert_review",{origin: 'inspiration'});
            }}
          />
        </GridLayout>
      </div>
    );
  }
}

export default Inspiration;
