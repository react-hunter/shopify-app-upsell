import React, { Component } from 'react';
import styled from 'styled-components';
import ReactDom from 'react-dom';

const CloseIcon = (props) => {
  return (<svg width="12" height="12"  viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 1.20857L10.7914 0L6 4.79143L1.20857 0L0 1.20857L4.79143 6L0 10.7914L1.20857 12L6 7.20857L10.7914 12L12 10.7914L7.20857 6L12 1.20857Z" fill="#C1C1C1" />
  </svg>);
};

const ClickDiv = styled.div`
  cursor: pointer;
  padding-left: 20px;
  padding-right: 10px;
  height: 26px;
  display: flex;
  align-items: center;
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.swipe = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    };
  }

  componentDidMount() {
    //
    const element = ReactDom.findDOMNode(this);
    element.addEventListener('touchstart', (event) => {
      const { setMinimized } = this.props;
      if (event.target.className !== 'cb-widget-header') {
        setMinimized(true);
        return null;
      }

      const touchobj = event.changedTouches[0];
      // dist = 0
      this.swipe.startX = touchobj.pageX;
      this.swipe.startY = touchobj.pageY;
      event.preventDefault();
    }, false);

    element.addEventListener('touchend', (event) => {
      const { setMinimized } = this.props;
      const touchobj = event.changedTouches[0];
      this.swipe.endX = touchobj.pageX;
      this.swipe.endY = touchobj.pageY;

      if (this.swipe.endY - this.swipe.startY > 50) {
        setMinimized(true);
      }

      event.preventDefault();
    }, false);
  }


  render() {
    const { setMinimized, isMobile, isDemo } = this.props;
    return (
      <div className="cb-widget-header">
        <ClickDiv
          onClick={() => {
            setMinimized(true);
          }}
        >
          <CloseIcon />
        </ClickDiv>
      </div>
    );
  }
}

export default Header;
