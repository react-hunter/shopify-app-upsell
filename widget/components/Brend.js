import React from 'react';
import styled from 'styled-components';
import BrendIcon from './BrendIcon';

const Conteiner = styled.div`
  height: 26px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 9999999;
  width: 100%;
  bottom: 0px;

  /* ${({isCartPage, isMobile}) => !isCartPage && !isMobile ? 'bottom: 20px; top: auto;' : ''} */

  ${({isCartPage, isMobile}) => isCartPage && !isMobile ? 'width: 514px; right: auto;' : ''}
`

const Link = styled.a`
  cursor: pointer;
  color: #919EAB;
  font-size: 14px;
  line-height: 14px;
  margin-left: 5px;
  text-decoration: none;
  &:hover{
    color: #919EAB !important;
  }
  &:focus {
    color: #919EAB;
  }
`;

function Brend(props) {
  const { isMobile, isCartPage, maxHeightContent } = props;
  return (
    <Conteiner isMobile={isMobile} isCartPage={isCartPage} maxHeightContent={maxHeightContent}>
      <BrendIcon />
      <Link href="https://www.conversionbear.com/powered-by-conversion-bear" target="_blank">Powered by Conversion Bear</Link>
    </Conteiner>
  );
}

export default Brend;
