import React from "react";
import { Button } from "@shopify/polaris";
import styled from "styled-components";
import { ExternalMinor } from "@shopify/polaris-icons";

const Card = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 32px 30px 20px 30px;
  margin: auto;
  height: 100%;
  width: 100%;
  button {
    margin: auto;
  }
`;

const HeaderImage = styled.img``;

const Title = styled.h2`
  font-size: 18px;
  line-height: 21px;
  /* identical to box height */
  text-align: center;
  color: #000000;
  margin-top: 10px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  text-align: center;
  /* Shopify gray color */
  color: #637381;
  margin: 10px auto;
`;

const InspirationCard = ({
  headerImageSrc,
  headerText,
  descriptionText,
  ctaText,
  href,
  hideIcon,
  customOnClick
}) => {
  return (
    <Card>
      <HeaderImage src={headerImageSrc} />
      <Title>{headerText}</Title>
      <Description>{descriptionText}</Description>
      <Button
        icon={!hideIcon && ExternalMinor}
        external
        primary
        onClick={() => {
          if(customOnClick){
            customOnClick();
          } else {
            amplitude.logEvent("click-open_inspiration", { value: headerText });
            window.open(href, "_blank");
          }
        }}
      >
        {ctaText}
      </Button>
    </Card>
  );
};

export default InspirationCard;
