import Modal from "react-modal";
import { MobileCancelMajorMonotone } from "@shopify/polaris-icons";
import { Button, Icon, TextField } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import styled from "styled-components";

export default class AffiliateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email || "",
      subscribedToMailingList: this.props.subscribedToMailingList || false,
      loading: false
    };

  }

  componentDidMount(){
    if(this.props.isOpen){
      amplitude.logEvent("show-affiliate_modal");
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
        height: "90%",
        width: "70%",
        maxHeight: "500px",
        maxWidth: "530px",
        transform: "translate(-50%, -50%)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        padding: "20px 10px"
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
      margin-top: 20px;
      margin-bottom: 20px;
    `;

    const SubscribeToEmailListTextInput = styled.div`
      width: 235px;
      margin: 0px auto;
    `;

    const SubscribeButtonContainer = styled.div`
      margin: 20px auto 0px auto;
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
          <img src="./static/images/partner_hands.svg" />
          <h2>{I18n.t("We 🧡 Partnerships")}</h2>
          <p>
            {I18n.t(
              "Earn money for every new install Get up to 20% monthly recurring commission for every store you refer"
            )}
          </p>
          <SubscribeToEmailListTextInput>
            <TextField
              value={this.state.email}
              align="center"
              type="email"
              autoComplete="email"
              error={this.state.error}
              disabled={this.state.subscribedToMailingList}
              placeholder="steven@example.com"
              onChange={newValue => {
                if (this.state.error) {
                  this.setState({
                    error: null
                  });
                }
                this.setState({
                  email: newValue
                });
              }}
              focused={true}
            />
          </SubscribeToEmailListTextInput>

          <SubscribeButtonContainer>
            <Button
              primary
              size="large"
              disabled={this.state.subscribedToMailingList}
              loading={this.state.loading}
              error={this.state.error}
              onClick={() => {
                amplitude.logEvent("click-affiliate_get_link", {
                  email: this.state.email
                });
                console.log("button clicked");
                const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!this.state.email.match(pattern)) {
                  this.setState({
                    error: "That email doesn't look right"
                  });
                  return;
                }
                this.setState({ loading: true });

                fetch("/default/add_partner_to_affiliate_program", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ email: this.state.email })
                })
                  .then(response => response.json())
                  .then(response => {
                    console.log(response);
                    amplitude.logEvent("track-affiliate_link_email_sent", {
                      email: this.state.email
                    });
                    setTimeout(() => {
                      this.setState(
                        {
                          subscribedToMailingList: true,
                          loading: false
                        },
                        () => {
                          setTimeout(() => {
                            onRequestClose();
                          }, 2000);
                        }
                      );
                    }, 1000);
                  })
                  .catch(err => {
                    amplitude.logEvent("error-affiliate_link_email_sent", {
                      email: this.state.email
                    });
                    this.setState({
                      loading: false,
                      error:
                        "Looks like we can't subscribe you at the moment. Try again later?"
                    });
                  });
              }}
            >
              {this.state.subscribedToMailingList
                ? I18n.t("Go check your inbox 📬")
                : I18n.t("Get Affiliate Link")}
            </Button>
          </SubscribeButtonContainer>
          <SecondayButton onClick={onRequestClose}>
            {I18n.t("Maybe Later")}
          </SecondayButton>
        </ModalBody>
      </Modal>
    );
  }
}