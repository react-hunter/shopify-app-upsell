import React, { Component } from 'react';
import styled from 'styled-components';
import ProductTitle from './ProductTitle';
import Description from './Description';
import IconShipping from './icons/IconShipping';
import Options from './Options';
import SliderImages from './SliderImages';
import NextOfferMobile from './NextOfferMobile';

const Container = styled.div`
  /* display: flex; */
  /* flex: 1; */
  /* flex-direction: column; */
  /* padding: 1.6rem; */
`;

const DivText = styled.div`
  /* padding: 1.6rem; */
  position: relative;
  display: flex;
  flex-direction: column;
  /* text-align: center; */
  /* justify-content: center; */
`;

const OldPrice = styled.div`
  font-size: 1.6rem;
  line-height: 1.9rem;
  margin-top: 0.6rem;
  color: ${(props) => props.settings_theme.price.old_price_color || '#DE3618'};
  display: inline-block;
  font-family: ${(props) => props.settings_theme.price.font};
  text-align: center;
  text-decoration: line-through;
`;
const Price = styled.div`
  font-weight: bold;
  font-size: 2.6rem;
  line-height: 3.1rem;
  margin-top: 0.8rem;
  color: ${(props) => props.settings_theme.price.new_price_color || '#50B83C'};
  font-family: ${(props) => props.settings_theme.price.font};
  text-align: center;
`;

const YouSave = styled.div`
  font-size: 1.6rem;
  line-height:  ${(props) => props.settings_theme.product.font == 'Pacifico' ? 1.8 : 1.3};
  color: ${(props) => props.settings_theme.price.new_price_color || '#50B83C'};
  margin-top: 0.3rem;
  font-family: ${(props) => props.settings_theme.price.font};
  text-align: center;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;
  padding: 0 1rem;
`;

const BlockShipping = styled.div`
  display: flex;
  margin-top: 0.6rem;
  justify-content: center;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FreeShipping = styled.div`
  border: 0.1rem solid ${(props) => props.settings_theme.price.text_color || '#DE3618'};
  box-sizing: border-box;
  border-radius: 0.5rem;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.4rem;
  color: ${(props) => props.settings_theme.price.text_color || '#DE3618'};
  font-family: ${(props) => props.settings_theme.price.font};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;


class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      settings_theme,
      currecy_format,
      offer,
      variant,
      quantity,
      onChangeVariant,
      onChangeQuantity,
      active_offer,
      isMobile,
      pageToShow,
      isPreview,
    } = this.props;

    const free_shipping = offer.free_shipping;

    const product = offer.product;

    const compare_at_price = !isNaN(parseFloat(variant.compare_at_price)) ? parseFloat(variant.compare_at_price) : 0;
    const price = !isNaN(parseFloat(variant.price)) ? parseFloat(variant.price) : 0;

    const discount_text = settings_theme.price.discount_text.replace('{{discount-amount}}', currecy_format.replace(/\{\{.*?\}\}/, (compare_at_price - price).toFixed(2)).replace(/<[^>]*>/g, ''));

    return (
      <Container className='product'>
        <DivText>
          <NextOfferMobile {...this.props} />
          <ProductTitle className='product-title' product={product} settings_theme={settings_theme} />
          <React.Fragment>
            <PriceContainer className='product-price_container'>
              {price < compare_at_price &&
                <OldPrice className='product-old_price' settings_theme={settings_theme}>
                    {currecy_format.replace(/\{\{.*?\}\}/, parseFloat(variant.compare_at_price).toFixed(2)).replace(/<[^>]*>/g, '')}
                </OldPrice>}
              <Price className='product-price' settings_theme={settings_theme}>{currecy_format.replace(/\{\{.*?\}\}/, parseFloat(variant.price).toFixed(2)).replace(/<[^>]*>/g, '')}</Price>
             </PriceContainer>
            {price < compare_at_price && <YouSave className='product-subprices_section' settings_theme={settings_theme}>{discount_text}</YouSave>}
            {free_shipping && <BlockShipping className='product-shipping' settings_theme={settings_theme}>
              <FreeShipping settings_theme={settings_theme} className='product-free-shipping'>
                <IconShipping className='product-shipping-icon' style={{ marginRight: '0.8rem', fill: settings_theme.price.text_color }} fill={settings_theme.price.text_color} /> {settings_theme.price.text}
              </FreeShipping>
            </BlockShipping>}
          </React.Fragment>
        </DivText>
        <SliderImages elementScroll={this.props.elementScroll} pageToShow={pageToShow} images={product.images} isMobile={isMobile} active_offer={active_offer} variant={variant} settings_theme={settings_theme} isPreview={isPreview}/>
        {/* images={product.images.map((item) => item.src)} */}
        <Options
          className='product-options'
          variant={variant}
          quantity={quantity}
          product={product}
          settings_theme={settings_theme}
          onChangeVariant={onChangeVariant}
          onChangeQuantity={onChangeQuantity}
          offer={offer}
        />
        <DivText>
          <Description className='product-description' product={product} settings_theme={settings_theme} offer={offer} />
        </DivText>
      </Container>
    );
  }
}

export default Product;
