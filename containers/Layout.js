import { Component } from "react";
import {
  Tabs,
  Page,
  SettingToggle,
  Icon,
  Spinner,
  Button,
  ButtonGroup,
  Banner,
} from "@shopify/polaris";
import { connect } from "react-redux";
import {
  CircleTickMajorMonotone,
  CircleAlertMajorMonotone
} from "@shopify/polaris-icons";
import { I18n } from "react-redux-i18n";
import { findIndex } from "lodash";
import { withRouter } from "next/router";
import Router from "next/router";
import { Context } from "@shopify/app-bridge-react";
import { History } from "@shopify/app-bridge/actions";
import "./Layout.scss";
import {
  getSettings,
  enableShop,
  disableShop,
  getShop,
  getBigBearData,
  getOrdersCount,
} from "../redux/actions";
import OnboardingWizard from "../components/OnboardingWizard";
import AffiliateModal from "../components/AffiliateModal";
import { initializeHotjar } from "../lib/hotjar";
import Cookies from "js-cookie";
import FreshChat from "react-freshchat";
import NoSSR from "react-no-ssr";
import RefToAppModal from '../components/RefToAppModal';
import UpgrateButton from "../components/UpgrateButton";
import UpgrateModal from "../components/UpgrateModal";
import FirstCampaignSuccesModal from '../components/FirstCampaignSuccesModal';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      hasShopInformation: false,
      showAffiliateModal: true,
      showCurrencyModal: false,
      showFirstCampaignCreatedModal: false,
      hasOrders: false,
    };
  }

  static contextType = Context;

  tabs = [
    {
      id: "",
      content: "Dashboard",
      accessibilityLabel: I18n.t("Dashboard"),
      panelID: "dashboard-content"
    },
    {
      id: "campaigns",
      content: "Funnels",
      accessibilityLabel: I18n.t("Campaigns"),
      panelID: "campaigns-content"
    },
    {
      id: "design",
      content: "Design",
      accessibilityLabel: I18n.t("Design"),
      panelID: "design-content"
    },
    {
      id: "advanced",
      content: "Advanced",
      accessibilityLabel: I18n.t("Advanced"),
      panelID: "advanced-content"
    },
    {
      id: 'academy',
      content: I18n.t('Upsell Academy'),
      accessibilityLabel: I18n.t('Upsell Academy'),
      panelID: 'academy-content',
    },
    // {
    //   id: "inspiration",
    //   content: I18n.t("👀 Funnel Inspiration"),
    //   accessibilityLabel: I18n.t("👀 Funnel Inspiration"),
    //   panelID: "inspiration-content"
    // },
    // {
    //   id: 'grow',
    //   content: I18n.t('🌱 Grow your business'),
    //   accessibilityLabel: I18n.t('🌱 Grow your business'),
    //   panelID: 'grow-content',
    // },

    // {
    //   id: "currency",
    //   content: I18n.t("💸 Currency Converter (FREE)"),
    //   accessibilityLabel: I18n.t("💸 Currency Converter (FREE)"),
    //   panelID: "currency-content"
    // },
    // {
    //   id: "salespop",
    //   content: I18n.t("Video Sales Pop (FREE)"),
    //   accessibilityLabel: I18n.t("Video Sales Pop (FREE)"),
    //   panelID: "salespop-content"
    // }*
  ];

  statusToggle = () => {

    if(this.props.overLimit && !this.props.isActive){
      Router.push("/pricing");
      return;
    }

    if (this.props.isActive) {
      this.props.disableShop();
    } else {
      this.props.enableShop();
    }
    amplitude.logEvent("click_enable_disable", {
      value: this.props.isActive ? "disable" : "enable"
    });
  };

  handleTabChange = selectedTabIndex => {
    if (!this.tabs[selectedTabIndex]) {
      return;
    }

    if (this.tabs[selectedTabIndex].id === "currency") {
      window.open(
        "https://apps.shopify.com/auto-multi-currency-converter?utm_source=shopify&utm_campaign=upsellTab"
      );
      this.setState({ showCurrencyModal: true });
      amplitude.logEvent("click-open_currency_tab");
      return;
    }

    if (this.tabs[selectedTabIndex].id === "salespop") {
      window.open(
        "https://apps.shopify.com/video-sales-pop?utm_source=shopify&utm_campaign=salespoptab_upsell"
      );
      // this.setState({ showUpsellModal: true });
      amplitude.logEvent("click-open_salespop_tab");
      return;
    }

    const history = History.create(this.context);
    history.dispatch(History.Action.PUSH, `/${this.tabs[selectedTabIndex].id}`);
    this.props.router.push(`/${this.tabs[selectedTabIndex].id}`);
    // console.log('scroll top');
  };

  async componentDidMount() {
    try {
      
      if (process.browser) {
        amplitude.getInstance().setUserId(`${Cookies.get("shopOrigin")}`);
        amplitude.setUserProperties({ appName: "honeycomb_upsell" });
        // initializeHotjar(1411551, 6);
      }
      const settings = await this.props.getSettings(true);
      await this.props.getShop().then(() => {
        this.setState({ hasShopInformation: true });
        this.props.getBigBearData(this.props.shop.shopInformation.myshopify_domain);
      });
      this.state.loaded = true;
      this.props.getOrdersCount();
      if (!settings.pricingPlan && this.props.router.route !== '/pricing') {
        this.props.router.push('/pricing');
        return;
      }
      this.setState({ loaded: true });

      
    } catch (error) {
      this.setState({ loaded: true });
      console.debug(`Couldn't fetch store details ${error.message}`);
    }
  }

  componentWillReceiveProps(nextProps){    
    if (
      nextProps &&
      nextProps.showFirstCampaignCreatedModal &&
      !this.props.showFirstCampaignCreatedModal 
    ) {
      this.setState({ showFirstCampaignCreatedModal: true });
    }
  }

  render() {
    const { fetchDataError, isActive, router, bar_notice_hidden, overLimit } = this.props;
    const { loaded } = this.state;
    const selected = findIndex(this.tabs, ["id", router.pathname.slice(1)]);

    if (!loaded) {
      return (
        <div
          style={{
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%"
          }}
        >
          <Spinner size="large" color="teal" />
        </div>
      );
    }

    if (['/campaign', '/pricing'].indexOf(router.route) > -1) {
      return this.props.children;
    }

    if (fetchDataError) {
      return (
        <div>
          <p>
            {I18n.t(
              "Looks like we hit a snag Our dev team just got notified about it"
            )}
            <br />{" "}
            {I18n.t(
              "Please contact us at lynda@conversionbear.com for immidate support"
            )}
          </p>
        </div>
      );
    }

    let isAffiliateShop = false;
    let affiliateEmail = "";
    if (
      this.state.hasShopInformation &&
      this.props.shop &&
      this.props.shop.shopInformation
    ) {
      isAffiliateShop = ["affiliate", "partner_test"].includes(
        this.props.shop.shopInformation.plan_name
      );
      affiliateEmail = this.props.shop.shopInformation.email;
    }

    const unlimitedViews = this.props.shop && this.props.shop.unlimitedViews || false;
    return (
      <React.Fragment>
        <UpgrateModal />
        <div className="headerButtonsGroup">
          <ButtonGroup>
            <Button
              external={true}
              url="https://conversionbear.freshdesk.com/support/solutions/folders/48000665614"
              onClick={() => {
                amplitude.logEvent("click-faq");
              }}
            >
              {I18n.t("FAQ")}
            </Button>
            <Button
              external={true}
              url="https://conversionbear.freshdesk.com/support/tickets/new"
              onClick={() => {
                amplitude.logEvent("click-help");
              }}
            >
              {I18n.t("Help")}
            </Button>
            {isAffiliateShop && (
              <Button
                external={true}
                url="https://www.conversionbear.com/partners"
                onClick={() => {
                  amplitude.logEvent("click_partners");
                }}
              >
                {I18n.t("🤑 Partners Program")}
              </Button>
            )}
          </ButtonGroup>
          {!unlimitedViews && <UpgrateButton />}
          {/* <LanguagePicker
            onChangeLocale={this.props.onChangeLocale}
            locale={this.props.locale}
            /> */}
        </div>
        <div className="notFullWidthHr"></div>
        <Page>
          {!bar_notice_hidden && <OnboardingWizard />}

          {/* premium plans notice banner
          {this.state.hasShopInformation &&
            this.props.shop &&
            this.props.shop.shopStatus &&
            ["veteran", "early"].includes(this.props.shop.shopStatus) &&
            !localStorage.getItem("dismissed_premium_notice") &&
            !this.state.hidePremiumBanner && (
              <Banner
                title={
                  this.props.shop.shopStatus === "veteran"
                    ? I18n.t(
                        "Important notice regarding your Honeycomb account"
                      )
                    : I18n.t("Claim your early adopter subscription")
                }
                status="info"
                onDismiss={() => {
                  this.setState({ hidePremiumBanner: true });
                  localStorage.setItem("dismissed_premium_notice", "true");
                }}
                action={{
                  content: "See Details",
                  onAction: () => {
                    amplitude.logEvent("click-promo_banner_see_details");
                  },
                  external: true,
                  url:
                    this.props.shop.shopStatus === "veteran"
                      ? "https://www.conversionbear.com/solutions/honeycomb-veteran-partners"
                      : "https://www.conversionbear.com/solutions/honeycomb-new-partners",
                }}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      this.props.shop.shopStatus === "veteran"
                        ? "Valued partner, <br>Starting <strong>May 22nd</strong> Honeycomb will introduce pricing plans. <br>Claim your partner subscription and get all the details below."
                        : "Hi,<br>Starting <strong>May 22nd</strong> Honeycomb will introduce pricing plans.<br>Claim an early adopter subscription and get all the details below.",
                  }}
                ></p>
              </Banner>
            )} */}

          <div className="headerMainToggleButton">
            <SettingToggle
              action={{
                primary: true,
                content: isActive ? I18n.t("Disable") : overLimit ? I18n.t("Upgrade to Enable") : I18n.t("Enable"),
                onAction: this.statusToggle
              }}
              enabled={isActive}
            >
              <div className="SettingToggle_Title">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {isActive ? (
                    <Icon source={CircleTickMajorMonotone} />
                  ) : (
                    <Icon source={CircleAlertMajorMonotone} />
                  )}
                </div>
                {I18n.t("Honeycomb Upsell Funnels is")}{" "}
                <b className={isActive ? "green" : "red"}>
                  {isActive ? I18n.t("enabled") : I18n.t("disabled")}
                </b>
              </div>

              {!isActive && (
                <div className="SettingToggle_Description">
                  {I18n.t("Click Enable to add Ultimate Upsell to your store")}
                </div>
              )}
            </SettingToggle>
          </div>
        </Page>
        {/* <NoSSR>
          {this.state.hasShopInformation &&
            this.props.shop &&
            this.props.shop.shopInformation &&
            this.props.shop.shopInformation.plan_name !== "trial" && (
              <FreshChat
                token="d8dad34b-6ddb-43b8-922e-65d42473698a"
                siteId="Honeycomb Upsell"
                config={{
                  cssNames: {
                    widget: "customFreshChatCss",
                    modal: "customModalCss",
                  },
                }}
                onInit={(widget) => {
                  widget.on("widget:opened", function (resp) {
                    amplitude.logEvent("chat_box_opened");
                  });
                  window.fcWidget.on("message:sent", function (resp) {
                    amplitude.logEvent("chat_message_sent");
                  });
                  window.fcWidget.on("message:recieved", function (resp) {
                    amplitude.logEvent("chat_message_recieved");
                  });
                  const shopInformation = this.props.shop.shopInformation;
                  if (shopInformation) {
                    widget.user.setProperties({
                      email: shopInformation.email || null,
                      firstName: shopInformation.shop_owner || null,
                      shop_name: shopInformation.name || null,
                      store_url: shopInformation.domain || null,
                      store_created_at: shopInformation.created_at || null,
                      shopify_plan: shopInformation.plan_name || null,
                      shopStatus: this.props.shop.shopStatus || null,
                    });
                  }
                }}
              />
            )}
        </NoSSR> */}
        <Tabs
          tabs={this.tabs}
          selected={selected}
          onSelect={this.handleTabChange}
        >
          {this.props.children}
        </Tabs>

        {/* <AffiliateModal
          isOpen={
            isAffiliateShop &&
            !localStorage.affiliateModalShown &&
            this.state.showAffiliateModal
          }
          email={affiliateEmail}
          subscribedToMailingList={false}
          onRequestClose={() => {
            this.setState({ showAffiliateModal: false });
            localStorage.affiliateModalShown = true;
            window.scrollTo(0, 0);
          }}
        /> */}
        <RefToAppModal
          isOpen={this.state.showCurrencyModal}
          onRequestClose={() => {
            this.setState({ showCurrencyModal: false });
            window.scrollTo(0, 0);
          }}
        />
        <FirstCampaignSuccesModal
          isOpen={this.state.showFirstCampaignCreatedModal}
          closeTimeoutMS={500}
          onRequestClose={() => {
            this.setState({ showFirstCampaignCreatedModal: false });
            window.scrollTo(0, 0);
          }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isActive: state.status.isActive || false,
  loaded: state.status.loaded || false,
  overLimit: state.settings && state.settings.data && state.settings.data.overLimit || false,
  shop: state.shop || null,
  bar_notice_hidden:
    state.settings.data && state.settings.data.bar_notice_hidden
      ? state.settings.data.bar_notice_hidden
      : false,
});

const mapDispatchToProps = {
  getSettings,
  enableShop,
  disableShop,
  getShop,
  getBigBearData,
  getOrdersCount,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
