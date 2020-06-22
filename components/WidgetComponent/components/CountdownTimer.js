import React, { Component } from 'react';
import findIndex from 'lodash.findindex';
import classNames from 'classnames';
import styled from 'styled-components';
import config from '../../../redux/config';
import NextOfferMobile from './NextOfferMobile';

const { colors } = config;

const Container = styled.div`
  display: flex;
  background: ${(props) => props.background_color};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 0.2rem;
  padding: 0.9rem 1rem;
  position: relative;
  margin: 0 1rem;
  ${(props) => (props.minimized ? 'margin-bottom: 1rem' : '')};
  opacity: 1;
  &.fadeDownColor{
    transition: opacity .5s;
    -moz-transition: opacity .5s;
    -webkit-transition: opacity .5s;
    opacity: 0;
    ${(props) => {
      return props.minimized ? `height: calc(100vh - ${props.containerHeight - props.height - 10}px)` : `min-height: ${props.height}px`;
    }};
    ${(props) => (props.minimized ? 'margin: 0 !important' : '')};
    ${(props) => (props.minimized || props.animateHeight ? 'padding: 0 !important;' : '')};
    ${(props) => (props.animateHeight ? 'display: block !important;' : '')};
  }
  &.fadeDownHeight{
    transition: min-height .5s linear;
    -moz-transition: min-height .5s linear;
    -webkit-transition: min-height .5s linear;
    min-height: 0px;
  }
`;

const ContainerText = styled.div`
  color: ${(props) => props.countdown_timer.text_color};
  font-size: ${(props) => props.countdown_timer.text_size / 10}rem;
  line-height: ${(props) => (parseInt(props.countdown_timer.text_size, 10) + 3) / 10}rem;
  font-family: ${(props) => props.countdown_timer.font};
  text-align: center;
`;

class CountdownTimer extends Component {
  constructor(props) {
    super(props);

    const { startTime, maxTime, isPreview } = props;

    this.state = {
      seconds: isPreview ? maxTime : (maxTime - Math.round((new Date().getTime() - startTime) / 1000) || 0),
      startTime,
      maxTime,
      animateHeight: false,
      height: 0,
      containerHeight: 0,
      hideContent: false,
    };

    this.refElement = React.createRef();
    this.refTimer = React.createRef();

    this.timer = null;
    this.animateTimer = null;
  }

  componentWillReceiveProps(nextProps) {
    const { startTime, maxTime, isPreview, active_offer, hideCountDownTimerItems } = nextProps;
    if (isPreview) {
      // this.setState({
      //   seconds: maxTime,
      //   maxTime,
      // });
      this.state.seconds = maxTime;
      this.state.maxTime = maxTime;
      const timers = this._getTimes();
      const text = `${timers.minutes_10}${timers.minutes}:${timers.seconds_10}${timers.seconds}`;

      if (this.refTimer.current) {
        this.refTimer.current.innerText = text;
      }
      return null;
    }

    if (!hideCountDownTimerItems[`offer_${active_offer}`]) {
      this.state.seconds = maxTime - Math.round((new Date().getTime() - startTime) / 1000) || 0;
      this.state.startTime = startTime;
      this.state.maxTime = maxTime;

      const timers = this._getTimes();
      const text = `${timers.minutes_10}${timers.minutes}:${timers.seconds_10}${timers.seconds}`;

      if (this.refTimer.current) {
        this.refTimer.current.innerText = text;
      }

      this.startInterval();

      // this.setState({
      //   seconds: maxTime - Math.round((new Date().getTime() - startTime) / 1000) || 0,
      //   startTime,
      //   maxTime,
      // }, () => {
      //   this.startInterval();
      // });
    }
  }

  componentDidMount() {
    const { isPreview, active_offer, hideCountDownTimerItems, containerHeight } = this.props;
    if (this.refElement.current) {
      this.state.height = this.refElement.current.clientHeight;
    }

    if (containerHeight === 0) {
      setTimeout(() => {
        const { containerHeight } = this.props;
        if (containerHeight !== 0) {
          this.state.containerHeight = containerHeight;
        }
      }, 1000);
    } else {
      this.state.containerHeight = containerHeight;
    }

    if (isPreview || hideCountDownTimerItems[`offer_${active_offer}`]) {
      return null;
    }
    this.startInterval();
  }

  startInterval = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const { nextOffer } = this.props;
      const { startTime, maxTime } = this.state;
      const { isPreview, campaign, active_offer, setItemHideCountDownTimer, setCountDownTimerAnimate, minimized } = this.props;
      if (isPreview) {
        return;
      }

      const seconds = maxTime - Math.round((new Date().getTime() - startTime) / 1000);
      if (seconds <= 0) {
        nextOffer();
        if (active_offer === campaign.offers.length - 1) {
          this.setState({ seconds: 0, animate: true }, () => {
            if (setCountDownTimerAnimate) {
              setCountDownTimerAnimate();
            }
            setTimeout(() => {
              if (minimized) {
                this.setState({ hideContent: true });
                if (setCountDownTimerAnimate) {
                  setCountDownTimerAnimate();
                }
              } else {
                this.setState({
                  animateHeight: true,
                });
              }
            }, 500);

            setTimeout(() => {
              setItemHideCountDownTimer(`offer_${active_offer}`, true);
            }, 1000);
          });
        } else {
          this.setState({ seconds: 0 });
          if (this.refTimer.current) {
            this.refTimer.current.innerText = '00:00';
          }
        }
        clearInterval(this.timer);
        return;
      }
      if (this.state.seconds) {
        this.state.seconds = maxTime - Math.round((new Date().getTime() - startTime) / 1000);
        const timers = this._getTimes();
        const text = `${timers.minutes_10}${timers.minutes}:${timers.seconds_10}${timers.seconds}`;
        if (this.refTimer.current) {
          this.refTimer.current.innerText = text;
        }
        // this.setState({ animate: false, seconds: maxTime - Math.round((new Date().getTime() - startTime) / 1000) });
      }
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.animateTimer);
  }

  _getTimes = () => {
    const minutes = Math.floor(this.state.seconds / 60);
    const seconds = this.state.seconds - minutes * 60;
    return {
      minutes_10: minutes >= 10 ? Math.floor(minutes / 10) : 0,
      minutes: minutes >= 10 ? minutes - Math.floor(minutes / 10) * 10 : minutes,
      seconds_10: seconds >= 10 ? Math.floor(seconds / 10) : 0,
      seconds: seconds >= 10 ? seconds - Math.floor(seconds / 10) * 10 : seconds,
    };
  };


  render() {
    const { settings_theme: { countdown_timer }, hideCountDownTimerItems, active_offer, minimized } = this.props;

    if (!countdown_timer.show) {
      return null;
    }

    if (hideCountDownTimerItems[`offer_${active_offer}`]) {
      return null;
    }

    let background_color = 'linear-gradient(180deg, #4200FF 0%, #AD00FF 100%)';

    if (countdown_timer.background_color) {
      background_color = countdown_timer.background_color;
      if (countdown_timer.background_color.indexOf('gradient_') > -1) {
        const index = findIndex(colors.gradients, [
          'name',
          countdown_timer.background_color,
        ]);
        if (index > -1) {
          background_color = colors.gradients[index].style;
        }
      }
    }

    const timers = this._getTimes();

    return (
      <Container
        height={this.state.height}
        containerHeight={this.state.containerHeight}
        animateHeight={this.state.animateHeight}
        className={classNames({
          fadeDownColor: this.state.animate,
          fadeDownHeight: this.state.animateHeight,
          
        },'countdown-timer')}
        background_color={background_color}
        id="count-down-timer"
        minimized={minimized}
        ref={this.refElement}
      >
        {!this.state.hideContent ? <NextOfferMobile {...this.props} /> : null}
        {!this.state.hideContent ? <ContainerText countdown_timer={countdown_timer} >{countdown_timer.bar_text} <span ref={this.refTimer}>{timers.minutes_10}{timers.minutes}:{timers.seconds_10}{timers.seconds}</span></ContainerText> : null}
      </Container>
    );
  }
}

export default CountdownTimer;
