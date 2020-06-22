import React from "react";
import { Card, Button } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import './BoostMobileSales.scss';

const BoostMobileSales = () => (
  <Card sectioned>
    <div className="BoostMobileSales">
      <div className="new-label">
        {I18n.t("NEW")}
      </div>
      <div className="title">{I18n.t('BOOST YOUR MOBILE SALES 🎉')}</div>
      <div className="logo">
      <img className="refToOtherAppAppLogo" src='../static/images/appRefAppLogo.svg'/>
      </div>
      <h1>{I18n.t('Ultimate Sticky Add to Cart')}</h1>
      <p>{I18n.t('Speed up checkout and boost sales with Sticky Add to Cart')}</p>
        <Button
        primary
        external
        url={`https://www.conversionbear.com/solutions/ultimate-sticky-add-to-cart-lp?utm_source=upsell&utm_medium=settings_card&utm_campaign=new`}
      >
        {I18n.t('Get extended trial')}
      </Button>
    </div>
  </Card>
);

export default BoostMobileSales;
