import Router from 'next/router';
import { Redirect } from '@shopify/app-bridge/actions';

export function getSettings(updateShopInformation = false) {
  return async (dispatch) => {
    try {
      let url = '/settings';
      if (updateShopInformation) {
        url += '?updateShopInformation=1';
      }
      const data = await fetch(url).then((resp) => resp.json());
      dispatch({ type: 'SET_IS_ACTIVE', data: data.isActive });
      dispatch({ type: 'GET_SETTINGS', data: { ...data, isActive: undefined } });
      dispatch({ type: 'SET_LOADED', data: true });
      return data;
    } catch (error) {
      // TODO: process error
    }
  };
}

export function getShop() {
  return async (dispatch) => {
    try {
      const data = await fetch('/shops/current').then((resp) => resp.json());
      dispatch({ type: 'GET_SHOP', data });
      return data;
    } catch (error) {
      // TODO: process error
    }
  };
}
export async function getCampaignPreview(current_campaign, shopOrigin) {
  try {
    const data = await fetch('/default/campaign_preview', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({shopOrigin, current_campaign}),
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    // TODO: process error
  }
}

export function setSettings(settings) {
  return async (dispatch) => {
    try {
      dispatch({ type: 'SET_SETTINGS_SAVING', data: true });
      await fetch('/settings', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
        .then((resp) => resp.json());
      dispatch({ type: 'SET_SETTINGS', data: settings });
      dispatch({ type: 'SET_SETTINGS_DISPAY_SAVED_NOTICE', data: true });
      setTimeout(() => {
        dispatch({ type: 'SET_SETTINGS_DISPAY_SAVED_NOTICE', data: false });
      }, 2000);
      return settings;
    } catch (error) {
      // TODO: process error
      return settings;
    }
  };
}

export function enableShop() {
  return (dispatch) => {
    return fetch('/shops/enable', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((resp) => resp.json())
      .then(() => {
        dispatch({ type: 'SET_IS_ACTIVE', data: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}


export function disableShop() {
  return (dispatch) => {
    return fetch('/shops/disable', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then((resp) => resp.json())
      .then(() => {
        dispatch({ type: 'SET_IS_ACTIVE', data: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

}

export function getCampaigns() {
  return async (dispatch) => {
    try {
      const data = await fetch('/api/campaigns').then((resp) => resp.json());
      dispatch({ type: 'GET_CAMPAIGNS', data });
      dispatch({ type: 'SET_LOADED', data: true });
      return data;
    } catch (error) {
      // TODO: process error
    }
  };
}

export function updateCampaign(body) {
  return async (dispatch) => {
    try {
      const data = await fetch(`/api/campaigns/${body._id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => resp.json());
      dispatch({ type: 'UPDATE_CAMPAIGN', data });
      return body;
    } catch (error) {
      // TODO: process error
    }
  };
}

export function hotUpdateCampaign(body) {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_CAMPAIGN', data: body });
    return body;
  };
}

export function deleteCampaign(id) {
  return async () => {
    try {
      await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => resp.json());

      return true;
    } catch (error) {
      // TODO: process error
    }
  }
}


export function createCampaign(body) {
  return async (dispatch) => {
    try {
      const data = await fetch('/api/campaigns', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => resp.json());
      dispatch({ type: 'NEW_CAMPAIGN', data });
      return data;
    } catch (error) {
      // TODO: process error
    }
  };
}

export async function getSearchProducts(search = '', search_field = 'title') {
  try {
    const data = await fetch(`/default/products?search=${search}&search_field=${search_field}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    // TODO: process error
    return [];
  }
}

export async function getProduct(id) {
  try {
    const data = await fetch(`/default/product?id=${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    // TODO: process error
    return [];
  }
}

export async function getSearchCollections(search = '') {
  try {
    const data = await fetch(`/default/collections?search=${search}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    // TODO: process error
    return [];
  }
}

export function setCampaign(data) {
  return (dispatch) => {
    if (data.offers) {
      data.offers = data.offers.map((offer) => {
        if (offer.discount.discount_type === 'fixed_price') {
          offer.discount.amount = isNaN(parseFloat(offer.discount.amount)) ? offer.discount.amount : parseFloat(offer.discount.amount).toFixed(2)
        }
        return { ...offer };
      });
    }

    dispatch({ type: 'SET_CAMPAIGN', data });
  };
}


export function closeNotification(index) {
  return (dispatch) => {
    dispatch({ type: 'CLOSE_NOTIFICATION', index });
    const tmp = (i) => dispatch({ type: 'CLEAR_NOTIFICATION', i });
    setTimeout(tmp, 500, index);
  };
}


export function newNotification(message) {
  return (dispatch) => {
    dispatch({ type: 'NEW_NOTIFICATION', message });
  };
}


export async function getSmartCampaign() {
  try {
    const data = await fetch('/api/campaigns/smart', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    // TODO: process error
    return [];
  }
}


export async function getUpsellStatistics() {
  try {
    const data = await fetch('/statistics', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    // TODO: process error
    return [];
  }
}

export async function getRevenueGrowth(date) {
  try {
    const data = await fetch('/statistics/revenue_growth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(date),
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    console.log("TCL: getRevenueGrowth -> error", error)
    // TODO: process error
    return [];
  }
}


export async function getViewsGraphData(date) {
  try {
    const data = await fetch('/statistics/views_graph', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(date),
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    return [];
  }
}

export async function getTopCampaigns(date) {
  try {
    const data = await fetch('/statistics/top', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(date),
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    console.log("TCL: getRevenueGrowth -> error", error)
    // TODO: process error
    return [];
  }
}

export async function getViews(body) {
  try {
    const data = await fetch('/statistics/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((resp) => resp.json());
    return data;
  } catch (error) {
    console.log("TCL: getRevenueGrowth -> error", error)
    // TODO: process error
    return [];
  }
}

export function changePlan(plan, redirect) {
  return async (dispatch) => {
    try {
      const data = await fetch('/default/change_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      }).then((resp) => resp.json());
      // return data;
      if (data.pricingPlan === 'Free') {
        // redirect to dashboard
        dispatch({ type: 'SET_SETTINGS', data });
        Router.push('/');
      } else if (data.id && data.confirmationURL) {
        return redirect.dispatch(Redirect.Action.REMOTE, data.confirmationURL);
      }
    } catch (error) {
      console.log("TCL: getRevenueGrowth -> error", error)
      // TODO: process error
      return [];
    }
  };
}
export function getBigBearData(shopify_domain) {
  return async (dispatch) => {
    try {
      const bigBearUrl = DEV_MODE
        ? "http://localhost:3001"
        : "https://bigbear.conversionbear.com";
      const shop = await fetch(
        `${bigBearUrl}/shop?shopify_domain=${shopify_domain}`).then(res => res.json());

      // const shop = await shop.json();
      dispatch({ type: "GET_BIGBEAR_SHOP_DATA", data: shop });

      const appsStaticData = await fetch(`${bigBearUrl}/static/app-list.json`).then(res=> res.json());
      dispatch({ type: "GET_BIGBEAR_APPS_DATA", data: appsStaticData });

      return {shop, apps: appsStaticData};
    } catch (error) {}
  };
}

export function getOrdersCount() {
  return async (dispatch) => {
    try {
      const data = await fetch(`/default/orders_count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => resp.json());
      dispatch({ type: 'GET_ORDERS_COUNT', data:  data.count });
      return data;
    } catch (error) {
      // TODO: process error
      return {count:0};
    }
  };
}