import React, { Component } from 'react';
import styled, { keyframes} from 'styled-components';
import classNames from 'classnames';
import { HEXToRGB } from '../../../lib/color';

const DivProgres = styled.div`
  display: flex;
  flex: 1;
  margin: 0 0.4rem;
  background: rgba(${(props) => props.rgb.r}, ${(props) => props.rgb.g}, ${(props) => props.rgb.b}, 0.6);
  /* border-radius: 0.2rem; */
  height: 0.4rem;
  -webkit-clip-path: inset(15% 10% 15% 10% round 2px);
  clip-path: inset(0% 0% 0% 0% round 2px);
`;

const ProgresItems = styled.div`
  display: flex;
  min-height: 2rem;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 0.4rem;
  background: ${(props) => props.top_background_color};
`;

const progressBar = keyframes`
  {
    0% { width: ${(props) => (props.progress ? `${props.progress}%` : '0%')};}
    100% { width: 100%; }
  }
`;

const Indicator = styled.div`
  width: ${(props) => (props.progress ? `${props.progress}%` : '0%')};
  height: 0.4rem;
  background: ${(props) => props.text_color};
  /* border-radius: 0.2rem; */
  -webkit-clip-path: inset(15% 10% 15% 10% round 2px);
  clip-path: inset(0% 0% 0% 0% round 2px);
  &.animation{
    animation-timing-function: linear;
    animation-duration: ${(props) => props.seconds}s;
    animation-name: ${progressBar};
    -webkit-animation-name: ${progressBar};
    -webkit-animation-duration: ${(props) => props.seconds}s;
  }
`;

const ProgresItem = ({ progress, onClick, className, seconds, text_color }) => (
  <DivProgres onClick={onClick} text_color={text_color} rgb={HEXToRGB(text_color) || {r: 1, g: 1 ,b: 1}}>
    <Indicator progress={progress} className={className} text_color={text_color} seconds={seconds} />
  </DivProgres>
);

class ProgressItems extends Component {
  constructor(props) {
    super(props);

    const { maxTime, startTime, settings_theme } = props;
    this.state = {
      progress: settings_theme.countdown_timer.show ? (new Date().getTime() - startTime) * 100 / (maxTime * 1000) : 100,
      seconds: (maxTime - Math.round((new Date().getTime() - startTime) / 1000) || 0),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { settings_theme, isPreview, maxTime, startTime } = nextProps;

    this.setState({
      progress: settings_theme.countdown_timer.show ? (new Date().getTime() - startTime) * 100 / (maxTime * 1000) : 100,
      seconds: maxTime - Math.round((new Date().getTime() - startTime) / 1000) || 0,
    });
  }

  render() {
    const { campaign, active_offer, history_offer, goToOffer, isMobile, isPreview, settings_theme } = this.props;
    const { progress, seconds } = this.state;
    return (
      <ProgresItems id="progress-items" top_background_color={settings_theme.upsell_page.top_background_color}>
        {campaign.offers.map((item, index) => (
          <ProgresItem
            key={`progres-${item._id + index}`}
            className={classNames({
              animation: (() => {

                if (isPreview) {
                  return false;
                }

                if (index < active_offer) {
                  return false;
                }
                if (index > active_offer) {
                  return false;
                }
                if (history_offer === index) {
                  return true;
                }
                return false;
              })(),
            })}
            seconds={seconds}
            text_color={settings_theme.upsell_page.text_color}
            progress={(() => {
              if (isPreview && index == 0) {
                return 100;
              }
              if (index < active_offer) {
                return 100;
              }
              if (index > active_offer) {
                return 0;
              }
              return history_offer === index ? progress : 100;
            })()}
            onClick={() => {
              if (isMobile) {
                goToOffer(index);
              }
            }}
          />
        ))}
      </ProgresItems>
    );
  }
}

export default ProgressItems;
