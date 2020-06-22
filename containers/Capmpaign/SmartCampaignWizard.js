import React, { Component } from "react";
import { I18n } from "react-redux-i18n";
import { Link, Icon, Modal, Button } from "@shopify/polaris";
import {
  MobilePlusMajorMonotone,
  WandMajorMonotone
} from "@shopify/polaris-icons";
import "./SmartCampaignWizard.scss";
import { getSmartCampaign, newNotification } from "../../redux/actions";
import { connect } from 'react-redux';
import {
  isDirty,
} from 'redux-form';

class SmartCampaignWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      analyzing_order: false,
      bilding_smart: false,
      step_description: false,
      campaigns: [],
      active_item: 0,
      start_again: false,
      confirm: false
    };
  }

  open = async () => {
    try {
      this.setState({
        show: true,
        analyzing_order: true,
        start_again: false,
        bilding_smart: false,
        step_description: false,
        confirm: false
      });
      const campaigns = await getSmartCampaign();
      let index = 0;

      campaigns.some((item, i) => {
        if (item) {
          index = i;
          return true;
        }
      });

      this.setState({
        bilding_smart: true,
        analyzing_order: false,
        campaigns,
        active_item: index
      });
      setTimeout(() => {
        this.setState({
          step_description: Boolean(campaigns[index]),
          start_again: !campaigns[index],
          bilding_smart: false
        });
      }, 800);
    } catch (error) {
      //
    }
  };

  nextItem = () => {
    const { campaigns, active_item } = this.state;
    const current_item = active_item + 1;

    if (campaigns.length > current_item && !campaigns[current_item]) {
      this.state.active_item = current_item;
      this.nextItem();
    } else {
      this.setState({
        active_item:
          campaigns.length > current_item ? current_item : active_item,
        start_again: campaigns.length === current_item,
        step_description: campaigns.length > current_item
      });
    }
  };

  selectCampaign = () => {
    const { change } = this.props;

    const { campaigns, active_item } = this.state;
    change("trigger", "trigger_products");
    change("trigger_products", [
      {
        id: campaigns[active_item][0].id,
        title: campaigns[active_item][0].title
      }
    ]);
    change("offers[0].product", {
      id: campaigns[active_item][1].id,
      title: campaigns[active_item][1].title
    });

    change('page_to_show', campaigns[active_item][0]['page_to_show']);

    // if(campaigns[active_item][0]['page_to_show'] == 'product_page'){
    //   change('event', 'add_to_cart_click');
    // } else 
    
    if(campaigns[active_item][0]['page_to_show'] == 'cart_page'){
      change('event', 'checkout_click');
    } else {
      change('include_free_shipping', true);
    }

    this.setState({
      show: false,
      analyzing_order: false,
      bilding_smart: false,
      step_description: false,
      campaigns: [],
      active_item: 0,
      start_again: false,
      confirm: false
    },()=>{
      this.props.newNotification(I18n.t('All set Click Save & Activate to launch the funnel'))
    });
  };

  render() {
    const {
      show,
      analyzing_order,
      confirm,
      bilding_smart,
      step_description,
      campaigns,
      active_item,
      start_again
    } = this.state;

    return (
      <React.Fragment>
        <Modal
          open={show}
          size="Small"
          onClose={() => {
            this.setState({ show: false });
          }}
        >
          <Modal.Section>
            <div className="SmartCampaignWizard-modal">
              {(analyzing_order || bilding_smart || start_again) && (
                <div className="block-loader">
                  <img src={require("../../static/images/Bear.svg")} alt="" />
                  <div className="title">
                    {!start_again && (
                      <div className="spinner-box">
                        <div className="circle-border">
                          <div className="circle-core" />
                        </div>
                      </div>
                    )}
                    {analyzing_order && I18n.t("Analyzing your order history")}
                    {bilding_smart && I18n.t("Building smart campaigns")}
                    {start_again &&
                      I18n.t(
                        "Our wizard couldn’t find more campaign recommendations at this point"
                      )}
                  </div>
                  {start_again && (
                    <div style={{ marginTop: "2rem" }}>
                      <Button onClick={this.open} primary>
                        {I18n.t("Start Wizard Again")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {step_description && (
                <div className="smart-campaign">
                  <img src={require("../../static/images/Bear.svg")} alt="" />
                  <button
                    className={`btn-gr gr${active_item < 3 ? active_item : 0}`}
                    type="button"
                  >
                    {active_item === 0
                      ? I18n.t("Likely Bought Together")
                      : null}
                    {active_item === 1 ? I18n.t("Decrease Inventory") : null}
                    {active_item === 2 ? I18n.t("More of the same") : null}
                    {active_item > 2 ? I18n.t("Likely Bought Together") : null}
                  </button>
                  <div className="text">
                    {active_item === 0
                      ? I18n.t(
                          "Based on your orders history, these items are likely to be bought together:"
                        )
                      : null}
                    {active_item === 1
                      ? I18n.t(
                          "Sell high inventory items with a slow order rate together with your best selling product:"
                        )
                      : null}
                    {active_item === 2
                      ? I18n.t(
                          "Buyers buy a few items of this product, offer other buyers to add more items of the same product:"
                        )
                      : null}
                    {active_item > 2
                      ? I18n.t(
                          "Based on your orders history, these items are likely to be bought together:"
                        )
                      : null}
                  </div>
                  <div className="product-items">
                    <div
                      className="item"
                      style={{
                        backgroundImage: `url(${campaigns[active_item][0].image_src})`
                      }}
                    />
                    <Icon source={MobilePlusMajorMonotone} color="inkLight" />
                    <div
                      className="item"
                      style={{
                        backgroundImage: `url(${campaigns[active_item][1].image_src})`
                      }}
                    />
                  </div>
                  <div className="footer">
                    <Button onClick={()=>{
                      this.nextItem()
                      amplitude.logEvent('click-smart_wizard_next_suggestion');
                    }
                      }>
                      <div className="btn-text">
                        <Icon source={WandMajorMonotone} color="inkLight" />
                        {I18n.t("Try another")}
                      </div>
                    </Button>
                    <Button
                      primary
                      onClick={() => {
                        if(this.props.isDirty){
                          this.setState({
                            confirm: true,
                            step_description: false
                          });
                        } else {
                          this.selectCampaign();
                        }

                        amplitude.logEvent('click-smart_wizard_select_suggestion');
                      }}
                    >
                      {I18n.t("Use Campaign Recommendation")}
                    </Button>
                  </div>
                </div>
              )}
              {confirm && (
                <div className="smart-confirm">
                  <div className="text">
                    {I18n.t(
                      "Using this recommendation will override any existing triggers and offers Would you like to continue?"
                    )}
                  </div>
                  <div className="actions">
                    <Button
                      onClick={() => {
                        this.setState({
                          confirm: false,
                          step_description: true
                        });
                        amplitude.logEvent('click-smart_wizard_disapprove_suggestion');
                      }}
                    >
                      {I18n.t("Cancel")}
                    </Button>
                    <Button primary onClick={()=>{
                      this.selectCampaign();
                      amplitude.logEvent('click-smart_wizard_approve_suggestion');
                      }}>
                      {I18n.t("OK, continue")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Modal.Section>
        </Modal>
        {/* <Link
          onClick={() => {
            amplitude.logEvent("click-open_smart_campaign_wizard");
            this.open();
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-smart">
              <Icon source={WandMajorMonotone} />
            </div>
            <span style={{ marginLeft: "0.9rem" }}>
              {I18n.t("Smart Campaign Wizard")}
            </span>
          </div>
        </Link> */}
        <Button
          icon={WandMajorMonotone}
          primary
          onClick={() => {
            amplitude.logEvent("click-open_smart_campaign_wizard");
            this.open();
          }}
        >
          {/* {`See suggested funnels for ${this.props.shopName || 'your store'}`}*/}
          {/* {I18n.t(" Recommend funnel")} */}
          &nbsp;Recommend funnel
        </Button>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  isDirty: isDirty('campaign')(state),
  shopName: (state.bigBear && state.bigBear.shop && state.bigBear.shop.shop_information) ? state.bigBear.shop.shop_information.name : 'your store',
});

const mapDispatchToProps = {
  newNotification,
};
export default connect(mapStateToProps, mapDispatchToProps)(SmartCampaignWizard);
