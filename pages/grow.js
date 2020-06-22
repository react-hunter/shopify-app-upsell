import { connect } from "react-redux";
import React, { Component } from "react";
import styled from "styled-components";
import { ProgressBar, Layout, Button, Spinner } from "@shopify/polaris";
import _ from "lodash";

class AppRecommendations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, window.scrollY);
    if (process.browser) {
      amplitude.logEvent("page_load", { value: "grow" });
    }
  }

  render() {
    const { apps, shop } = this.props;

    if (!apps || !shop) {
      return (
        <div>
          <Spinner size="large" color="teal" />
        </div>
      );
    }

    let currentApp = "";
    if (this.props.currentApp && this.props.currentApp.includes("-")) {
      currentApp = this.props.currentApp.split("-")[1];
    } else {
      currentApp = this.props.currentApp || "";
    }
    let { installed_apps } = shop;
    if (!installed_apps) {
      installed_apps = {};
    }

    const sortedAppsArray = _.orderBy(Object.values(apps), [
      (app) => app.key === currentApp,
      (app) => !installed_apps[app.key],
      'weight',
    ],['desc','asc','desc']);

    let numInstalledApps = 5;
    let numApps = 1;
    try {
      numInstalledApps = Object.values(installed_apps).length;
      numApps = sortedAppsArray.length;
    } catch (e) {
      //do nothing
    }

    const GrowTabContainer = styled.div`
      display: flex;
      flex-direction: column;
      margin-bottom: 80px;
    `;

    const Header = styled.div`
      display: flex;
      flex-direction: column;
    `;

    const Title = styled.h1`
      font-size: 20px;
      line-height: 24px;
      margin-bottom: 20px;
    `;

    const Subtitle = styled.p`
      font-size: 14px;
      line-height: 17px;
      color: #637381;
      margin: 10px 0px;
    `;

    const AppList = styled.div`
      display: flex;
      flex-direction: column;
    `;

    return (
      <GrowTabContainer>
        <Layout>
          <Layout.Section>
            <Header>
              <Title>{`Grow your business in ${numApps} simple steps`}</Title>
              <ProgressBar
                progress={(numInstalledApps / numApps) * 100}
                size="small"
              />
              <Subtitle>
                {`${numInstalledApps} out of ${numApps} completed`}
              </Subtitle>
            </Header>
            <div className="notFullWidthHr"></div>
            <AppList>
              {sortedAppsArray.map((app) => (
                <AppCard
                  app={app}
                  appIsInstalled={
                    installed_apps[app.key] || app.key === currentApp
                  }
                  currentApp={currentApp}
                  key={app.key}
                />
              ))}
            </AppList>
          </Layout.Section>
        </Layout>
      </GrowTabContainer>
    );
  }
}

const AppCard = ({ app, appIsInstalled, currentApp }) => {
  const Row = styled.div`
    display: flex;
    flex-direction: row;
  `;

  const MainRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: 700px) {
      flex-direction: column;
    }
  `;

  const Col = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const Card = styled.div`
    background: #ffffff;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 20px;
    margin: 10px auto;
    height: 100%;
    width: 100%;
    button {
      margin: auto;
    }
  `;

  const AppContent = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    max-width: 270px;
    margin: auto;
    @media (max-width: 700px) {
      margin-bottom: 20px;
    }
  `;

  const AppName = styled.h2`
    text-align: left;
    font-size: 20px;
    line-height: 24px;
    color: #212b36;
    margin-bottom: 5px;
    @media (max-width: 700px) {
      font-size: 18px;
      line-height: 21px;
      margin-bottom: 2px;
    }
  `;
  const AppLogo = styled.img`
    height: 95px;
    width: auto;
    margin-right: 20px;
    @media (max-width: 700px) {
      height: 77px;
      margin-right: 10px;
    }
  `;

  const SmallAppLogo = styled.img`
    height: 44px;
    width: auto;
    margin-right: 14px;
    @media (max-width: 700px) {
      height: 77px;
      margin-right: 10px;
    }
  `;

  const AppLabel = styled.img`
    margin: 0px auto 20px 0px;
  `;

  const Stars = styled.img`
    margin-right: 8px;
    margin-left: 0px;
    @media (max-width: 700px) {
      margin-right: auto;
    }
  `;

  const SecondayCTA = styled.a`
    font-size: 16px;
    line-height: 19px;
    color: #5e6dc6;
    text-decoration: none;
    margin: auto auto auto 0px;
    @media (max-width: 700px) {
    }
  `;
  const ButtonWrapper = styled.div`
    margin: auto 0px auto auto;
    @media (max-width: 700px) {
      margin: 0px auto 20px 0px;
    }
  `;

  const ReviewsContent = styled.span`
    margin-right: 8px;
    @media (max-width: 700px) {
      margin-top: 7px;
    }
  `;

  const AppDescription = styled.p`
    font-size: 14px;
    line-height: 17px;
    display: flex;
    align-items: center;
    color: #212b36;
    @media (max-width: 700px) {
      display: none;
    }
  `;

  const CTAContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: ${props => props.extendedTrialLayout ? '340px' : '260px'};
    justify-content: space-between;
    @media (max-width: 700px) {
      display: none;
    }
  `;

  const MobileCTAContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 20px;
    @media (min-width: 700px) {
      display: none;
      margin-bottom: 10px;
    }
  `;

  const ReviewLine = styled.div`
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    @media (max-width: 700px) {
      flex-direction: column;
    }
  `;

  const SubtitleLine = styled.div`
    text-align: left;
    display: flex;
    align-items: center;
  `;

  const MinorText = styled.span`
    font-size: 14px;
    line-height: 17px;
    color: #919eab;
    margin-left: 10px;
  `;
  const LineIcon = styled.img`
    @media (max-width: 700px) {
      height: 20px;
      width: auto;
    }
  `;

  const MobileDescriptionWrapper = styled.div`
    height: 20px;
    font-size: 14px;
    line-height: 17px;
    display: flex;
    align-items: center;
    color: #212b36;
    visibility: hidden;
    text-align: left;
    @media (max-width: 700px) {
      visibility: visible;
      height: auto;
      margin-bottom: 10px;
    }
  `;
  const AddedIndication = styled.div`
    margin: auto;
    display: flex;
    @media (max-width: 700px) {
      display: none;
    }
  `;

  const MobileAddedIndication = styled.div`
    margin: auto auto auto 0px;
    display: flex;
    @media (min-width: 700px) {
      display: none;
    }
  `;

  const MinorSuccessText = styled.span`
    color: #50b83c;
    margin: auto auto auto 10px;
  `;
  
  let markup;
  if (appIsInstalled) {
    markup = (
      <Card key={app.key}>
        <Row style={{ justifyContent: "space-between" }}>
          <Col style={{ flexDirection: "row" }}>
            <SmallAppLogo src={app.assets.app_logo_path} />

            <Col>
              <AppName style={{ margin: "auto" }}>{app.name}</AppName>
              <MobileAddedIndication>
                <LineIcon src="https://bigbear.conversionbear.com/static/images/added_icon.svg" />
                <MinorSuccessText>Added</MinorSuccessText>
              </MobileAddedIndication>
            </Col>
          </Col>

          <Col style={{ marginRight: "30px" }}>
            <AddedIndication>
              <LineIcon src="https://bigbear.conversionbear.com/static/images/added_icon.svg" />
              <MinorSuccessText>Added</MinorSuccessText>
            </AddedIndication>
          </Col>

        </Row>
      </Card>
    );
  } else {
    const { extended_trial_path } = app.hrefs;
    markup = (
      <Card key={app.key}>
        <AppLabel src={app.assets.app_label_path} />
        <MainRow>
          <Col>
            <Row>
              <Col>
                <AppLogo src={app.assets.app_logo_path} />
              </Col>
              <Col>
                <AppContent>
                  <AppName>{app.name}</AppName>
                  <ReviewLine>
                    <Stars src="https://bigbear.conversionbear.com/static/images/grow_stars.svg" />
                    <ReviewsContent>{`${app.reviews_rating} (+${app.reviews_count} reviews)`}</ReviewsContent>
                  </ReviewLine>
                  <AppDescription>{app.description}</AppDescription>
                </AppContent>
              </Col>
            </Row>
          </Col>

          <CTAContainer extendedTrialLayout={extended_trial_path}>
            <SecondayCTA
              target="_blank"
              href={app.hrefs.lp_path}
              onClick={() => {
                amplitude.logEvent("click-grow_lp_path", { value: app.key });
              }}
            >
              See more details
            </SecondayCTA>
            <ButtonWrapper
            extendedTrialLayout={extended_trial_path}
            >
              <Button
                size="large"
                url={extended_trial_path ? extended_trial_path : app.hrefs.direct_install_link_path + currentApp}
                external
                primary
                onClick={() => {
                  amplitude.logEvent("click-grow_direct_install_path", {
                    value: app.key,
                  });
                }}
              >
                {extended_trial_path ? 'Get extended trial' : 'Add app'}
              </Button>
            </ButtonWrapper>
          </CTAContainer>

        </MainRow>
        <MobileDescriptionWrapper>{app.description}</MobileDescriptionWrapper>

        <Row>
          <Col>
            <SubtitleLine>
              <LineIcon src="https://bigbear.conversionbear.com/static/images/grow_time.svg" />
              <MinorText
                dangerouslySetInnerHTML={{
                  __html: `Average setup time: <strong>${app.setup_time}</strong>`,
                }}
              />
            </SubtitleLine>
            <div style={{ height: "10px" }}></div>
            <SubtitleLine>
              <LineIcon src="https://bigbear.conversionbear.com/static/images/grow_cost.svg" />
              <MinorText>{app.pricing_description_text}</MinorText>
            </SubtitleLine>
          </Col>
        </Row>

        <MobileCTAContainer>
          <ButtonWrapper>
            <Button
              size="large"
              url={extended_trial_path ? extended_trial_path : app.hrefs.direct_install_link_path + currentApp}
              external
              primary
              onClick={() => {
                amplitude.logEvent("click-grow_direct_install_path", {
                  value: app.key,
                });
              }}
            >
              {extended_trial_path ? 'Get extended trial' : 'Add app'}
            </Button>
          </ButtonWrapper>
          <SecondayCTA
            target="_blank"
            href={app.hrefs.lp_path}
            onClick={() => {
              amplitude.logEvent("click-grow_lp_path", { value: app.key });
            }}
          >
            See more details
          </SecondayCTA>
        </MobileCTAContainer>

      </Card>
    );
  }
  return markup;
};

const mapStateToProps = (state) => {
  if (!state.bigBear) {
    return {};
  } else {
    return {
      bigBear: state.bigBear || null,
      shop: state.bigBear.shop,
      apps: state.bigBear.apps,
      currentApp: window ? window.location.hostname.split(".")[0] : null,
    };
  }
};

export default connect(mapStateToProps)(AppRecommendations);
