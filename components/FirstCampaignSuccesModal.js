import Modal from "react-modal";
import { MobileCancelMajorMonotone } from "@shopify/polaris-icons";
import { Button, Icon, TextField } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import styled from "styled-components";

export default class FirstCampaignSuccesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    if(this.props.isOpen){
      amplitude.logEvent("show-first_campaign_success_modal");
    }
    window.scrollTo(0, 0);
  }

  render() {
    const customModalStyles = {
      content: {
        top: "50%",
        left: "50%",
        marginRight: "-50%",
        right: "auto",
        bottom: "auto",
        maxHeight: "500px",
        maxWidth: "530px",
        transform: "translate(-50%, -50%)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        padding: "10px 40px 30px 40px"
      }
    };

    const CloseButton = styled.div`
      position: absolute;
      right: 6px;
      button {
        background: none;
        border: none;
        cursor: pointer;
        fill: #919eab;
      }
    `;
    const ModalBody = styled.div`
      display: flex;
      flex-direction: column;
      margin-top: 18px;
      height: 100%;
      max-width: 420px;
      margin: 10px auto auto auto;
      text-align: center;
      svg {
        margin: auto;
      }
      h2 {
        font-size: 16px;
        font-weight: 600;
        margin-top: 30px;
      }
      p {
        margin-top: 10px;
        margin-bottom: 20px;
      }
    `;

    const SecondayButton = styled.a`
      text-decoration: underline;
      cursor: pointer;
      color: #5362b3;
      margin-right: 40px;
      margin-top: auto;
      margin-bottom: auto;
    `;

    const ButtonWrapper = styled.div`
      display: flex;
      justify-content: center;
    `;

    const { isOpen, onRequestClose } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        style={customModalStyles}
        onRequestClose={onRequestClose}
        contentLabel="Partners"
        ariaHideApp={false}
      >
        <CloseButton>
          <button onClick={onRequestClose}>
            <Icon source={MobileCancelMajorMonotone}></Icon>
          </button>
        </CloseButton>

        <ModalBody>
          <img src={require("../static/images/confetti.svg")} alt="success"/>
          <h2>{I18n.t("You’re now ready to get your first upsell!")}</h2>
          <p>
            {I18n.t(
              "Quick note when customers accept offers and intiate checkout - a draft order will be created You should only consider completed upsell orders that appear in your orders list"
            )}
          </p>

          <ButtonWrapper>
            <SecondayButton
              href="https://conversionbear.freshdesk.com/support/solutions/articles/48001140187-what-are-draft-orders-"
              target="_blank"
              onClick={onRequestClose}
            >
              {I18n.t("Learn More")}
            </SecondayButton>
            <Button
              primary
              size="medium"
              onClick={() => {
                amplitude.logEvent("click-affiliate_get_link", {
                  email: this.state.email,
                });
                onRequestClose();
              }}
            >
              {I18n.t("Got it")}
            </Button>
          </ButtonWrapper>
        </ModalBody>
      </Modal>
    );
  }
}