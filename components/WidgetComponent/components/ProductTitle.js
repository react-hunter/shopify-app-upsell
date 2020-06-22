import React from 'react';
import styled from 'styled-components';


const ProductTitle = ({ product, settings_theme, className }) => {
  const Container = styled.div`
    font-weight: bold;
    font-size: 2.2rem;
    /* line-height: 3.2rem; */
    /* max-height: 7.1rem; */
    justify-content: center;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin: 0 1rem;
    margin-top: 1rem;
    /* white-space: wrap; */
    color: ${settings_theme.product.text_color || '#212B36'};
    font-family: ${settings_theme.product.font};
    line-height:  ${settings_theme.product.font == 'Pacifico' ? 1.8 : 1.3};
  `;
  return (
    <Container className={className}> {product.title} </Container>
  );
};

export default ProductTitle;
