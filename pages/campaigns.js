/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable shopify/images-no-direct-imports */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, DisplayText, Modal, Tooltip, Heading, Icon } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import Router from "next/router";
import moment from "moment";
import { cloneDeep } from "lodash";
import ToggleSwitch from "../components/ToggleSwitch";
import CampaignBanerImg from "../static/images/campaignBanerImg.svg";
import {
  getCampaigns,
  setCampaign,
  updateCampaign,
  deleteCampaign,
  newNotification,
  hotUpdateCampaign
} from "../redux/actions";
import StartCampaign from "../containers/Capmpaigns/StartCampaign";
import {
  CartMajorMonotone, BillingStatementDollarMajorMonotone
} from '@shopify/polaris-icons';
import SpecialOfferBanner from "../components/SpecialOfferBanner";
class Campaigns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      deleteId: null,
      loaded: false
    };
    this.defaultScrolY = window.scrollY;
  }

  async componentDidMount() {
    this.setState({ loaded: false });
    if (process.browser) {
      window.scrollTo(0, this.defaultScrolY);
      amplitude.logEvent("page_load", { value: "campaigns_list" });
    }

    await this.props.getCampaigns();
    this.setState({ loaded: true });
  }

  deleteCampaign = async () => {
    try {
      this.setState({
        active: false,
        deleteId: null,
        deleteName: ""
      });
      await this.props.deleteCampaign(this.state.deleteId);
      await this.props.getCampaigns();
      this.props.newNotification("Funnel deleted");
    } catch (error) {
      console.log("TCL: Campaigns -> deleteCampaign -> error", error);
    }
  };

  renderPlacement = (item) => {

    if(item.page_to_show == 'product_page'){
      return <div className="text-placement">
        <div><Icon source={CartMajorMonotone} /></div>
        <div>{I18n.t('Product page')}</div>
      </div>
    }
    if(item.page_to_show == 'cart_page'){
      return <div className="text-placement">
        <div><Icon source={CartMajorMonotone} /></div>
        <div>{I18n.t('Cart Page')}</div>
      </div>
    }
   
    return <div className="text-placement">
      <div><Icon source={BillingStatementDollarMajorMonotone} /></div>
      <div>{I18n.t('Thank You Page')}</div>
    </div>
   
  }

  render() {
    const { campaigns, default_money_format } = this.props;

    const symbolCurrency = default_money_format
      .replace(/\{\{.*?\}\}/, "")
      .replace(/<[^>]*>/g, "");
    const { active, loaded } = this.state;

    if (!loaded) {
      return null;
    }

    if (campaigns.length === 0) {
      return <StartCampaign />;
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: '100px'}}>
        <div className="tab-campaigns">
          <div className="header">
            <DisplayText size="large">{I18n.t("Campaigns")}</DisplayText>
            <Button
              primary
              onClick={() => {
                this.props.setCampaign({
                  trigger: "trigger_all",
                  name: `Upsell Funnel #${campaigns.length + 1}`,
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
                  origin: "campaigns_list"
                });
                Router.push("/campaign");
              }}
            >
              {I18n.t("New Campaign")}
            </Button>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>{I18n.t("Campaign")}</th>
                  <th>{I18n.t("Active")}</th>
                  <th style={{textAlign: 'right'}}>{I18n.t("Placement")}</th>
                  <th style={{textAlign: 'right'}}>{I18n.t("Views")}</th>
                  <th style={{textAlign: 'right'}}>{I18n.t("Conversion")}</th>
                  <th style={{textAlign: 'right'}}>{I18n.t("Revenue")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={`c-${campaign._id}`}>
                    <td>
                      <Tooltip
                        light
                        preferredPosition="above"
                        content={`ID: ${campaign._id}`}
                      >
                        <span>{campaign.name}</span>
                      </Tooltip>
                    </td>
                    <td>
                      <ToggleSwitch
                        value={campaign.isActive !== undefined ? campaign.isActive : false}
                        onChange={async value => {
                          await this.props.hotUpdateCampaign({
                            _id: campaign._id,
                            isActive: value
                          });
                          await this.props.updateCampaign({
                            _id: campaign._id,
                            isActive: value
                          });
                          if (value) {
                            this.props.newNotification("Funnel activated");
                            amplitude.logEvent("click-toggle_campaign", {
                              origin: "campaigns_list",
                              value: "enabled",
                              campaignId: campaign._id
                            });
                          } else {
                            this.props.newNotification("Funnel deactivated");
                            amplitude.logEvent("click-toggle_campaign", {
                              origin: "campaigns_list",
                              value: "disabled",
                              campaignId: campaign._id
                            });
                          }
                        }}
                      />
                    </td>
                    <td style={{}}><div style={{display: 'flex', justifyContent: 'flex-end'}}>{this.renderPlacement(campaign)}</div></td>
                    <td style={{textAlign: 'right'}}>{campaign.views}</td>
                    <td style={{textAlign: 'right'}}>{campaign.convertion.toFixed(2)}%</td>
                    <td style={{textAlign: 'right'}}>
                      {default_money_format
                        .replace(/\{\{.*?\}\}/, campaign.total.toFixed(2))
                        .replace(/<[^>]*>/g, "")}
                    </td>
                    <td>
                      <div className="actions">
                      <Tooltip
                          light
                          preferredPosition="above"
                          content={I18n.t("Preview")}
                        >
                          <div
                            className="icon-action"
                            onClick={() => {
                              // this.props.setCampaign(campaign);
                              // amplitude.logEvent("click-edit_campaign", {
                              //   origin: "campaigns_list",
                              //   campaignId: campaign._id
                              // });
                              // Router.push("/campaign");
                              localStorage.removeItem("upsellShopSettings");
                              localStorage.setItem(
                                "upsellCampaing",
                                JSON.stringify(campaign)
                              );
                              localStorage.setItem(
                                "upsellShopCurrencyFormat",
                                this.props.default_money_format || "${{amount}}"
                              );
                              localStorage.removeItem("upsellShopSettingsTitle");
                              localStorage.removeItem("upsellShopSettingsDescription");
                              localStorage.setItem(
                                "upsellCampaingTitle",
                                I18n.t("This is your campaign preview")
                              );
                              localStorage.setItem(
                                "upsellCampaingDescription",
                                I18n.t(
                                  "This is your campaign preview The campaign will be triggered only after your buyer completed his order You can change the design of campaign offers in the “Design” tab located under the app settings"
                                )
                              );
                              amplitude.logEvent('click-campaign_preview',{origin: 'campaigns_list'});
                              window.open(`/default/preview?campaign=${campaign._id}`, '_blank');
                            }}
                          >
                            <img alt="" src="/static/images/Preview.svg" />
                          </div>
                        </Tooltip>
                        <Tooltip
                          light
                          preferredPosition="above"
                          content={I18n.t("Edit")}
                        >
                          <div
                            className="icon-action"
                            onClick={() => {
                              this.props.setCampaign(campaign);
                              amplitude.logEvent("click-edit_campaign", {
                                origin: "campaigns_list",
                                campaignId: campaign._id
                              });
                              Router.push("/campaign");
                            }}
                          >
                            <img alt="" src="/static/images/Edit.svg" />
                          </div>
                        </Tooltip>
                        <Tooltip
                          light
                          preferredPosition="above"
                          content={I18n.t("Duplicate")}
                        >
                          <div
                            className="icon-action"
                            onClick={() => {
                              const tmp = cloneDeep(campaign);
                              delete tmp._id;
                              tmp.name += " Copy";
                              this.props.setCampaign(tmp);
                              amplitude.logEvent("click-duplicate_campaign", {
                                origin: "campaigns_list",
                                campaignId: campaign._id
                              });
                              Router.push("/campaign");
                            }}
                          >
                            <img src="/static/images/Duplicate.svg" alt="" />
                          </div>
                        </Tooltip>
                        <Tooltip
                          light
                          preferredPosition="above"
                          content={I18n.t("Delete")}
                        >
                          <div
                            className="icon-action"
                            onClick={() => {
                              this.setState({
                                active: true,
                                deleteId: campaign._id,
                                deleteName: campaign.name
                              });
                              amplitude.logEvent("click-delete_campaign", {
                                origin: "campaigns_list",
                                campaignId: campaign._id
                              });
                            }}
                          >
                            <img src="/static/images/Delete.svg" alt="" />
                          </div>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* <div className="baner">
            <div className="img">
              <CampaignBanerImg />
            </div>
            <div className="description">
              <Heading>{I18n.t("Boost your performance")}</Heading>
              <div className="Polaris-Text-Body">
                {I18n.t(
                  "Talk with our conversion specialist, and get free expert review on your offers"
                )}
                .
              </div>
            </div>
            <Button
              onClick={() => {
                if (window.fcWidget) {
                  window.fcWidget.open({
                    name: "Lynda",
                    replyText: "Hey conversion bear 👋"
                  });
                } else {
                  window.open(
                    "mailto:lynda+honeycomb@conversionbear.com?subject=Hey conversion bear 👋"
                  );
                }
                amplitude.logEvent("click-get_support");
              }}
              primary
            >
              {I18n.t("Get Expert Tips")}
            </Button>
          </div> */}
            
          <Modal
            open={active}
            size="Small"
            onClose={() => {
              this.setState({
                active: false,
                deleteId: null,
                deleteName: ""
              });
            }}
          >
            <Modal.Section>
              <div className="modal-content-delete">
                <p>
                  {I18n.t("Are you sure you want to delete “%{name}”?", {
                    name: this.state.deleteName
                  })}
                  <br /> {I18n.t("you can not undo this action")}
                </p>
                <div className="actions">
                  <Button
                    onClick={() => {
                      this.setState({ active: false });
                      amplitude.logEvent("click-permanent_delete_cancel", {
                        origin: "campaigns_list"
                      });
                    }}
                  >
                    {I18n.t("Cancel")}
                  </Button>
                  <Button
                    onClick={() => {
                      this.deleteCampaign();
                      amplitude.logEvent("click-permanent_delete_approve", {
                        origin: "campaigns_list"
                      });
                    }}
                  >
                    {I18n.t("Delete Campaign")}
                  </Button>
                </div>
              </div>
            </Modal.Section>
          </Modal>
        </div>
        <div style={{height: '40px', width: '100%'}}></div>
          <SpecialOfferBanner
            specialOfferImagePath='../static/images/silver_offer_image.svg'
            title='20% off our Silver plan'
            subtitle='7 day free trial included. Cancel anytime, no strings attached.'
            ctaText='Claim 20% off'
            ctaHref='https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special'
            origin='campaigns_tab'
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
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  setCampaign,
  newNotification,
  hotUpdateCampaign
};

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);
