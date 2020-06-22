/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Component } from "react";
import "./SearchProducts.scss";
import {
  SearchMajorMonotone,
  MobileCancelMajorMonotone
} from "@shopify/polaris-icons";
import { Icon, InlineError, Spinner } from "@shopify/polaris";
import { findIndex } from "lodash";
import classNames from "classnames";
import { getSearchProducts } from "../../redux/actions";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { I18n } from "react-redux-i18n";
const debouncedGetSearchProducts = AwesomeDebouncePromise(
  getSearchProducts,
  350
);

class SearchProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      products: [],
      products_data: [],
      loading: true
    };
    this._Ref = React.createRef();

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const { input, search_field } = this.props;
      const products = await getSearchProducts("", search_field || "title");
      let ids = [];

      if (Array.isArray(input.value)) {
        ids = input.value.map(item => item.id.toString());
      }
      
      this.setState({
        products: products.filter(product => ids.indexOf(product.id) < 0),
        products_data: products,
        loading: false,
      });
    } catch (error) {
      //
    }
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  handleClick = event => {
    if (
      this._Ref &&
      this._Ref.current &&
      this._Ref.current.contains(event.target)
    ) {
      return;
    }
    this.setState({ active: false });
  };

  handleFocus = () => {
    this.setState({ active: true });
  };

  handleDelete = id => {
    const {
      input: { onChange, value },
      onlyOne
    } = this.props;
    let tmp_value = value;
    if (onChange && onlyOne) {
      onChange(null);
      return;
    }
    if (onChange) {
      tmp_value = value.filter(item => item.id !== id);
      onChange(tmp_value);
    }

    let ids = [];

    if (Array.isArray(tmp_value)) {
      ids = tmp_value.map(item => item.id.toString());
    }

    this.setState({
      products: this.state.products_data.filter(
        product => ids.indexOf(product.id) < 0
      )
    });
  };

  handleSelect = data => {
    let {
      input: { value }
    } = this.props;
    const {
      input: { onChange },
      onlyOne
    } = this.props;
    let tmp_value = value;
    if (onChange && onlyOne) {
      onChange(data);
      return;
    }

    if (!Array.isArray(value)) {
      value = [];
    }
    const index = findIndex(value, ["id", data.id]);
    if (onChange && !~index) {
      tmp_value = [...value, data];
      onChange(tmp_value);
    }
    let ids = [];

    if (Array.isArray(tmp_value)) {
      ids = tmp_value.map(item => item.id.toString());
    }

    this.setState({
      products: this.state.products_data.filter(
        product => ids.indexOf(product.id) < 0
      )
    });
  };

  handleChange = async event => {
    this.setState({ loading: true });
    const { input, search_field } = this.props;
    const products = await debouncedGetSearchProducts(
      event.target.value,
      search_field || "title"
    );

    if (!products) {
      return;
    }

    let ids = [];

    if (Array.isArray(input.value)) {
      ids = input.value.map(item => item.id.toString());
    }
    
    const filteredProducts = products.filter(product => ids.indexOf(product.id) < 0);
    this.setState({ loading: false }, () => {
      this.setState({
        products: filteredProducts,
        products_data: products
      });
    });
  };

  render() {
    const {
      input: { value },
      meta: { error, touched },
      className,
      onlyOne
    } = this.props;
    const { input, source } = this.props;
    const { active, products, loading } = this.state;
    return (
      <div
        className={classNames(
          "SearchProducts",
          { error: error && touched },
          className
        )}
        ref={this._Ref}
      >
        <div className={classNames("input-wrap", { active })}>
          {Array.isArray(value)
            ? value.map(item => (
                <div key={`value-item-${item.id}`} className="value-item">
                  <div className="text">{item.title}</div>
                  <div
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      this.handleDelete(item.id);
                      amplitude.logEvent("click-product_search_delete", {
                        source
                      });
                    }}
                  >
                    <Icon source={MobileCancelMajorMonotone} />
                  </div>
                </div>
              ))
            : null}

          {value && value.id ? (
            <div key={`value-item-${value.id}`} className="value-item">
              <div className="text">{value.title}</div>
              <div
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  this.handleDelete(value.id);
                  amplitude.logEvent("click-product_search_delete", { source });
                }}
              >
                <Icon source={MobileCancelMajorMonotone} />
              </div>
            </div>
          ) : null}
          <div className="input-search">
            <Icon source={SearchMajorMonotone} />
            <input
              placeholder={
                !value || (Array.isArray(value) && !value.length)
                  ? (this.props.onlyOne ? "Select a product" : "Select products")
                  : ""
              }
              onChange={this.handleChange}
              onFocus={() => {
                this.handleFocus();
                amplitude.logEvent("click-product_search_focus", { source });
              }}
            />
          </div>
        </div>

        {active && (
          <div className="list-items">
            {loading ? (
              <div className="block-loader">
                <Spinner size="large" color="teal" />
              </div>
            ) : products.length ? (
              products.map(product => (
                <div
                  key={`product-${product.id}`}
                  onClick={() => {
                    this.handleSelect({ id: product.id, title: product.title });
                    amplitude.logEvent("click-product_select", { source });
                  }}
                  className="item"
                >
                  <div
                    className={classNames("image","fade-in")}
                    style={{
                      backgroundImage: `url(${
                        product.featuredImage
                          ? product.featuredImage.originalSrc
                          : null
                      })`
                    }}
                  />
                  <p>{product.title}</p>
                </div>
              ))
            ) : (
              <div className="no-search-results">
                {I18n.t("We couldn’t find products matching your search Try another search term?")}
              </div>
            )}
            {active && products.length > 0 && !loading && 
            <div className="last-list-item-refine-search">
              { products.length === 1 ?
              I18n.t("Showing 1 product Refine your search to view more") :
              I18n.t("Showing %{numOfProducts} products Refine your search to view more",{numOfProducts: products.length})
              }
              </div>}
          </div>
        )}
        {touched && error && <InlineError message={error} />}
      </div>
    );
  }
}

export default SearchProducts;
