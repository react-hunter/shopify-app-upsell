import React, { Component } from "react";
import { connect } from "react-redux";
import Baner from "../containers/Dashboard/Baner";
import UpsellStatistics from "../containers/Dashboard/UpsellStatistics";
import RevenueGrowth from "../containers/Dashboard/RevenueGrowth";
import TopConvertingCampaigns from "../containers/Dashboard/TopConvertingCampaigns";
import BanerBottom from "../containers/Dashboard/BanerBottom";
import { getCampaigns } from "../redux/actions";
import StartCampaign from "../containers/Capmpaigns/StartCampaign";
import isFirstSession from "../lib/isFirstSession";
import PolarBanner from "../components/PolarBanner";
import SpecialOfferBanner from "../components/SpecialOfferBanner";
import ViewsGraph from '../containers/Dashboard/ViewsGraph';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false
    };
  }

  async componentDidMount() {
    if (process.browser) {
      await this.props.getCampaigns();
      this.setState({ is_loaded: true });
      amplitude.logEvent("page_load", { value: "dasboard" });
      if (isFirstSession() && gtag && fbq) {
        gtag('event','Install_Upsell');
        fbq('trackCustom','Install_Upsell');
        if(rdt){ // send event to reddit
          rdt('track', 'Purchase');
        }
      }
    }
  }

  render() {
    const { campaigns } = this.props;
    const { is_loaded } = this.state;

    if (!is_loaded) {
      return null;
    }

    if (campaigns.length === 0) {
      return <StartCampaign />;
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div className="tab-dashboard">
          <Baner />
          <UpsellStatistics {...this.props}/>
          <RevenueGrowth {...this.props}/>
          <ViewsGraph />
          <TopConvertingCampaigns {...this.props} />
          <PolarBanner/>
        </div>
        <div style={{height: '40px', width: '100%'}}></div>
          <SpecialOfferBanner
            specialOfferImagePath='../static/images/silver_offer_image.svg'
            title='20% off our Silver plan'
            subtitle='7 day free trial included. Cancel anytime, no strings attached.'
            ctaText='Claim 20% off'
            ctaHref='https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special'
            origin='dashboard_tab'
            />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  campaigns: state.campaign.list || [],
  default_money_format:
    state.settings.data && state.settings.data.default_money_format
      ? state.settings.data.default_money_format
      : "$"
});

const mapDispatchToProps = {
  getCampaigns
};
//
export default connect(mapStateToProps, mapDispatchToProps)(Index);
