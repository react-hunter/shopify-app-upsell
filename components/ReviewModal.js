import React from "react";
import Modal from "react-modal";
import "./ReviewModal.scss";
import { Button, Icon } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";

const giveReviewPath =
  "https://apps.shopify.com/honeycomb-upsell-funnels?#modal-show=ReviewListingModal";
const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    right: "auto",
    bottom: "auto",
    width: "70%",
    minWidth: "350px",
    maxHeight: "480px",
    maxWidth: "400px",
    transform: "translate(-50%, -50%)",
    zIndex: 2000,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    padding: "0px 0px 20px 0px"
  }
};

const ReviewModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      style={customModalStyles}
      onRequestClose={onRequestClose}
      contentLabel="Review"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
    >
      {/* <div className='reviewModalHeader'>
          <img src={require(`../static/images/thank_you_amber.png`)}/>
        </div> */}
      <div className="reviewModalBody">
        <h2>{I18n.t("We ⭐️ you too!")}</h2>
        <p>
          It would support us greatly if you left a positive review.
        </p>
        <div className="buttonWrapper">
          <Button
            className="reviewPromptPrimaryButton"
            primary={true}
            external={true}
            url={giveReviewPath}
            onClick={() => {
              amplitude.logEvent("click-review_modal_write_a_review");
            }}
          >
            {I18n.t("Write a Review")}
          </Button>
        </div>
        <a className="reviewPromptSecondaryButton" onClick={onRequestClose}>
          {I18n.t("No thanks")}
        </a>
      </div>
    </Modal>
  );
};

export default ReviewModal;
