import React from 'react';
import styled from 'styled-components';


const Description = ({ product, settings_theme, offer }) => {

  const Container = styled.div`
    font-size: 1.6rem;
    line-height: normal;
    padding: 1rem;
    font-family: ${settings_theme.price.font};
    color: ${settings_theme.product.description_text_color || '#212B36'};
    background: ${settings_theme.product.description_bg_color || 'white'};
    padding-bottom: 2rem;
    img,iframe{
      max-width: 100%;
      height: auto;
    }
    h1,h2,h3,h4,h5{
      line-height: normal;
    }
  `;
  
  if (offer && offer.show_offer_description && offer.offer_description) {
    return (<Container className='product-description' dangerouslySetInnerHTML={{ __html:  offer.offer_description}} />);
  }

  if (!settings_theme.product.show_description) {
    return null;
  }

  return (
    <Container className='product-description' dangerouslySetInnerHTML={{ __html: product.body_html }} />
  );
};

export default Description;

