import React, { Component } from 'react';
import styled from 'styled-components';
import Select from './Select';
import Quantity from './Quantity';

class Options extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (event) => {

    const options = {
      option1: this.props.variant.option1 || null,
      option2: this.props.variant.option2 || null,
      option3: this.props.variant.option3 || null,
      ...{ [event.target.name]: event.target.value },
    };

    let variant = {};

    if (!this.props.product.variants.some((item) => {
      let isValidVariant = true;

      Object.keys(options).forEach((key) => {
        if (options[key] !== item[key]) {
          isValidVariant = false;
        }
      });

      if (isValidVariant) {
        variant = item;
        return true;
      }
      return false;
    })) {
      variant = { ...options, isUnavailable: true };
    }

    if (this.props.onChangeVariant) {
      this.props.onChangeVariant(variant);
    }
  };

  render() {
    const { product, settings_theme, variant, onChangeQuantity, quantity, offer } = this.props;
    const Container = styled.div`
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      padding: 1rem;
    `;

    const Row = styled.div`
      display: flex;
      flex-direction: row;
      margin-bottom: 0.8rem;
    `;


    return (
      <Container>
        <Row>
          {product.options.map((option, index) => (
            index < 2 ? <Select
              style={{ marginLeft: index === 0 ? 0 : '0.8rem' }}
              label={option.name}
              key={`option-${option.id}-${index}`}
              name={`option${index + 1}`}
              value={variant[`option${index + 1}`]}
              options={option.values.map((item) => ({ title: item, value: item }))}
              settings={settings_theme}
              onChange={this.onChange}
            /> : null
          ))}

          {product.options.length == 1 && settings_theme.product.show_quantity &&
          ((offer.limit_products && offer.limit_products_amount > 1) || !offer.limit_products) ?
            <Quantity
              style={{
                marginLeft: '0.8rem',
              }}
              quantity={quantity}
              onChange={onChangeQuantity}
              settings={settings_theme}
              label={settings_theme.product.quantity_text}
            />
            : null}
        </Row>
        {product.options.length !== 1 ? <Row>
          {product.options.length == 3 ? <Select
            style={{ marginRight: '0.8rem' }}
            label={product.options[2].name}
            name="option3"
            value={variant.option3}
            options={product.options[2].values.map((item) => ({ title: item, value: item }))}
            settings={settings_theme}
            onChange={this.onChange}
          /> : null}
          {settings_theme.product.show_quantity &&
          ((offer.limit_products && offer.limit_products_amount > 1) || !offer.limit_products) ?
            <Quantity
              style={{
                paddingRight: product.options.length == 3 ? 0 : '0.4rem',
              }}
              quantity={quantity}
              onChange={onChangeQuantity}
              settings={settings_theme}
              label={settings_theme.product.quantity_text}
            /> : null}
        </Row> : null}
      </Container>
    );
  }
}

export default Options;
