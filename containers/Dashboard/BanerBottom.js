import React, { Component } from "react";
import "./BanerBottom.scss";
import { Button } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";

class BanerBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BanerBottom">
        <img
          src={require("../../static/images/Baner_logo_botton.svg")}
          alt=""
        />
        <div className="text">
          <h1 className="Polaris-Heading">{I18n.t("Need anything?")}</h1>
          <p>
            {I18n.t(
              "Our dedicated support team is here to help you reach your goals"
            )}
          </p>
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
          {I18n.t("Get Support")}
        </Button>
      </div>
    );
  }
}

export default BanerBottom;
