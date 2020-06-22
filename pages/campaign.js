/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react";
import { I18n } from "react-redux-i18n";
import { connect } from "react-redux";
import { Button, Icon, Modal } from "@shopify/polaris";
import { ChevronLeftMinor } from "@shopify/polaris-icons";
import Router from "next/router";
import { reduxForm, Field, isInvalid, formValueSelector } from "redux-form";
import { required, length } from "redux-form-validators";
import { isEqual } from "lodash";
import TextInput from "../components/Fields/TextInput";
import {
  createCampaign,
  updateCampaign,
  newNotification,
  setSettings,
} from "../redux/actions";
import SetCampaignTrigger from "../containers/Capmpaign/SetCampaignTrigger";
import AddUpsellOffers from "../containers/Capmpaign/AddUpsellOffers";
import AdvancedSettings from "../containers/Capmpaign/AdvancedSettings";
import SmartCampaignWizard from "../containers/Capmpaign/SmartCampaignWizard";
import StepByStepGuide from "../containers/Capmpaign/StepByStepGuide";
import ErrorBlock from "../containers/Capmpaign/ErrorBlock";
import PageToShop from "../containers/Capmpaign/PageToShop";
// import ActionAcceptOffer from "../containers/Capmpaign/ActionAcceptOffer";
import BarPreview from "../containers/Capmpaign/BarPreview";

class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saved: true,
      isActive: false,
      isSubmit: false,
      requestedToPreview: false,
      showUnsavedChangesModal: false,
    };
    // this.defaultScrolY = window.scrollY;
    this.refElementScrollTrigger = React.createRef();
  }

  async componentDidMount() {
    if (process.browser) {
      localStorage.removeItem("upsellShopSettings");
      localStorage.setItem(
        "upsellCampaing",
        JSON.stringify(this.props.initialValues)
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
      window.scrollTo(0, 0);
      amplitude.logEvent("page_load", { value: "campaign" });

      if(window.fcWidget){
        window.fcWidget.hide();
        window.fcWidget.track('new_funnel');
      }
    }
  }

  async handleSave(values) {
    const { settings } = this.props;
    try {
      if (this.state.isActive) {
        values.isActive = this.state.isActive;
      }
      this.setState({ saved: false });
      if (values._id) {
        await this.props.updateCampaign(values);
        this.props.newNotification("Funnel saved");
      } else {
        await this.props.createCampaign(values);

        if (!settings.is_created_first_campaign) {
          this.props.setSettings({ is_created_first_campaign: true });
          if (window.fcWidget) {
            window.fcWidget.track('created_first_funnel');
          }
          //trigger first draft order modal
          this.props.showModal('first-campaign');
        }

        if (this.state.isActive) {
          this.props.newNotification("Funnel activated");
        } else {
          this.props.newNotification("Funnel saved");
        }
      }
      this.setState({ saved: true });
      Router.push("/campaigns");      
    } catch (error) {
      console.log("TCL: Campaign -> handleSave -> error", error);
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("upsellCampaing");
    if(window.fcWidget){
      window.fcWidget.show();
    }
  }

  render() {
    const { handleSubmit, initialValues, formValues, settings, hasOrders } = this.props;
    const { saved, showUnsavedChangesModal } = this.state;
    let isCreate = true;
    let disabled = false;
    if (initialValues._id) {
      isCreate = false;
      disabled = isEqual(initialValues, formValues);
    }

    if(!formValues.page_to_show){
      if(formValues.page_to_show && formValues.page_to_show == 'thankyou_page'){
        disabled = false;
      } else {
        disabled = true;
      }
    }

    return (
      <div className="Campaign">
        <div className="block-setting">
          <div
            className="margin-bottom"
            style={{paddingTop: "3.8rem" }}
          >
            <div
              className="padding-horizontal margin-bottom back"
              onClick={() => {
                amplitude.logEvent("click-back_to_campaigns");
                if(!disabled){
                  this.setState({showUnsavedChangesModal: true});
                } else {
                  this.setState({},()=>{
                    Router.push("/campaigns");
                  })
                }
              }}
            >
              <div>
                <Icon source={ChevronLeftMinor} color="inkLighter" />
              </div>
              {I18n.t("Back to Campaigns")}
            </div>

            <h1 className="padding-horizontal margin-bottom">
              {initialValues._id
                ? I18n.t("Edit Funnel")
                : I18n.t("New Funnel")}
            </h1>
            <p className="padding-horizontal margin-bottom">
              {initialValues._id
                ? I18n.t(
                    "Edit your upsell product funnel"
                  )
                : I18n.t(
                    "Create a new upsell product funnel"
                  )}
            </p>
            
            <div className="padding-horizontal create-new-actions">
              {/* <Link
                onClick={() => {
                  if (window.fcWidget) {
                    window.fcWidget.open({
                      name: "Lynda",
                      replyText:
                        "Hey conversion bear can you help me setup the app?"
                    });
                  } else {
                    window.open(
                      "mailto:lynda+honeycomb@conversionbear.com?subject=Hey conversion bear can you help me setup the app?"
                    );
                  }
                  amplitude.logEvent("click-open_concierge_setup_funnel");
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={require("../static/images/concierge_setup.svg")}
                    alt=""
                  />
                  <span style={{ marginLeft: "0.9rem" }}>
                    {I18n.t("Concierge Setup")}
                  </span>
                </div>
              </Link> */}
              
              {hasOrders && <SmartCampaignWizard {...this.props} />}
              <StepByStepGuide />
            </div>
          </div>
          <hr className="margin-bottom"></hr>
          <h2 className="padding-horizontal margin-bottom Polaris-Heading">
            {I18n.t("Campaign name")}
          </h2>
          <p className="padding-horizontal margin-bottom">
            {I18n.t("This name will not be displayed to your buyer")}
          </p>
          <Field
            name="name"
            className="margin-bottom padding-horizontal input-name"
            component={TextInput}
            label=""
            inputProps={{
              maxLength: 40
            }}
            validate={[
              required({ message: I18n.t("Please enter a campaign name") }),
              length({ max: 40 })
            ]}
            eventName="click-campaign_name_text"
            spellCheck
          />
          <PageToShop {...this.props} isCreate={isCreate} refElementScrollTrigger={this.refElementScrollTrigger} />
          {((isCreate && (formValues.page_to_show)) || !isCreate) && <React.Fragment>
            <hr className="margin-bottom" ref={this.refElementScrollTrigger} />
            <SetCampaignTrigger {...this.props} />
            <AddUpsellOffers {...this.props} />
            {/* <ActionAcceptOffer {...this.props}/> */}
            <hr className="margin-bottom"></hr>
            <AdvancedSettings {...this.props} />
          </React.Fragment>}
          <ErrorBlock isSubmit={this.state.isSubmit} isPreview={this.state.requestedToPreview} />
          <div className="footer-actions">
            <div className="btn-cancel">
              <Button
                onClick={() => {
                  amplitude.logEvent("click-campaign_cancel");
                  if(!disabled){
                    this.setState({showUnsavedChangesModal: true});
                  } else {
                    this.setState({},()=>{
                      Router.push("/campaigns");
                    })
                  }
                }}
              >
                {I18n.t("Cancel")}
              </Button>
            </div>
            <div className="btn-actions">
              {initialValues._id ? 
              <Button
                disabled={!saved || disabled}
                onClick={() => {
                  this.state.isActive = false;
                  this.setState({ isSubmit: true }, () => {
                    setTimeout(() => {
                      this.setState({ isSubmit: false });
                    }, 1000);
                  });
                    handleSubmit(this.handleSave.bind(this))();
                    amplitude.logEvent("click-campaign_save",{funnel_type: this.props.funnel_type});
                  
                }}
                primary
                size="medium"
              >
                {I18n.t("Save")}
              </Button>
  :
              <Button
                disabled={!saved || disabled}
                onClick={() => {
                  this.state.isActive = true;
                  this.setState({ isSubmit: true }, () => {
                    setTimeout(() => {
                      this.setState({ isSubmit: false });
                    }, 1000);
                  });
                  handleSubmit(this.handleSave.bind(this))();
                  amplitude.logEvent("click-campaign_save_and_activate",{funnel_type: this.props.funnel_type});
                }}
                primary
                size="medium"
              >
                {I18n.t("Save & Activate")}
              </Button>
              }
            </div>
          </div>
          <Modal
            open={showUnsavedChangesModal && !disabled}
            size="Small"
            onClose={()=>{
              this.setState({showUnsavedChangesModal: false});
            }}
          >
            <Modal.Section>
              <div className="modal-content-delete">
                <p>
                {I18n.t("You have unsaved changes")}
                  <br /> {I18n.t("If you leave this page, all unsaved changes will be lost")}
                </p>
                <div className="actions"p>
                  <Button
                    onClick={() => {
                      this.setState({
                        showUnsavedChangesModal: false,
                      });
                      amplitude.logEvent("click-cancel_leave_unsaved_funnel");
                    }}
                  >
                    {I18n.t("Cancel")}
                  </Button>
                  <Button
                    onClick={() => {
                      this.setState({});
                      Router.push("/campaigns");
                      amplitude.logEvent("click-leave_page_unsaved_funnel");
                    }}
                  >
                    {I18n.t("Leave Page")}
                  </Button>
                </div>
              </div>
            </Modal.Section>
          </Modal>
        </div>
        <div className="block-preview">
          { Object.keys(settings).length > 0 && !showUnsavedChangesModal && <BarPreview campaign={formValues} settings={settings} />}
        </div>
      </div>
    );
  }
}
//
const CampaignFrom = reduxForm({
  form: "campaign",
  enableReinitialize: true,
  onChange: values => {
    localStorage.setItem("upsellCampaing", JSON.stringify(values));
  }
})(Campaign);
const selector = formValueSelector('campaign');
const mapStateToProps = state => ({
  initialValues: state.campaign.item || {},
  settings: state.settings.data || {},
  formValues:
    state.form && state.form.campaign ? state.form.campaign.values : {},
  default_money_format:
    state.settings.data && state.settings.data.default_money_format
      ? state.settings.data.default_money_format
      : "$",
      invalid: isInvalid('campaign')(state),
    funnel_type: selector(state, 'page_to_show') || null,
    hasOrders: state.status.hasOrders || false,
});

const mapDispatchToProps = {
  createCampaign,
  updateCampaign,
  newNotification,
  setSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignFrom);
