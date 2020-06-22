/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import './ReviewBar.scss';
import { ReviewStarFull, ReviewStarEmpty } from './illustrations';
import ReviewModal from './ReviewModal';

const provideFeedbackPath = 'https://www.conversionbear.com/feedback';
const reviewTextIndicator = [
  'Pretty bad',
  'Not so good',
  'Good',
  'Very good',
  'Awesome',
];

class ReviewBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRank: 0,
      modalActive: false,
    };
    this.hideStars = this.hideStars.bind(this);
    this.showStars = this.showStars.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  handleModalOpen() {
    this.setState({
      modalActive: !this.state.modalActive,
    });
  }

  handleModalClose() {
    this.setState({
      modalActive: !this.state.modalActive,
    });
  }


  hideStars() {
    this.setState({ selectedRank: 0 });
    // console.debug(`hideStars`)
  }

  showStars(num) {
    this.setState({ selectedRank: num });
    // console.debug(`hideStars: ${num}`)
  }


  render() {
    return (
      <div className="reviewBarContainer">
        <img alt="" src="./static/images/reviewModalIllustration.svg" style={{ display: 'none' }} />
        <img
          className="reviewBarImage"
          src="./static/images/reviewBear.svg"
          alt=""
        />
        <div className="reviewBarText">
          <h2 className="Polaris-Heading">Show me the honey</h2>
          <p>Let us know what you think about the app 👉</p>
        </div>
        <div className="reviewBar">
          <a
            href={provideFeedbackPath}
            target="blank"
          >
            <div
              className="reviewStar"
              onMouseOver={() => { this.showStars(1); }}
              onMouseOut={this.hideStars}
              onClick={() => { amplitude.logEvent('click_review', { value: 1, origin: 'bottom' }); }}
            >
              {(this.state.selectedRank > 0)
              ? <ReviewStarFull />
              : <ReviewStarEmpty />
              }
            </div>
          </a>
          <a
            href={provideFeedbackPath}
            target="blank"
          >
            <div
              className="reviewStar"
              onMouseOver={() => { this.showStars(2); }}
              onMouseOut={this.hideStars}
              onClick={() => { amplitude.logEvent('click_review', { value: 2, origin: 'bottom' }); }}
            >
              {(this.state.selectedRank > 1)
              ? <ReviewStarFull />
              : <ReviewStarEmpty />
              }
            </div>
          </a>
          <a
            href={provideFeedbackPath}
            target="blank"
          >
            <div
              className="reviewStar"
              onMouseOver={() => { this.showStars(3); }}
              onMouseOut={this.hideStars}
              onClick={() => { amplitude.logEvent('click_review', { value: 3, origin: 'bottom' }); }}
            >
              {(this.state.selectedRank > 2)
              ? <ReviewStarFull />
              : <ReviewStarEmpty />
              }
            </div>
          </a>
          <a
            href={provideFeedbackPath}
            target="blank"
          >
            <div
              className="reviewStar"
              onMouseOver={() => { this.showStars(4); }}
              onMouseOut={this.hideStars}
              onClick={() => { amplitude.logEvent('click_review', { value: 4, origin: 'bottom' }); }}
            >
              {(this.state.selectedRank > 3)
                ? <ReviewStarFull />
                : <ReviewStarEmpty />
              }
            </div>
          </a>
          <div
            className="reviewStar"
            onMouseOver={() => { this.showStars(5); }}
            onMouseOut={this.hideStars}
            onClick={() => {
              this.handleModalOpen();
              amplitude.logEvent('click_review', { value: 5, origin: 'bottom' });

            }}
          >
            {(this.state.selectedRank > 4)
              ? <ReviewStarFull />
              : <ReviewStarEmpty />
            }
          </div>
          <div className="reviewTextIndicator">
            {(this.state.selectedRank > 0) &&
              <p>{reviewTextIndicator[this.state.selectedRank - 1]}</p>}
          </div>
        </div>
        <ReviewModal
          isOpen={this.state.modalActive}
          onRequestClose={this.handleModalClose}
        />
      </div>
    );
  }
}

export default ReviewBar;
