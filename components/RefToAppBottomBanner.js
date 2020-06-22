import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #50248f;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 77px;
  padding: 20px;
  cursor: pointer;
  @media(max-width:540px){
    text-align: center;
    flex-direction: column;
  }
`;

const Content = styled.div`
  color: white;
  margin: auto 0px auto 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: auto 0px auto 0px;
`;

const ReviewsBar = styled.img`
  margin: 0px auto 7px 0px;
  @media(max-width:540px){
    margin: auto auto 10px auto;
  }
`;

const AppLogo = styled.img`
  width: auto;
  height: 132px;
  margin-left: 17px;
  margin-top: auto;
  margin-bottom: auto;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
  margin-bottom: 7px;
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
`;

const Button = styled.img`
  margin: auto 100px auto auto;
  display: flex;
  flex-direction: row;
  text-align: left;
  @media(max-width:540px){
    text-align: center;
    margin: 15px auto auto auto;
  }
`;

const Wrapper = styled.a`
  text-decoration: none;
`;

const RefToAppBottomBanner = ({ logoPath, title, description, appPageUrl }) => {
  return (
    <Wrapper href={appPageUrl} target="blank">
      <Container
        onClick={() => {
          amplitude.logEvent("click-ref_to_app_bottom_banner", {
            url: appPageUrl
          });
          // window.open(appPageUrl);
        }}
      >
        <AppLogo src={logoPath} />
        <Content>
          <Title>{title}</Title>
          <ReviewsBar src={require("../static/images/5_star_rating.svg")} />
          <Description dangerouslySetInnerHTML={{ __html: description }} />
        </Content>
        <Button src={require("../static/images/white_shopify_get_app_icon.svg")} />
      </Container>
    </Wrapper>
  );
};

export default RefToAppBottomBanner;
