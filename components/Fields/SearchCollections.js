/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Component } from "react";
import "./SearchCollections.scss";
import {
  SearchMajorMonotone,
  MobileCancelMajorMonotone
} from "@shopify/polaris-icons";
import { Icon, InlineError, Spinner } from "@shopify/polaris";
import { findIndex } from "lodash";
import classNames from "classnames";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { getSearchCollections } from "../../redux/actions";
import { I18n } from "react-redux-i18n";
const debouncedGetSearchCollections = AwesomeDebouncePromise(
  getSearchCollections,
  350
);

class SearchCollections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      collections: [],
      collections_data: [],
      loading: true,
      searchQuery: ""
    };
    this._Ref = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const { input } = this.props;
      const collections = await getSearchCollections("");
      let ids = [];

      if (Array.isArray(input.value)) {
        ids = input.value.map(item => item.id.toString());
      }

      this.setState({
        collections: collections.filter(
          collection => ids.indexOf(collection.id) < 0
        ),
        collections_data: collections,
        loading: false,
      });
    } catch (error) {
      // console.log(
      //   "TCL: SearchCollections -> componentDidMount -> error",
      //   error
      // );
    }
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  handleClick = event => {
    if (this._Ref && this._Ref.current && this._Ref.current.contains(event.target)) {
      return;
    }
    this.setState({ active: false });
  };

  handleFocus = () => {
    this.setState({ active: true });
  };

  handleDelete = id => {
    const {
      input: { onChange, value }
    } = this.props;
    let tmp_value = value;
    if (onChange) {
      tmp_value = value.filter(item => item.id !== id);
      onChange(tmp_value);
    }

    let ids = [];

    if (Array.isArray(tmp_value)) {
      ids = tmp_value.map(item => item.id.toString());
    }

    this.setState({
      collections: this.state.collections_data.filter(
        collection => ids.indexOf(collection.id) < 0
      )
    });
  };

  handleSelect = data => {
    let {
      input: { value }
    } = this.props;
    const {
      input: { onChange }
    } = this.props;

    if (!Array.isArray(value)) {
      value = [];
    }
    let tmp_value = value;
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
      collections: this.state.collections_data.filter(
        collection => ids.indexOf(collection.id) < 0
      )
    });
  };

  handleChange = async event => {
    this.setState({loading: true});
    const { input } = this.props;
    const searchQuery = event.target.value;
    const collections = await debouncedGetSearchCollections(event.target.value);
    let ids = [];
    

    if (Array.isArray(input.value)) {
      ids = input.value.map(item => item.id.toString());
    }

    this.setState({
      collections: collections.filter(
        collection => ids.indexOf(collection.id) < 0
      ),
      collections_data: collections,
      loading: false,
      searchQuery: searchQuery,
    });
  };

  render() {
    const {
      input: { value },
      meta: { error, touched }
    } = this.props;
    const { input, source } = this.props;
    const { active, collections, loading, searchQuery } = this.state;
    return (
      <div
        className={classNames("SearchCollections", { error: error && touched })}
        ref={this._Ref}
      >
        <div className={classNames("input-wrap", { active })}>
          {Array.isArray(value)
            ? value.map(item => (
                <div key={`value-item-${item.id}`} className="value-item">
                  {item.title}
                  <div
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      this.handleDelete(item.id);
                      amplitude.logEvent("click-collection_search_delete", {
                        source
                      });
                    }}
                  >
                    <Icon source={MobileCancelMajorMonotone} />
                  </div>
                </div>
              ))
            : null}
          <div className="input-search">
            <Icon source={SearchMajorMonotone} />
            <input
              placeholder="Select collections"
              onChange={this.handleChange}
              onFocus={() => {
                this.handleFocus();
                amplitude.logEvent("click-collection_search_focus", { source });
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
            ) : collections.length ? (
                collections.map(collection => (
                  <div
                    key={`collection-${collection.id}`}
                    onClick={() => {
                      this.handleSelect({
                        id: collection.id,
                        title: collection.title
                      });
                      amplitude.logEvent("click-collection_select", { source });
                    }}
                    className="item"
                  >
                    <p>{collection.title}</p>
                  </div>
                ))
            ) : searchQuery !== '' && (
              <div className="no-search-results">
                {I18n.t(
                  "We couldn’t find collections matching your search Try another search term?"
                )}
              </div>)}
          </div>
        )}
        {touched && error && <InlineError message={error} />}
      </div>
    );
  }
}

export default SearchCollections;
