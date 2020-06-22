import React, { Component } from 'react';
import Mobile from './components/Mobile';
import GlobalStyle from './GlobalStyle';
import isOutOfStock from '../../lib/isOutOfStock';
import currencies from '../../redux/currencies';

class WidgetComponent extends Component {
  constructor(props) {
    super(props);
    let currency_variant = {};
    const tmp_variants = props.campaign ? props.campaign.offers[0].product.variants : [];
    tmp_variants.some((variant) => {
      if (!isOutOfStock(variant)) {
        currency_variant = variant;
        return true;
      }
      return false;
    });


    let currecy_format = '${{amount}}';


    if (props.settings && props.settings.default_money_format) {
      currecy_format = props.settings.default_money_format;
    }

    if (props.currency && props.settings && props.currency != props.settings.default_currency && currencies[props.currency]) {
      currecy_format = currencies[props.currency].money_format;
    }


    this.state = {
      active_offer: 0,
      history_offer: 0,
      currecy_format,
      data: {
        campaign_id: props.campaign._id || '',
        offers: props.isPreview ? [1] : [],
      },
      variant: currency_variant,
      initialVariant: currency_variant,
      moneyFormatForce: '',
      quantity: 1,
      maxTime: this._getSeconds(),
      startTime: new Date().getTime(),
      minimized: props.minimized,
      hideCountDownTimerItems: {},
      hideGoToCheckout: false,
    };

    this.state.variant = this.getVariantCurrency(currency_variant);

    if (props.campaign && props.campaign.offers) {
      props.campaign.offers.forEach((offer, index) => {
        this.state.hideCountDownTimerItems[`offer_${index}`] = false;
      });
    }
    
    if (typeof props.active_offer_force != undefined && props.campaign && props.campaign.offers.length-1 >= props.active_offer_force) {
      this.state.variant = this.getVariantCurrency(props.campaign ? props.campaign.offers[props.active_offer_force].product.variants[0] : {});
      this.state.active_offer = props.active_offer_force;
      this.state.history_offer = props.active_offer_force;
      this.state.initialVariant = props.campaign ? props.campaign.offers[props.active_offer_force].product.variants[0] : {};
    }

  }

  currencyChange = (amount) => {
    let result = amount;
    if(window && window.conversionBearAutoCurrencyConverter && window.conversionBearAutoCurrencyConverter.convert){
      let data = window.conversionBearAutoCurrencyConverter.convert(amount,"{{amount_no_formatting}}");
      result = data.amount;
      this.state.moneyFormatForce = data.default_format;
    }
    return result;
  }


  getVariantCurrency = (variant) => {
    let tpm = {...variant};
    if(tpm.price){
      tpm.price = this.currencyChange(tpm.price)
    }
    if(tpm.compare_at_price){
      tpm.compare_at_price = this.currencyChange(tpm.compare_at_price)
    }
    return tpm;
  }

  componentWillReceiveProps(nextProps) {
    const {active_offer} = this.state;

    if(nextProps.isCampaign){
      this.setState({
        variant: nextProps.campaign && nextProps.campaign.offers && nextProps.campaign.offers[active_offer] ? nextProps.campaign.offers[active_offer].product.variants[0] : {},
      }, () => {
        if(typeof nextProps.active_offer_force != undefined){
          this.goToOffer(nextProps.active_offer_force)
        }
      })
    }

    if (nextProps.isPreview) {
      const { settings } = nextProps;
      const { countdown_timer } = settings && settings.design && settings.design.theme || {};

      let seconds = 0;
      if (Array.isArray(countdown_timer.start_countdown_from)) {

        const seconds0 = !isNaN(parseFloat(countdown_timer.start_countdown_from[0])) ? parseFloat(countdown_timer.start_countdown_from[0]) * 600 : 0;
        const seconds1 = !isNaN(parseFloat(countdown_timer.start_countdown_from[1])) ? parseFloat(countdown_timer.start_countdown_from[1]) * 60 : 0;
        const seconds2 = !isNaN(parseFloat(countdown_timer.start_countdown_from[2])) ? parseFloat(countdown_timer.start_countdown_from[2]) * 10 : 0;
        const seconds3 = !isNaN(parseFloat(countdown_timer.start_countdown_from[3])) ? parseFloat(countdown_timer.start_countdown_from[3]) : 0;

        seconds = seconds0 + seconds1 + seconds2 + seconds3;
      }


      this.setState({
        minimized: nextProps.minimized,
        maxTime: seconds,
      });
    } else {
      this.setState({
        minimized: nextProps.minimized,
      });
    }
  }

  componentDidMount() {
    const { conversionBearUpsell, appEvent } = this.props;

    if (conversionBearUpsell && conversionBearUpsell.onLoaded && typeof conversionBearUpsell.onLoaded === 'function') {
      conversionBearUpsell.onLoaded();
    }

    if(appEvent){
      appEvent.listen('conversionBearAutoCurrencyConverter:updated', (data) => {
        this.setState({variant: this.getVariantCurrency(this.state.initialVariant)});
      })
    }
  }

  _getSeconds = () => {
    const { settings } = this.props;
    const { countdown_timer } = settings && settings.design && settings.design.theme || {};

    let seconds = 0;
    if (Array.isArray(countdown_timer.start_countdown_from)) {
      const seconds0 = !isNaN(parseFloat(countdown_timer.start_countdown_from[0])) ? parseFloat(countdown_timer.start_countdown_from[0]) * 600 : 0;
      const seconds1 = !isNaN(parseFloat(countdown_timer.start_countdown_from[1])) ? parseFloat(countdown_timer.start_countdown_from[1]) * 60 : 0;
      const seconds2 = !isNaN(parseFloat(countdown_timer.start_countdown_from[2])) ? parseFloat(countdown_timer.start_countdown_from[2]) * 10 : 0;
      const seconds3 = !isNaN(parseFloat(countdown_timer.start_countdown_from[3])) ? parseFloat(countdown_timer.start_countdown_from[3]) : 0;

      seconds = seconds0 + seconds1 + seconds2 + seconds3;
    }
    return seconds;
  };

  goToOffer = (step) => {
    const { campaign, isPreview, getHeight } = this.props;
    const { history_offer } = this.state;
    if (isPreview) {
      return;
    }

    let variant = {};
    const tmp_variants = (campaign && campaign.offers && campaign.offers[step]) ? campaign.offers[step].product.variants : [];
    tmp_variants.some((item) => {
      if (!isOutOfStock(item)) {
        variant = item;
        return true;
      }
      return false;
    });


    this.setState({
      active_offer: step,
      history_offer: history_offer < step + 1 ? step : history_offer,
      startTime: new Date().getTime(),
      quantity: 1,
      variant: this.getVariantCurrency(variant),
      initialVariant: variant,
    }, () => {
      if (getHeight) {
        getHeight();
      }
    });
  };

  nextOffer = () => {
    const { campaign, isPreview, getHeight } = this.props;
    const { hideCountDownTimerItems } = this.state;
    if (isPreview) {
      return;
    }

    const { active_offer, history_offer } = this.state;
    if (campaign.offers.length <= active_offer + 1) {
      if (history_offer !== 4) {
        this.setState({ history_offer: 4 }, () => {
          if (getHeight) {
            getHeight();
          }
        });
      }
      return null;
    }

    if (campaign.offers.length - 1 > active_offer) {
      hideCountDownTimerItems[`offer_${active_offer}`] = true;
    }

    let variant = {};
    const tmp_variants = campaign ? campaign.offers[this.state.active_offer + 1].product.variants : [];
    tmp_variants.some((item) => {
      if (!isOutOfStock(item)) {
        variant = item;
        return true;
      }
      return false;
    });
    this.setState({
      active_offer: this.state.active_offer + 1,
      history_offer: history_offer < active_offer + 1 ? active_offer + 1 : history_offer,
      startTime: new Date().getTime(),
      quantity: 1,
      variant: this.getVariantCurrency(variant),
      initialVariant: variant,
      hideCountDownTimerItems,
    }, () => {
      if (getHeight) {
        getHeight();
      }
    });
  };

  prevOffer = () => {
    const { campaign, isPreview, getHeight } = this.props;
    const { active_offer } = this.state;
    if (isPreview) {
      return;
    }
    if (active_offer <= 0) {
      return null;
    }

    let variant = {};
    const tmp_variants = campaign ? campaign.offers[this.state.active_offer - 1].product.variants : [];
    tmp_variants.some((item) => {
      if (!isOutOfStock(item)) {
        variant = item;
        return true;
      }
      return false;
    });

    this.setState({
      active_offer: this.state.active_offer - 1,
      startTime: new Date().getTime(),
      variant: this.getVariantCurrency(variant),
      initialVariant: variant,
      quantity: 1,
    }, () => {
      if (getHeight) {
        getHeight();
      }
    });
  };

  setMinimized = (status) => {
    const { setMinimized } = this.props;
    if (setMinimized) {
      setMinimized(status);
      return;
    }
    this.setState({
      minimized: status,
    });
  };

  addOffer = () => {

    const { isPreview, isDemo, campaign, settings } = this.props;
    if (isPreview) {
      return;
    }
    const { data, quantity, initialVariant, active_offer, currecy_format } = this.state;

    const variant = initialVariant;

    if (
      this.props.settings.advanced.facebook_pixel_id ||
      this.props.settings.advanced.pinterest_tag_id ||
      this.props.settings.advanced.google_analytics_id ||
      this.props.settings.advanced.snapchat_pixel_id
    ) {
      const price = variant.price;
      const currency = settings.default_currency || 'USD';


      if(window.fbq){
        window.fbq('track', 'AddToCart', {
          content_name: campaign.offers[active_offer].product.title,
          content_ids: [variant.product_id, variant.id],
          content_type: 'product',
          value: price,
          currency,
        });
      } else if (this.props.settings.advanced.facebook_pixel_id && this.props.ReactPixel && this.props.ReactPixel.fbq) {
        this.props.ReactPixel.fbq('track', 'AddToCart', {
          content_name: campaign.offers[active_offer].product.title,
          content_ids: [variant.product_id, variant.id],
          content_type: 'product',
          value: price,
          currency,
        });
      }

      if (this.props.settings.advanced.snapchat_pixel_id && this.props.ReactSnapchat && this.props.ReactSnapchat.snaptr) {
        this.props.ReactSnapchat.snaptr('track', 'ADD_CART', {
          item_ids: [variant.product_id, variant.id],
          price,
          currency,
        });
      }

      if (this.props.settings.advanced.google_analytics_id && this.props.ReactGA && this.props.ReactGA.ga) {
        const ga = this.props.ReactGA.ga();
        ga('ec:addProduct', {
          id: variant.product_id,
          name: campaign.offers[active_offer].product.title,
          variant: variant.id,
          price,
          quantity,
        });
        ga('ec:setAction', 'add');
        ga('send', 'event', 'UX', 'click', 'add to cart');
      }

      if (this.props.settings.advanced.pinterest_tag_id && this.props.ReactPinterest && this.props.ReactPinterest.addToCart) {
        this.props.ReactPinterest.addToCart({
          value: price,
          order_quantity: quantity,
          currency,
        });
      }

    }


    this.setState({
      data: {
        campaign_id: data.campaign_id,
        offers: [
          ...data.offers,
          isDemo ? {
            ...variant,
            product_id: variant.product_id,
            variant_id: variant.id,
            active_offer,
            quantity,
            price: currecy_format.replace(/\{\{.*?\}\}/, variant.price).replace(/<[^>]*>/g, ''),
            product_image: campaign.offers[active_offer].product.images[0].src,
            title: campaign.offers[active_offer].product.title,
            isOneVariant: campaign.offers[active_offer].product.variants.length === 1,
          } : {
            product_id: variant.product_id,
            variant_id: variant.id,
            active_offer,
            quantity,
          },
        ],
      },
    }, () => {
      if (active_offer === campaign.offers.length - 1) {
        this.goToCheckout();
      } else {
        this.nextOffer();
      }
    });
  };

  onChangeVariant = (variant) => {
    this.setState({ variant: this.getVariantCurrency(variant), initialVariant: variant });
  };

  onChangeQuantity = (quantity) => {

    const { campaign } = this.props;
    const { active_offer } = this.state;

    const offer = campaign.offers[active_offer];

    if (offer.limit_products && quantity > offer.limit_products_amount) {
      return null;
    }

    this.setState({ quantity });
  };

  goToCheckout = () => {
    const { goToCheckout } = this.props;

    if (goToCheckout && typeof goToCheckout === 'function') {
      goToCheckout(this.state.data);
    }
  };

  setItemHideCountDownTimer = (item, value) => {
    const { hideCountDownTimerItems } = this.state;
    const { getHeight } = this.props;
    hideCountDownTimerItems[item] = value;
    this.setState({ hideCountDownTimerItems }, () => {
      if (getHeight) {
        getHeight();
      }
    });
  };

  setHideGoToCheckout = (status) => {
    this.setState({ hideGoToCheckout: status });
  };

  render() {
    const { settings, campaign, isMobile, isPreview, setCountDownTimerAnimate, containerHeight, pageToShow } = this.props;
    const { active_offer, currecy_format, data, variant, quantity, moneyFormatForce, minimized, history_offer, hideCountDownTimerItems, hideGoToCheckout } = this.state;

    const settings_theme = settings && settings.design && settings.design.theme || {};

    const offer = campaign.offers[active_offer];

    let page_to_show = 'thankyou_page';

    if(pageToShow){
      page_to_show = pageToShow;
    } else {
      page_to_show = campaign.page_to_show;
    }

    return (<React.Fragment>
      <GlobalStyle />
      <Mobile
        isPreview={isPreview}
        settings_theme={settings_theme}
        campaign={campaign}
        offer={offer}
        active_offer={active_offer}
        currecy_format={moneyFormatForce || currecy_format}
        data={data}
        goToCheckout={this.goToCheckout}
        variant={variant}
        quantity={quantity}
        onChangeVariant={this.onChangeVariant}
        onChangeQuantity={this.onChangeQuantity}
        nextOffer={this.nextOffer}
        addOffer={this.addOffer}
        prevOffer={this.prevOffer}
        maxTime={this.state.maxTime}
        startTime={this.state.startTime}
        minimized={minimized}
        setMinimized={this.setMinimized}
        isMobile={isMobile}
        history_offer={history_offer}
        goToOffer={this.goToOffer}
        hideCountDownTimerItems={hideCountDownTimerItems}
        setItemHideCountDownTimer={this.setItemHideCountDownTimer}
        setCountDownTimerAnimate={setCountDownTimerAnimate}
        containerHeight={containerHeight}
        hideGoToCheckout={hideGoToCheckout}
        setHideGoToCheckout={this.setHideGoToCheckout}
        pageToShow={page_to_show}
      />
    </React.Fragment>);
  }
}

export default WidgetComponent;
