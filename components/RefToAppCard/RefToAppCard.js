import React from "react";
import { Card, Label } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import LogoBear from './LogoBear';
import './RefToAppCard.scss';
import ShopifyIcon from "./ShopifyIcon";

const RefToAppCard = ({labelImageSrc, title, appName, appLogoSrc, description, appUrl, titleColor}) => (
  <Card sectioned>
    <div className="RefToAppCard">
    <img src={labelImageSrc}/>
      {/* <div className="new-label">
        {I18n.t("NEW")}
        <img src={labelImageSrc}/>
      </div> */}
      <div className="title" style={{color: titleColor}}>{title}</div>
      <div className="logo">
        <img src={appLogoSrc}/>
      </div>
      <h1>{appName}</h1>
      <p>{description}</p>
      <a target="_blank" href ={appUrl}>
        <ShopifyIcon />
      </a>
    </div>
  </Card>
);

export default RefToAppCard;
