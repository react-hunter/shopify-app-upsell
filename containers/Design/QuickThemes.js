import React, { Component } from 'react';
import { Card, Label } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';

class QuickThemes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange(theme) {
    const themes = {
      origin: {
        'design.theme.upsell_page.background_color': '#000000',
        'design.theme.upsell_page.top_background_color': '#000000',
        'design.theme.upsell_page.text_color': '#FFFFFF',

        'design.theme.top_bar.background_color': '#000000',
        'design.theme.top_bar.text_color': '#FFFFFF',
        'design.theme.top_bar.font': 'Lato',
        'design.theme.top_bar.text_size': 15,

        'design.theme.countdown_timer.text_size': 16,
        'design.theme.countdown_timer.background_color': 'gradient_violet2',
        'design.theme.countdown_timer.text_color': '#FFFFFF',
        'design.theme.countdown_timer.font': 'Lato',

        'design.theme.price.font': 'Lato',
        'design.theme.price.old_price_color': '#FFFFFF',
        'design.theme.price.new_price_color': '#31EB0D',
        'design.theme.price.text_color': '#31EB0D',

        'design.theme.product.text_color': '#FFFFFF',
        'design.theme.product.font': 'Lato',
        'design.theme.product.variants_text_color': '#FFFFFF',
        'design.theme.product.vartiants_bg_color': '#000000',
        'design.theme.product.button_color': '#4701FF',
        'design.theme.product.button_text_color': '#FFFFFF',
        'design.theme.product.go_to_checkout_text_color': '#212B36',
        'design.theme.product.go_to_checkout_bg_color': '#FFFFFF',
        'design.theme.product.description_bg_color': '#FFFFFF',
        'design.theme.product.description_text_color': '#212B36',
      },
      asos: {
        'design.theme.upsell_page.background_color': '#FFFFFF',
        'design.theme.upsell_page.top_background_color': '#FFFFFF',
        'design.theme.upsell_page.text_color': '#2D2D2D',

        'design.theme.top_bar.background_color': '#FFFFFF',
        'design.theme.top_bar.text_color': '#2D2D2D',
        'design.theme.top_bar.font': 'Cabin',
        'design.theme.top_bar.text_size': 15,

        'design.theme.countdown_timer.text_size': 18,
        'design.theme.countdown_timer.background_color': '#2D2D2D',
        'design.theme.countdown_timer.text_color': '#FFFFFF',
        'design.theme.countdown_timer.font': 'Cabin',

        'design.theme.price.font': 'Cabin',
        'design.theme.price.old_price_color': '#A4A4A4',
        'design.theme.price.new_price_color': '#CE1948',
        'design.theme.price.text_color': '#CE1948',

        'design.theme.product.text_color': '#2D2D2D',
        'design.theme.product.font': 'Cabin',
        'design.theme.product.variants_text_color': '#2D2D2D',
        'design.theme.product.vartiants_bg_color': '#FFFFFF',
        'design.theme.product.button_color': '#18A95E',
        'design.theme.product.button_text_color': '#FFFFFF',
        'design.theme.product.go_to_checkout_text_color': '#18A95E',
        'design.theme.product.go_to_checkout_bg_color': '#FFFFFF',
        'design.theme.product.description_bg_color': '#FFFFFF',
        'design.theme.product.description_text_color': '#A4A4A4',
      },

      aliexpress: {
        'design.theme.upsell_page.background_color': '#FFFFFF',
        'design.theme.upsell_page.top_background_color': '#FFFFFF',
        'design.theme.upsell_page.text_color': '#2D2D2D',

        'design.theme.top_bar.background_color': '#FFFFFF',
        'design.theme.top_bar.text_color': '#2D2D2D',
        'design.theme.top_bar.font': 'Open Sans',
        'design.theme.top_bar.text_size': 15,

        'design.theme.countdown_timer.text_size': 18,
        'design.theme.countdown_timer.background_color': 'gradient_pink',
        'design.theme.countdown_timer.text_color': '#FFFFFF',
        'design.theme.countdown_timer.font': 'Open Sans',

        'design.theme.price.font': 'Open Sans',
        'design.theme.price.old_price_color': '#A4A4A4',
        'design.theme.price.new_price_color': '#000000',
        'design.theme.price.text_color': '#FD9A27',

        'design.theme.product.text_color': '#000000',
        'design.theme.product.font': 'Open Sans',
        'design.theme.product.variants_text_color': '#000000',
        'design.theme.product.vartiants_bg_color': '#FFFFFF',
        'design.theme.product.button_color': '#FD494D',
        'design.theme.product.button_text_color': '#FFFFFF',
        'design.theme.product.go_to_checkout_text_color': '#FFFFFF',
        'design.theme.product.go_to_checkout_bg_color': '#FD9A27',
        'design.theme.product.description_bg_color': '#FFFFFF',
        'design.theme.product.description_text_color': '#000000',
      },
      instagram: {
        'design.theme.upsell_page.background_color': '#FFFFFF',
        'design.theme.upsell_page.top_background_color': '#FFFFFF',
        'design.theme.upsell_page.text_color': '#262626',

        'design.theme.top_bar.background_color': '#FFFFFF',
        'design.theme.top_bar.text_color': '#262626',
        'design.theme.top_bar.font': 'Noto Sans',
        'design.theme.top_bar.text_size': 15,

        'design.theme.countdown_timer.text_size': 18,
        'design.theme.countdown_timer.background_color': 'gradient_instagram',
        'design.theme.countdown_timer.text_color': '#FFFFFF',
        'design.theme.countdown_timer.font': 'Noto Sans',

        'design.theme.price.font': 'Noto Sans',
        'design.theme.price.old_price_color': '#A4A4A4',
        'design.theme.price.new_price_color': '#262626',
        'design.theme.price.text_color': '#262626',

        'design.theme.product.text_color': '#262626',
        'design.theme.product.font': 'Noto Sans',
        'design.theme.product.variants_text_color': '#262626',
        'design.theme.product.vartiants_bg_color': '#FFFFFF',
        'design.theme.product.button_color': '#0085FF',
        'design.theme.product.button_text_color': '#FFFFFF',
        'design.theme.product.go_to_checkout_text_color': '#0085FF',
        'design.theme.product.go_to_checkout_bg_color': '#FFFFFF',
        'design.theme.product.description_bg_color': '#FFFFFF',
        'design.theme.product.description_text_color': '#262626',
      },

      amazon: {
        'design.theme.upsell_page.background_color': '#FFFFFF',
        'design.theme.upsell_page.top_background_color': '#FFFFFF',
        'design.theme.upsell_page.text_color': '#111111',

        'design.theme.top_bar.background_color': '#FFFFFF',
        'design.theme.top_bar.text_color': '#111111',
        'design.theme.top_bar.font': 'Noto Sans',
        'design.theme.top_bar.text_size': 15,

        'design.theme.countdown_timer.text_size': 18,
        'design.theme.countdown_timer.background_color': '#242F3E',
        'design.theme.countdown_timer.text_color': '#FF9F40',
        'design.theme.countdown_timer.font': 'Noto Sans',

        'design.theme.price.font': 'Noto Sans',
        'design.theme.price.old_price_color': '#555555',
        'design.theme.price.new_price_color': '#AF2913',
        'design.theme.price.text_color': '#AF2913',

        'design.theme.product.text_color': '#111111',
        'design.theme.product.font': 'Noto Sans',
        'design.theme.product.variants_text_color': '#111111',
        'design.theme.product.vartiants_bg_color': '#EDEFF1',
        'design.theme.product.button_color': '#FF9F40',
        'design.theme.product.button_text_color': '#242F3E',
        'design.theme.product.go_to_checkout_text_color': '#242F3E',
        'design.theme.product.go_to_checkout_bg_color': '#FFCF61',
        'design.theme.product.description_bg_color': '#000000',
        'design.theme.product.description_text_color': '#242F3E',
      },

      bestbuy: {
        'design.theme.upsell_page.background_color': '#FFFFFF',
        'design.theme.upsell_page.top_background_color': '#FFFFFF',
        'design.theme.upsell_page.text_color': '#040C13',

        'design.theme.top_bar.background_color': '#FFFFFF',
        'design.theme.top_bar.text_color': '#040C13',
        'design.theme.top_bar.font': 'Noto Sans',
        'design.theme.top_bar.text_size': 15,

        'design.theme.countdown_timer.text_size': 18,
        'design.theme.countdown_timer.background_color': '#CD062B',
        'design.theme.countdown_timer.text_color': '#FFFFFF',
        'design.theme.countdown_timer.font': 'Noto Sans',

        'design.theme.price.font': 'Noto Sans',
        'design.theme.price.old_price_color': '#040C13',
        'design.theme.price.new_price_color': '#040C13',
        'design.theme.price.text_color': '#040C13',

        'design.theme.product.text_color': '#040C13',
        'design.theme.product.font': 'Noto Sans',
        'design.theme.product.variants_text_color': '#0051DF',
        'design.theme.product.vartiants_bg_color': '#FFFFFF',
        'design.theme.product.button_color': '#FFDB11',
        'design.theme.product.button_text_color': '#040C13',
        'design.theme.product.go_to_checkout_text_color': '#FFFFFF',
        'design.theme.product.go_to_checkout_bg_color': '#0051DF',
        'design.theme.product.description_bg_color': '#FFFFFF',
        'design.theme.product.description_text_color': '#040C13',
      },

    };

    Object.keys(themes[theme]).forEach((key) => {
      this.props.change(key, themes[theme][key]);
    });
    amplitude.logEvent('click-design_apply_quick_theme',{value:theme});
  }


  render() {
    return (
      <Card title={I18n.t('Quick Themes')} sectioned>
        <Label>{I18n.t('Click to apply')}</Label>
        <div className="item-theme" onClick={this.onChange.bind(this, 'asos')}>
          <img src={require('../../static/images/bpop.svg')} alt="" />
        </div>
        <div className="item-theme" onClick={this.onChange.bind(this, 'aliexpress')}>
          <img src={require('../../static/images/aliexpress.svg')} alt="" />
        </div>
        <div className="item-theme" onClick={this.onChange.bind(this, 'amazon')}>
          <img src={require('../../static/images/amazon.svg')} alt="" />
        </div>
        <div className="item-theme" onClick={this.onChange.bind(this, 'bestbuy')}>
          <img src={require('../../static/images/bestbuy.svg')} alt="" />
        </div>
        <div className="item-theme" onClick={this.onChange.bind(this, 'instagram')}>
          <img src={require('../../static/images/instagram.svg')} alt="" />
        </div>
        <div className="item-theme" onClick={this.onChange.bind(this, 'origin')}>
          <img src={require('../../static/images/conversionbear.svg')} alt="" />
        </div>
      </Card>
    );
  }
}

export default QuickThemes;
