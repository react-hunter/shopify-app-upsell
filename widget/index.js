/* global Shopify */
import React from "react";
import ReactDOM from "react-dom";
import ReactPixel from "react-facebook-pixel";
import ReactSnapchat from "react-snapchat-pixel";
import ReactGA from "react-ga";
import ReactPinterest from "../lib/Pinterest";
import demoCampaign from "../static/campaign.json";
import WidgetContainer from "./WidgetContainer";
import "./style.scss";
import MyEventListenerApp from "../lib/MyEventListenerApp";
import initRechargeIntegration from "../lib/integrations/initRechargeIntegration";
import isEqual from 'lodash.isequal';
import ErrorBoundary from "./ErrorBoundary";

const url = "{{__URL__}}";
const shop = "{{__SHOP__}}";
const elementId = "cb-upsell";

//
let searchOrderId = "";
let searchCampaignId = null;
let shopSettings = {};
let isCartPage = false;

let cacheCart = null;
let cacheCampaign = null;
let cacheSettings = null;
let currency = getCookie("cart_currency");
let shopifyExchangeRate;
if (
  !currency &&
  typeof Shopify !== "undefined" &&
  Shopify &&
  Shopify.currency &&
  Shopify.currency.active &&
  Shopify.currency.rate
) {
  currency = Shopify.currency.active;
  shopifyExchangeRate = parseFloat(Shopify.currency.rate);
}

const appEvent = new MyEventListenerApp("conversionBearUpsell");
// TrackJS.install({ token: 'e4d05c79e48f4002a094e444fa3700e8', application:'upsell-widget' ,window: { enabled: false , promise: false} });

let genWidget = () => null;


function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length == 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}


const defaultSettings = {
  isDemo: false,
  onLoaded: () => null,
  getDemoCheckoutData: () => null,
  show: () => null,
  ...(window.conversionBearUpsellSettings
    ? window.conversionBearUpsellSettings
    : {})
};

const conversionBearUpsell = {
  closeApp: () => {
    document.getElementById(elementId).remove();
  },
  onLoaded: defaultSettings.onLoaded,
  getDemoCheckoutData: defaultSettings.getDemoCheckoutData
};

(async () => {
  genWidget = ({ campaign_id = null, dontTriggerOnLoaded = false, isCart = false }) => {
    Promise.all([fetchSettings(), getCampaign(campaign_id, isCart)])
      .then(([settingsData, campaign]) => {
        if (dontTriggerOnLoaded) {
          conversionBearUpsell.onLoaded = () => {};
        }

        if (!settingsData || !campaign) {
          conversionBearUpsell.onLoaded();
          if (isCart && !campaign) {
            window.location.href = '/checkout';
          }
          return;
        }

        if (defaultSettings.isDemo) {
          isCart = campaign.page_to_show == 'cart_page';
        }

        shopSettings = settingsData;

        if (
          settingsData.advanced &&
          settingsData.advanced.facebook_pixel_id &&
          settingsData.advanced.facebook_pixel_id !== "" && 
          !window.fbq
        ) {
          ReactPixel.init(
            settingsData.advanced.facebook_pixel_id,
            {},
            { debug: false, autoConfig: false },
          );
          if (window.fbq) {
            fbq('track', 'PageView');
          } else {
            ReactPixel.pageView();
          }
        }

        if (
          settingsData.advanced &&
          settingsData.advanced.pinterest_tag_id &&
          settingsData.advanced.pinterest_tag_id !== ""
        ) {
          ReactPinterest.init(settingsData.advanced.pinterest_tag_id);
        }

        if (
          settingsData.advanced &&
          settingsData.advanced.snapchat_pixel_id &&
          settingsData.advanced.snapchat_pixel_id !== ""
        ) {
          ReactSnapchat.init(
            settingsData.advanced.snapchat_pixel_id,
            {},
            { debug: false }
          );
        }

        if (
          settingsData.advanced &&
          settingsData.advanced.google_analytics_id &&
          settingsData.advanced.google_analytics_id !== ""
        ) {
          ReactGA.initialize(settingsData.advanced.google_analytics_id, {
            debug: false
          });
        }

        //settings override - USAGE EXAMPLE
        //     <script>
        //     window.cbUpsellCustomSettingsOverride = {
        //       countdown_timer:{ show: false }
        //     };
        // </script>
        if (
          window.cbUpsellCustomDesignSettingsOverride &&
          typeof window.cbUpsellCustomDesignSettingsOverride === "object" &&
          settingsData &&
          settingsData.design &&
          settingsData.design.theme
        ) {
          for (let key of Object.keys(window.cbUpsellCustomDesignSettingsOverride)) {
            if (settingsData.design.theme.hasOwnProperty(key)) {
              if (
                typeof window.cbUpsellCustomDesignSettingsOverride[key] === "object"
              ) {
                for (let keyTag of Object.keys(
                  window.cbUpsellCustomDesignSettingsOverride[key]
                )) {
                  settingsData.design.theme[key][keyTag] =
                    window.cbUpsellCustomDesignSettingsOverride[key][keyTag];
                }
              } else {
                settingsData.design.theme[key] = window.cbUpsellCustomDesignSettingsOverride[key];
              }
            }
          }
        }

        const div = document.createElement("div");
        div.setAttribute("id", elementId);
        document.body.appendChild(div);

        // add bottom page padding for the mobile widget so the bottom part is reachable
        if (window.innerWidth <= 767) {
          try {
            const widgetHeight = '170px';
            if (document.getElementsByClassName('main')[0] && document.getElementsByClassName('main').length === 1) {
              document.getElementsByClassName('main')[0].style.marginBottom = widgetHeight;
            } else if (document.getElementsByTagName("body")[0].style.marginBottom === "") {
              document.getElementsByTagName(
                "body"
              )[0].style.marginBottom = widgetHeight;
            }
          } catch (error) {
            console.log(`cb: couldn't increase window height`);
          }
        }

        if (isCart) {
          createOrderView(campaign._id);
        }


        ReactDOM.render(
          <ErrorBoundary
          handleError={handleError}
          >
            <WidgetContainer
              campaign={campaign}
              settings={settingsData}
              isDemo={defaultSettings.isDemo}
              forseIsMobile={defaultSettings.forseIsMobile}
              goToCheckout={goToCheckout}
              conversionBearUpsell={conversionBearUpsell}
              url={url}
              ReactPixel={ReactPixel}
              ReactSnapchat={ReactSnapchat}
              ReactGA={ReactGA}
              ReactPinterest={ReactPinterest}
              appEvent={appEvent}
              isCartPage={isCart}
              currency={currency}
            />
          </ErrorBoundary>,
          document.getElementById(elementId)
        );
        
      })
      .catch(err => {
        console.log(err);
      });
  };

  function fetchSettings() {
    if (defaultSettings.isDemo && localStorage.getItem("upsellShopSettings")) {
      try {
        return JSON.parse(localStorage.getItem("upsellShopSettings"));
      } catch (error) {
        //
      }
    }
    if(cacheSettings){
      return cacheSettings;
    }
    return fetch(`${url}settings?shop=${shop}`).then(resp => {
      if(resp.status != 200){
        return null;
      }
      return resp.json();
    });
  }

  function getCart() {
    return fetch('/cart.js').then(res => res.json()).then(data => {
      return data;
    }).catch((err) => {
      return null;
    })
  }

  async function getCampaign(campaign_id = null, isCart = false, forseUpdate = false) {
    try {
      if (defaultSettings.isDemo) {
        if (localStorage.getItem("upsellCampaing")) {
          let res_demo = await fetch(`${url}default/demo_campaign?shop=${shop}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(
              JSON.parse(localStorage.getItem("upsellCampaing"))
            )
          });
          return await res_demo.json();
        } else {
          return Promise.resolve(demoCampaign);
        }
      } else if (searchOrderId || campaign_id || isCart) {

        if (cacheCampaign && !forseUpdate && !campaign_id) {
          return cacheCampaign;
        }

        let urlRequest = `${url}default/campaign?&shop=${shop}&orderId=${searchOrderId}&isMobile=${window.innerWidth <=
          767}&currency=${currency}`;

        if (campaign_id) {
          urlRequest = `${url}default/campaign?campaignId=${campaign_id}&shop=${shop}&isMobile=${window.innerWidth <=
            767}&currency=${currency}`;
        }

        const product_ids = [];
        let total_price = 0;

        if (isCart) {

          const cart = await getCart();

          if (cart.item_count < 1) {
            return null;
          }

          cart.items.forEach((item) => {
            product_ids.push(item.product_id);
          });

          total_price = cart.total_price ? cart.total_price / 100 : 0;


          urlRequest = `${url}default/campaign_cart?shop=${shop}&isMobile=${window.innerWidth <=
            767}&currency=${currency}`;

          if (localStorage.getItem('tmpOrderId')) {
            urlRequest += '&tmpOrderId=' + localStorage.getItem('tmpOrderId')
          }
        }

        if (localStorage.getItem('excludeCampaigns')) {
          try {
            const excludeCampaigns = JSON.parse(localStorage.getItem('excludeCampaigns'));
            if (Array.isArray(excludeCampaigns)) {
              urlRequest += `&excludeIds=${excludeCampaigns.join(',')}`;
            }
          } catch (error) {
            console.log('getCampaign -> error', error);
          }
        }

        let result = await fetch(urlRequest, {
          headers: {
            "Content-Type": "application/json"
          },
          method: isCart ? 'POST' : 'GET',
          body: isCart ? JSON.stringify({
            product_ids,
            total_price
          }) : undefined,
        })

        if (result.status != 200) {
          return null;
        }

        result = await result.json();
        if (result.hasOwnProperty('tmpOrderId')) {
          searchOrderId = result.tmpOrderId;
          localStorage.setItem('tmpOrderId', result.tmpOrderId);
        }

        if (result.hasOwnProperty('campaign_id_exclude') && result.campaign_id_exclude) {
          try {
            if (localStorage.getItem('excludeCampaigns')) {
              const excludeCampaigns = JSON.parse(localStorage.getItem('excludeCampaigns'));
              localStorage.setItem('excludeCampaigns', JSON.stringify([...excludeCampaigns, result.campaign_id_exclude]));
            } else {
              localStorage.setItem('excludeCampaigns', JSON.stringify([result.campaign_id_exclude]));
            }
          } catch (error) {
            console.log('getCampaign -> error', error);
          }
        }

        return result._id ? result : null;
      }
      return null;
    } catch (error) {
      return null;
    }

  }


  function createOrderView(campaign_id) {
    fetch(
      `${url}default/campaign_order_view?currency=${currency}`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          shopOrigin: shop,
          campaign_id,
          tmpOrderId: localStorage.getItem('tmpOrderId'),
        }),
      },
    )
      .then((resp) => {
        if (resp.status != 200) {
          throw new Error('Not create order view');
        }
        return resp.json();
      })
      .then((result) => {
        if (result.tmpOrderId) {
          searchOrderId = result.tmpOrderId;
          localStorage.setItem('tmpOrderId', result.tmpOrderId);
        }

      }).catch((err) => {
        console.log('createOrderView -> err', err);
      });
  }

  function createOrder(searchOrderId, body) {
    return fetch(
      `${url}default/order?shop=${shop}&orderId=${searchOrderId}&currency=${currency}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    )
      .then(resp => {
        if(resp.status != 200){
          throw new Error('Not create order');
        }
        return resp.json()
      })
      .then((result) => {
        if (result.invoice_url) {
          setTimeout(() => {
            conversionBearUpsell.closeApp();
            window.location.href = result.invoice_url;
          }, 2000);
        } else {
          window.location.href = '/checkout';
        }
      }).catch((err) => {
        window.location.href = '/checkout';
      });
  }

  async function goToCheckout(data) {
    try {
      if (defaultSettings.isDemo) {
        conversionBearUpsell.getDemoCheckoutData(data);
        conversionBearUpsell.closeApp();
        return null;
      } else if (window.conversionBearUpsell.RECHARGE_PRODUCTS && data.offers) { //RECHARGE INTEGRATION
        initRechargeIntegration(data.offers);
      } else if (isCartPage) {
        if (!data || !data.offers || !data.offers.length) {
          window.location.href = '/checkout';
          conversionBearUpsell.closeApp();
          return null;
        }
        data.cart = await getCart();
        return await createOrder(searchOrderId, data);
      } else if (searchOrderId) {
        return await createOrder(searchOrderId, data);
      }
      return null;
    } catch (error) {
      return null;
    }

  }

  function handleError(){
  console.log("handleError -> handleError")
  if (
    (window.location.pathname.indexOf("thank_you") > -1 ||
      window.location.pathname.indexOf("orders") > -1)){
        return null;
      } else if(isCartPage) {
        goToCheckout();
      } else {
        return null;
      }
  }

  function setCacheSettings() {
    return fetchSettings().then((settings) => {
      cacheSettings = settings;
    });
  }

  async function setCacheCampaign() {
    try {
      const cart = await getCart();
      if (!isEqual(cart, cacheCart)) {
        cacheCart = cart;
        const campaign = await getCampaign(null, true, true);
        cacheCampaign = campaign;
      }
    } catch (error) {
      //
    }
  }

  function setCheckoutClickListener() {
    // eslint-disable-next-line shopify/prefer-early-return
    document.addEventListener('submit', (e) => {
      if (
        typeof e.target.action === "string" &&
        (e.target.action.slice(-5) === "/cart" ||
          e.target.action.slice(-9) === "/checkout")
      ) {
        e.preventDefault();
        isCartPage = true;
        genWidget({ campaign_id: searchCampaignId, isCart: isCartPage });
      }
    });


    // eslint-disable-next-line shopify/prefer-early-return
    document.addEventListener('click', (e) => {
      if (e.target && e.target.className && (typeof (e.target.className) === 'string') && e.target.className.indexOf('cb-upsell-show-cart-page-widget') > -1) {
        e.preventDefault();
        isCartPage = true;
        genWidget({ campaign_id: searchCampaignId, isCart: isCartPage });
      }
    });

    //init custom event handlers to trigger the widget pre-checkout
    if (window && window.Shopify && window.Shopify.theme) {
      const themeId = window.Shopify.theme.id;
      let submitButtonSelector;
      switch (themeId) {
        case 89030557831: //KIVO Code
          document
            .querySelector("#add-to-cart")
            .addEventListener("click", (e) => {
              setTimeout(() => {
                document
                  .querySelectorAll(".checkout-link.button")
                  .forEach((element) => {
                    element.addEventListener("click", (e) => {
                      e.preventDefault();
                      isCartPage = true;
                      genWidget({
                        campaign_id: searchCampaignId,
                        isCart: isCartPage,
                      });
                    });
                  });
              }, 1000);
            });
          break;
        case 88979406981: //KIBO Code V2
          document
            .querySelector("#add-to-cart")
            .addEventListener("click", (e) => {
              setTimeout(() => {
                document
                  .querySelectorAll(".checkout-link.button")
                  .forEach((element) => {
                    element.addEventListener("click", (e) => {
                      e.preventDefault();
                      isCartPage = true;
                      genWidget({
                        campaign_id: searchCampaignId,
                        isCart: isCartPage,
                      });
                    });
                    element.setAttribute('onclick','');
                    if(window.screen.width > 500){
                      let style = document.createElement('style');
                      style.innerHTML =
                        '.cb-widget-component {' +
                          'left: 50% !important;' +
                        '}';
                      // Get the first script tag
                      var ref = document.querySelector('script');
                      // Insert our new styles before the first script tag
                      ref.parentNode.insertBefore(style, ref);
                    }
                  });
              }, 1000);
            });
          break;
        default:
          break;
      }
      if ( //TODO: extract to a function
        window.theme && 
        window.theme.name &&
        window.theme.name.toLowerCase.includes("debutify")
      ) {
        document
          .querySelector("#AddToCart--product-template")
          .addEventListener("click", (e) => {
            setTimeout(() => {
              document
                .querySelectorAll(".ajaxcart-checkout.cart__checkout")
                .forEach((element) => {
                  element.addEventListener("click", (e) => {
                    e.preventDefault();
                    isCartPage = true;
                    genWidget({
                      campaign_id: searchCampaignId,
                      isCart: isCartPage,
                    });
                  });
                });
            }, 500);
          });
          document
          .querySelectorAll(".ajaxcart-checkout.cart__checkout")
          .forEach((element) => {
            element.addEventListener("click", (e) => {
              e.preventDefault();
              isCartPage = true;
              genWidget({
                campaign_id: searchCampaignId,
                isCart: isCartPage,
              });
            });
          });
      }
    }
  }


  if (!defaultSettings.isDemo) {
    if (
      (window.location.pathname.indexOf("thank_you") > -1 ||
        window.location.pathname.indexOf("orders") > -1) &&
      Shopify.checkout &&
      Shopify.checkout.order_id
    ) {
      searchOrderId = Shopify.checkout.order_id;
      console.log('%c 🍯 Honeycomb by Conversion Bear: loaded post purchase', 'background: #FBCE10; color: white');
    } else {
      const parsedUrl = new URL(window.location);
      if (parsedUrl.searchParams.has("cb_campaign")) {
        searchCampaignId = parsedUrl.searchParams.get("cb_campaign");
      } else if(window && window.customHoneycombCampaignId){
        searchCampaignId = window.customHoneycombCampaignId;
      } 
      else {
        await setCacheSettings();
        if (!cacheSettings.has_active_pre_purchase_funnels) {
          return;
        }
        setCheckoutClickListener();
        setCacheCampaign();
        if (window.location.pathname.indexOf("cart") > -1) {
          // on cart page
          setInterval(() => {
            setCacheCampaign();
          }, 3000);
        }
        console.log('%c 🍯 Honeycomb by Conversion Bear: loaded pre purchase', 'background: #FBCE10; color: white');
        setTimeout(() => {
          conversionBearUpsell.onLoaded();
        }, 50);
        return;
      }
    }
  }

  genWidget({ campaign_id: searchCampaignId });
})();

export function closeApp() {
  conversionBearUpsell.closeApp();
}

export function show(campaign_id = "first") {
  genWidget({ campaign_id: searchCampaignId, dontTriggerOnLoaded: true });
}

export function showCartPageWidget() {
  isCartPage = true;
  genWidget({ campaign_id: searchCampaignId, isCart: isCartPage });
}
