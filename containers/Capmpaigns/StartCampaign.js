/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from "react";
import { Button, Modal } from "@shopify/polaris";
import { connect } from "react-redux";
import { I18n } from "react-redux-i18n";
import moment from "moment";
import Router from "next/router";
import { setCampaign } from "../../redux/actions";
import CountUp, { startAnimation } from "react-countup";
// import VisibilitySensor from "react-visibility-sensor";

const randomTimesArray = [1500, 3000, 2000, 2500, 4750];

class StartCampaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    this.initTickerInterval = this.initTickerInterval.bind(this);
  }

  initTickerInterval(options) {
    let randomInterval = randomTimesArray[Math.floor(Math.random() * randomTimesArray.length)];
    if(options && options.isFirst){
      randomInterval = 7000;
    }
    // console.log(`randomInterval: ${randomInterval}`);
    setTimeout(() => {
      if (this.myCountUp && this.myCountUp.pauseResume) {
        // console.log(`pauseResume1`);
        ////////////
        this.myCountUp.pauseResume();
        if(this.myCountUp.containerRef.current.innerText === "$NaN"){
          //this.myCountUp.containerRef.current.innerText = "$43,939"
          window.myCountUp.restart()
        }
        this.initTickerInterval();
        window.myCountUp = this.myCountUp;
      }
    }, randomInterval);
  }

  componentDidMount() {
    this.initTickerInterval({isFirst: true});
  }

  render() {
    const { active } = this.state;
    return (
      <div className="StartCampaign">
        <div className="block-content">
          <div className="upsell-rev-ticker-tile">
            <div className="upsell-rev-ticker-number">
              <CountUp
                start={939997}
                duration={10000}
                end={981947}
                prefix="$"
                separator=","
                useEasing={true}
                ref={countUp => {
                  this.myCountUp = countUp;
                }}
              />
            </div>
            <div className="upsell-rev-ticker-description">
              {I18n.t("Upsell Revenue 💸")}
            </div>
          </div>
          {/* steven onboarding video */}
          {/* <img className="hand" src={require('../../static/images/hand.svg')} alt="" />
          <div 
          className='playButtonWithGifContainer' 
          onClick={() => {
            amplitude.logEvent("click-play_onboading_video");
            this.setState({ active: true });
          }}>
          <img className="play1" src={require('../../static/images/play.svg')}/>
          <img className="playingGif" src={require('../../static/images/steven_onboarding_gif.gif')}/>
          <img className="play3" src={require('../../static/images/onboarding_gif_bg.svg')}/>
        </div> */}
          {/* steven onboarding video */}
          <h1>
            {I18n.t(
              "Join +1,000 merchants that sell more with Honeycomb"
            )}
          </h1>
          <h2>
            {I18n.t(
              "Create a funnel and boost sales in your store today It only takes a minute"
            )}
          </h2>
          <Button
            primary
            size="large"
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
                origin: "onboarding"
              });
              Router.push("/campaign");
            }}
          >
            {I18n.t("Create Funnel")}
          </Button>
          {/* <Modal
            open={active}
            onClose={() => { this.setState({ active: false }); }}
          >
            <Modal.Section>
              <div className="modal-content-video">
                <iframe id="ytplayer" type="text/html" width="100%" height="360" src="https://www.youtube.com/embed/QfflDw9V2a0?autoplay=1" frameborder="0" />
              </div>
            </Modal.Section>
          </Modal> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = {
  setCampaign
};

export default connect(mapStateToProps, mapDispatchToProps)(StartCampaign);
