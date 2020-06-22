import { TextField, Button } from "@shopify/polaris";
import React, { Component } from "react";
import { I18n } from "react-redux-i18n";
import styled from "styled-components";
import { connect } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 247px;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
  box-sizing: border-box;
  width: 100%;
  min-height: 400px;
  margin: 20px 0;
  text-align: center;
  background-color: white;
`;

const BottomImage = styled.img`
  object-fit: contain;
  object-position: top;
  min-height: 99px;
  max-height: 130px;
  margin: 0px 15px;
`;

const TopImage = styled.img`
  margin: 16px auto 12px auto;
  width: 190px;
`;
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Text = styled.span`
  margin: 20px 20px 14px 20px;
`;
const FormWrapper = styled.div`
  min-width: 250px;
  margin: 0 auto;
`;
const ButtonWrapper = styled.div`
  margin: 20px 40px 20px 40px;
`;

class PolarCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email || null,
      subscribedToMailingList: this.props.subscribedToMailingList || false,
      loading: false,
    };
  }

  async addSubscriberToPolar({ shopify_domain, email }) {
    if (!email || !shopify_domain) {
      return;
    }

    const bigBearUrl = DEV_MODE
    ? "http://localhost:3001"
    : "https://bigbear.conversionbear.com";

    const response = await fetch(`${bigBearUrl}/add_subscriber_to_polar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shopify_domain, email, origin_app: 'upsell' }),
    });

    return await response.json();
  }

  componentDidMount() {
    amplitude.logEvent("show-polar_card");
  }

  componentWillUpdate(nextProps){
    if(nextProps.email && this.state.email === null){
      this.setState({email: nextProps.email});
    }
  }

  render() {
    const { shop } = this.props.bigBear || {};
    
    if(!shop || this.state.email === null){
      return null;
    }
    const { polar, shop_information } = shop;
    if(polar){
      return null;
    }

    return (
      <Container>
        <TopImage src="https://conversion-bear-public.s3.us-east-2.amazonaws.com/trend_alert_badge.svg" />
        <BottomImage src="https://conversion-bear-public.s3.us-east-2.amazonaws.com/trend_alert_graph.svg" />
        <Text>
          Get a snapshot from across the internet of potential product trends
          before they happen.
        </Text>
        <FormWrapper>
          <TextField
            value={this.state.email}
            align="center"
            type="email"
            error={this.state.error}
            disabled={this.state.subscribedToMailingList}
            placeholder="polar@conversionbear.com"
            onChange={(newValue) => {
              if (this.state.error) {
                this.setState({
                  error: null,
                });
              }
              this.setState({
                email: newValue,
              });
            }}
          />
        </FormWrapper>
        <ButtonWrapper>
          <Button
            primary
            size="large"
            disabled={this.state.subscribedToMailingList}
            loading={this.state.loading}
            error={this.state.error}
            onClick={async () => {
              amplitude.logEvent("click-join_mailing_list", {
                email: this.state.email,
              });
              const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              if (!this.state.email.match(pattern)) {
                this.setState({
                  error: "That email doesn't look right",
                });
                return;
              }
              this.setState({ loading: true });
              const response = await this.addSubscriberToPolar({shopify_domain: this.props.shopify_domain, email: this.state.email});
                console.log(response);
                if (response.email) {
                  amplitude.logEvent("track-join_mailing_list", {
                    email: this.state.email,
                  });
                  setTimeout(() => {
                    this.setState({
                      subscribedToMailingList: true,
                      loading: false,
                    });
                  }, 1000);
                } else {
                  amplitude.logEvent("error-join_mailing_list", {
                    email: this.state.email,
                  });
                  this.setState({
                    error:
                      "Looks like we can't subscribe you at the moment. Try again later?",
                  });
                }
            }}
          >
            {this.state.subscribedToMailingList
              ? I18n.t("Subscribed!")
              : I18n.t("Subscribe")}
          </Button>
        </ButtonWrapper>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  if(!state.bigBear){
    return {}
  } else {
    return {
      bigBear: state.bigBear || null,
      email: (state.bigBear && state.bigBear.shop && state.bigBear.shop.shop_information) ? state.bigBear.shop.shop_information.email : "",
      shopify_domain: (state.bigBear && state.bigBear.shop && state.bigBear.shop.shop_information) ? state.bigBear.shop.shop_information.myshopify_domain : "",
      subscribedToMailingList: (state.bigBear && state.bigBear.shop && state.bigBear.shop.polar && state.bigBear.shop.polar.email),
      }
  }
};

export default connect(mapStateToProps)(PolarCard);