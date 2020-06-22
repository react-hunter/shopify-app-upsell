import React, { Component } from "react";
import { Layout, Button } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import { connect } from "react-redux";
import { reduxForm, formValueSelector } from "redux-form";
import { isEqual } from "lodash";
import { setSettings } from "../redux/actions";
import UpsellPage from "../containers/Design/UpsellPage";
import TopBar from "../containers/Design/TopBar";
import BarPreview from "../containers/BarPreview";
import CountdownTimer from "../containers/Design/CountdownTimer";
import Price from "../containers/Design/Price";
import Product from "../containers/Design/Product";
import MinimizedView from "../containers/Design/MinimizedView";
import QuickThemes from "../containers/Design/QuickThemes";
import BoostMobileSales from "../components/BoostMobileSales";

// import RefToAppCard from "../components/RefToAppCard/RefToAppCard";
// import RefToAppBottomBanner from "../components/RefToAppBottomBanner";
import SpecialOfferBanner from "../components/SpecialOfferBanner";
import SpecialOfferCard from "../components/SpecialOfferCard";

class Design extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false,
      free_shipping: false,
      pageToShow: 'cart_page'
    };
    this.defaultScrolY = window.scrollY;
  }

  setMinimized = status => {
    this.setState({ minimized: status });
  };

  setFreeShipping = status => {
    this.setState({ free_shipping: status });
  };

  handleSave = values => {
    this.props.setSettings(values);
    amplitude.logEvent("click-design_save");
  };

  componentDidMount() {
    if (process.browser) {
      window.scrollTo(0, this.defaultScrolY);
      const { initialValues } = this.props;
      localStorage.setItem("upsellShopSettings", JSON.stringify(initialValues));
      localStorage.setItem("upsellShopSettingsTitle", I18n.t(""));
      localStorage.setItem(
        "upsellShopSettingsDescription",
        I18n.t("This is a thank you (order summary) page simulation")
      );
      localStorage.removeItem("upsellCampaing");
      localStorage.removeItem("upsellCampaingTitle");
      localStorage.removeItem("upsellCampaingDescription");
      amplitude.logEvent("page_load", { value: "design" });
    }
  }

  changePageShow = (page) => {
    this.setState({pageToShow: page})
  }

  render() {
    const {
      returnForm,
      handleSubmit,
      initialValues,
      saving,
      display_saved_notice
    } = this.props;
    const { minimized, free_shipping, pageToShow } = this.state;
    const disabledButton = isEqual(initialValues, returnForm);

    return (
      <div className="tab-design">
        <Layout>
          <div className="col-1">
            <QuickThemes {...this.props} />
            <UpsellPage {...this.props} />
            <TopBar {...this.props} />
            <SpecialOfferCard/>
            <CountdownTimer {...this.props} />
            <Price {...this.props} setFreeShipping={this.setFreeShipping} />

            {/* CURRENCY */}
            {/* <RefToAppCard
            labelImageSrc={`../static/images/currency_limited_time_offer_badge.svg`} 
            title={I18n.t('Get our new currency app for FREE  🎉')} 
            appLogoSrc={`../static/images/currency_logo_on_card.svg`} 
            description={I18n.t(`Show prices in customers local currency automatically 100% FREE!`)}
            appUrl={`https://apps.shopify.com/auto-multi-currency-converter?utm_source=honeycomb&utm_medium=design_settings_card&utm_campaign=new`}
            appName={`Auto Multi Currency Converter`}
            titleColor='#FF018C'
            /> */}
            {/* STICKY */}
            <BoostMobileSales {...this.props} />
            <Product {...this.props} changePageShow={this.changePageShow} />
            <MinimizedView
              {...this.props}
              setMinimized={this.setMinimized}
              minimized={minimized}
            />
          </div>
          <div className="col-2">
            <BarPreview
              settings={returnForm}
              minimized={minimized}
              free_shipping={free_shipping}
              pageToShow={pageToShow}
            />
          </div>
          <div className="fixed-action-bottom">
            <Button
              primary={!display_saved_notice}
              disabled={disabledButton}
              onClick={handleSubmit(this.handleSave.bind(this))}
              loading={saving}
            >
              {display_saved_notice ? I18n.t("Saved!") : I18n.t("Save")}
            </Button>
          </div>
        </Layout>
        {/* STICKY */}
        {/* <RefToAppBottomBanner
            logoPath={require("../static/images/sticky_logo_bottom_banner.svg")}
            title={I18n.t("Ultimate Sticky Add to Cart")}
            description={`“I saw an overall increase in conversions and 3 sales I can<br/> attribute to this application within just hours!”`}
            appPageUrl={`https://apps.shopify.com/ultimate-sticky-add-to-cart?utm_source=honeycomb&utm_medium=design_settings&utm_campaign=new`}
          /> */}

        {/* CURRENCY
        <RefToAppBottomBanner
            logoPath={require("../static/images/currency_logo_bottom_banner.svg")}
            title={I18n.t("Auto Multi Currency Converter")}
            description={I18n.t(`currency_review`)}
            appPageUrl={`https://apps.shopify.com/auto-multi-currency-converter?utm_source=honeycomb&utm_medium=design_settings&utm_campaign=new`}
          /> */}
                {/* SALESPOP */}
        {/* <RefToAppBottomBanner
        logoPath="../static/images/salespop_logo_bottom_banner.svg"
        title={I18n.t('Magic Video Sales Pop FREE!')}
        description={`“Perfect sales pop app. Automated product videos are a game changer."`}
        appPageUrl={`https://apps.shopify.com/video-sales-pop?utm_source=shopify&utm_campaign=salespopBottomBanner`}
        /> */}
        <SpecialOfferBanner
          specialOfferImagePath='../static/images/silver_offer_image.svg'
          title='20% off our Silver plan'
          subtitle='7 day free trial included. Cancel anytime, no strings attached.'
          ctaText='Claim 20% off'
          ctaHref='https://upsell.conversionbear.com/default/redeem?code=honeycomb-silver-special'
          origin='design_tab'
          />
          <div style={{height: '77px', width: '100%'}}></div>
      </div>
    );
  }
}

const selector = formValueSelector("design");

const DesignFrom = reduxForm({
  form: "design",
  enableReinitialize: true,
  onChange: values => {
    localStorage.setItem("upsellShopSettings", JSON.stringify(values));
  }
})(Design);

const mapStateToProps = state => ({
  initialValues: state.settings.data || {},
  saving: state.settings.saving || false,
  show_description: selector(state, "design.theme.product.show_description"),
  show_quantity: selector(state, "design.theme.product.show_quantity"),
  display_saved_notice: state.settings.display_saved_notice || false,
  returnForm:
    (state.form && state.form.design && state.form.design.values) || {}
});


const mapDispatchToProps = {
  setSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(DesignFrom);
