/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable shopify/jsx-prefer-fragment-wrappers */
import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import "./OnboardingWizard.scss";
import { Link, Icon } from "@shopify/polaris";
import { TickSmallMinor } from "@shopify/polaris-icons";
import { setSettings as setSettingsAction, setCampaign } from "../redux/actions";
import ReviewModal from "./ReviewModal";
import { ReviewStarFull, ReviewStarEmptyYellowEdges } from "./illustrations";
import { I18n } from "react-redux-i18n";
import moment from 'moment';
import Router from "next/router";

const provideFeedbackPath = "https://www.conversionbear.com/feedback";
const reviewTextIndicator = [
  "Pretty bad",
  "Not so good",
  "Good",
  "Very good",
  "Awesome"
];

class OnboardingWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRank: 0,
      modalActive: false
    };
    this.hideStars = this.hideStars.bind(this);
    this.showStars = this.showStars.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  handleModalOpen() {
    this.setState({
      modalActive: !this.state.modalActive
    });
  }

  handleModalClose() {
    this.setState({
      modalActive: !this.state.modalActive
    });
  }

  hideStars() {
    this.setState({ selectedRank: 0 });
  }

  showStars(num) {
    this.setState({ selectedRank: num });
  }

  componentDidMount(){

  }

  render() {
    const { is_created_first_campaign } = this.props;
    return (
      <div className="BarNotice">
        {!is_created_first_campaign ? (
          <div>
            <div className="title">
              {" "}
              <span role="img" aria-label="welcome">
                👋
              </span>{" "}
              Welcome to Honeycomb Upsell Funnels
            </div>
            <div className="content-block">
              <p>
                Setting up is easy as 1-2-3! Follow these steps to set up
                Honeycomb Upsell Funnels in your store:
              </p>
              <div className="steps">
                <div className="step-item active">
                  <div className="icon">
                    <Icon color="white" source={TickSmallMinor} />
                  </div>
                  <div className="title-item">{I18n.t("Install")}</div>
                </div>
                <div
                  className={classNames("step-item", {
                    active: this.props.isActive
                  })}
                >
                  <div className="icon">
                    <Icon color="white" source={TickSmallMinor} />
                    <span className="number">2</span>
                  </div>
                  <div className="title-item">{I18n.t("Enable the app")}</div>
                </div>
                <div
                  className={classNames("step-item", {
                    active: this.props.is_created_first_campaign
                  })}
                >
                  <div className="icon">
                    <Icon color="white" source={TickSmallMinor} />
                    <span className="number">3</span>
                  </div>
                  {
                    !this.props.is_created_first_campaign ? 
                    <Link
                    onClick={() => {
                      this.props.setCampaign({
                        trigger: "trigger_all",
                        name: "Upsell Funnel #1",
                        offers: [
                          {
                            product: null,
                            upsell_type: "discount",
                            free_shipping: true,
                            limit_products_amount: 1,
                            limit_products: true,
                            offer_text: "Deal unlocked! Get this product for 50% off",
                            discount: {
                              amount: 50,
                              discount_type: "percent_off"
                            }
                          }
                        ],
                        show_campaign_only: "both",
                        skip_offers_already_icluded: false,
                        show_this_funnel_once: true,
                        start_time: false,
                        end_time: false,
                        start_date_value: moment().format("YYYY-MM-DD"),
                        end_date_value: moment()
                          .add(7, "days")
                          .format("YYYY-MM-DD")
                      });
                      amplitude.logEvent("click-new_campaign", {
                        origin: "onboarding_wizard"
                      });
                      Router.push("/campaign");
                    }}
                  >{I18n.t("Add funnel")}</Link>
                    :
                    <div className="title-item">{I18n.t("Add funnel")}</div>
                  }
                  
                </div>

                {/* <div className={classNames("step-item")}>
                  <div className="icon">
                    <Icon color="white" source={TickSmallMinor} />
                    <span className="number">4</span>
                  </div>
                  <div className="title-item">
                    <Link
                      onClick={() => {
                        if (window.fcWidget) {
                          window.fcWidget.open({
                            name: "Lynda",
                            replyText:
                              "Hey Conversion Bear, review my funnels"
                          });
                        } else {
                          window.open(
                            "mailto:lynda+honeycomb@conversionbear.com?subject=Hey Conversion Bear, review my funnels"
                          );
                        }
                        amplitude.logEvent("click-get_expert_review");
                        this.props.setSettings({ is_recieved_expert_review: true });
                      }}
                    >
                      {I18n.t("Get expert review")}
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="onboardingReviewBarContainer">
            <img
              className="onboardingReviewIllustration"
              src="./static/images/master_bear.svg"
              alt=""
            />
            <img
              src="./static/images/reviewModalIllustration.svg"
              style={{ display: "none" }}
              alt=""
            />
            <div className="onboardingreviewBarText">
              <h2 className="Polaris-Heading">
                Good Job, you’re now an Upsell Wiz!
              </h2>
              <p>Let us know what you think about the app 👉</p>
              <div className="action">
                <Link
                  onClick={() => {
                    this.props.setSettings({ bar_notice_hidden: true });
                    amplitude.logEvent("click-onboarding_close_wizard");
                  }}
                >
                  Close
                </Link>
              </div>
            </div>
            <div className="onboardingReviewBar">
              <a href={provideFeedbackPath} target="blank">
                <div
                  className="onboardingReviewStar"
                  onMouseOver={() => {
                    this.showStars(1);
                  }}
                  onMouseOut={this.hideStars}
                  onClick={() => {
                    amplitude.logEvent("click_review", {
                      value: 1,
                      origin: "onboarding"
                    });
                  }}
                >
                  {this.state.selectedRank > 0 ? (
                    <ReviewStarFull />
                  ) : (
                    <ReviewStarEmptyYellowEdges />
                  )}
                </div>
              </a>
              <a href={provideFeedbackPath} target="blank">
                <div
                  className="onboardingReviewStar"
                  onMouseOver={() => {
                    this.showStars(2);
                  }}
                  onMouseOut={this.hideStars}
                  onClick={() => {
                    amplitude.logEvent("click_review", {
                      value: 2,
                      origin: "onboarding"
                    });
                  }}
                >
                  {this.state.selectedRank > 1 ? (
                    <ReviewStarFull />
                  ) : (
                    <ReviewStarEmptyYellowEdges />
                  )}
                </div>
              </a>
              <a href={provideFeedbackPath} target="blank">
                <div
                  className="onboardingReviewStar"
                  onMouseOver={() => {
                    this.showStars(3);
                  }}
                  onMouseOut={this.hideStars}
                  onClick={() => {
                    amplitude.logEvent("click_review", {
                      value: 3,
                      origin: "onboarding"
                    });
                  }}
                >
                  {this.state.selectedRank > 2 ? (
                    <ReviewStarFull />
                  ) : (
                    <ReviewStarEmptyYellowEdges />
                  )}
                </div>
              </a>
              <a href={provideFeedbackPath} target="blank">
                <div
                  className="onboardingReviewStar"
                  onMouseOver={() => {
                    this.showStars(4);
                  }}
                  onMouseOut={this.hideStars}
                  onClick={() => {
                    amplitude.logEvent("click_review", {
                      value: 4,
                      origin: "onboarding"
                    });
                  }}
                >
                  {this.state.selectedRank > 3 ? (
                    <ReviewStarFull />
                  ) : (
                    <ReviewStarEmptyYellowEdges />
                  )}
                </div>
              </a>
              <div
                className="onboardingReviewStar"
                onMouseOver={() => {
                  this.showStars(5);
                }}
                onMouseOut={this.hideStars}
                onClick={() => {
                  this.handleModalOpen();
                  amplitude.logEvent("click_review", {
                    value: 5,
                    origin: "onboarding"
                  });
                }}
              >
                {this.state.selectedRank > 4 ? (
                  <ReviewStarFull />
                ) : (
                  <ReviewStarEmptyYellowEdges />
                )}
              </div>
              <div className="onboardingReviewTextIndicator">
                {this.state.selectedRank > 0 && (
                  <p>{reviewTextIndicator[this.state.selectedRank - 1]}</p>
                )}
              </div>
              <div className="review-step-container" />
            </div>
            <ReviewModal
              isOpen={this.state.modalActive}
              onRequestClose={this.handleModalClose}
            />
          </div>
        )}
        <div className="notFullWidthHr" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isActive: state.status.isActive || false,
  is_created_first_campaign:
    state.settings.data.is_created_first_campaign || false,
  shopify_domain: state.settings.data.shopify_domain || false,
  is_recieved_expert_review: state.settings.data.is_recieved_expert_review || false,
  campaigns: state.campaign && state.campaign.list || null,
});

const mapDispatchToProps = {
  setSettings: setSettingsAction,
  setCampaign
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWizard);
