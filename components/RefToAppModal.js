import React from "react";
import Modal from "react-modal";
import "./RefToAppModal.scss";
import { MobileCancelMajorMonotone } from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";

const upsellAppStorePath = `https://apps.shopify.com/auto-multi-currency-converter?utm_source=shopify&utm_campaign=modal-currency-tab`;
const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    right: "auto",
    bottom: "auto",
    height: "80%",
    width: "70%",
    minWidth: "500px",
    minHeight: "400px",
    maxHeight: "430px",
    maxWidth: "530px",
    transform: "translate(-50%, -50%)",
    zIndex: 2000,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "20px 0px",
    // backgroundImage: `url('/static/popup_background.svg');`,
    // backgroundColor: `linear-gradient(180.07deg, #310948 22.03%, #3C0B6A 99.93%)`,
    // backgroundColor: 'purple',
    background: `url('/static/images/popup_background.svg'), linear-gradient(180.07deg, #310948 22.03%, #3C0B6A 99.93%)`
  }
};

const RefToAppModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      style={customModalStyles}
      onRequestClose={onRequestClose}
      contentLabel="Auto Multi Currency Converter"
      ariaHideApp={false}
    >
      <div className="refToStickyModalHeader">
        <button onClick={onRequestClose} className="modalCloseButton">
          <Icon color={"white"} source={MobileCancelMajorMonotone}></Icon>
        </button>
      </div>
      <div className="refToStickyModalBody">
        <img src="../static/images/currency_popup.svg" />
        <h2>{I18n.t("Auto Multi Currency Converter")}</h2>
        <p>
          {I18n.t(
            "Show prices in customers local currency automatically 100% FREE!"
          )}
        </p>
        <a
          className="refToOtherAppStickyAppButton"
          href={upsellAppStorePath}
          target="blank"
          onClick={onRequestClose}
        >
          <img src="../static/images/white_shopify_get_app_icon.svg" />
        </a>
      </div>
    </Modal>
  );
};

export default RefToAppModal;
