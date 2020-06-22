import React, { Component, useEffect, useState } from 'react';
import styled from 'styled-components';

/**
 * dataSource => array of strings (image url)
 * isMobile => boolean
 */

const Slider = styled.div`
  width: 100%;
  height: 16.8rem;
`;

const Wrapper = styled.div`
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const Items = styled.div`
  width: 1100rem;
  position: relative;
  top: 0;
  left: -30rem;
`;

const Slide = styled.div`
  width: 23.6rem;
  height: 16.8rem;
  margin: 0 0.5rem;
  cursor: pointer;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 1s;
  position: relative;
`;

const SlideImg = styled.img`
  width: auto;
  height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
`;

const LeftArea = styled.div`
  position: absolute;
  width: 25%;
  height: 16.8rem;
  z-index: 3;
`;

const RightArea = styled.div`
  position: absolute;
  width: 25%;
  height: 16.8rem;
  z-index: 3;
  top: 0;
  right: 0;
`;

const DesktopButton = styled.div`
  position: absolute;
  width: 2.9rem;
  height: 4rem;
  background: rgba(0, 0, 0, 0.2);
  top: 6.5rem;
  left: 0;
  z-index: 5;
  cursor: pointer;
`;

const RightButton = styled(DesktopButton)`
  left: calc(100% - 2.9rem);
`;

const LeftButton = styled(DesktopButton)``;

const Arrow = styled.i`
  position: absolute;
  top: 43%;
  left: 1.1rem;
  border: solid white;
  border-width: 0 0.2rem 0.2rem 0;
  display: inline-block;
  padding: 0.3rem;
  transform: ${(props) => props.rotate || 'rotate(135deg)'};
`;

class ComponentSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentWidth: null,
      slideSize: 236,
    };
  }

  componentDidMount() {
    const iframeDocument = document.getElementById('widget').contentWindow.document;
    const parentElem = iframeDocument.getElementById('slider').parentNode;
    const parentWidth = parentElem ? parentElem.offsetWidth : '320px';
    this.setState({ parentWidth });
    this.InitContainers(iframeDocument, parentWidth);
  }

  InitContainers(iframeDocument, parentWidth) {
    const slider = iframeDocument.getElementById('slider');
    const sliderItems = iframeDocument.getElementById('items');

    const mobileButtons = [];
    mobileButtons[0] = iframeDocument.getElementById('left-control-arrea');
    mobileButtons[1] = iframeDocument.getElementById('right-control-arrea');

    const deskButtons = [];
    deskButtons[0] = iframeDocument.getElementById('left-control-button');
    deskButtons[1] = iframeDocument.getElementById('right-control-button');

    this.slide(slider, sliderItems, mobileButtons, deskButtons, iframeDocument, parentWidth);
  }

  slide(wrapper, items, mobileButtons, deskButtons, iframeDocument, parentWidth) {
    const { dataSource, isMobile } = this.props;
    let posX1 = 0;
    let posX2 = 0;
    let posInitial;
    let posFinal;
    const threshold = 100;
    const slides = items.getElementsByClassName('slide');
    const slidesLength = dataSource.length;
    const slideSize = items.getElementsByClassName('slide')[0].offsetWidth;
    this.setState({ slideSize });
    const firstSlide = slides[0];
    const secondSlide = slides[1] || slides[0];
    const lastSlide = slides[slidesLength - 1];
    const preLastSlide = slides[slidesLength - 2] || slides[slidesLength - 1];
    const cloneFirst = firstSlide.cloneNode(true);
    const cloneSecond = secondSlide.cloneNode(true);
    const cloneLast = lastSlide.cloneNode(true);
    const clonePreLast = preLastSlide.cloneNode(true);
    let index = 0;
    let allowShift = true;

    // Clone first and last slide
    items.appendChild(cloneFirst);
    items.appendChild(cloneSecond);

    items.insertBefore(clonePreLast, firstSlide);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');

    // Mouse and Touch events
    items.onmousedown = dragStart;

    // Touch events
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('touchend', dragEnd);
    items.addEventListener('touchmove', dragAction);

    if (deskButtons[0] && !isMobile) {
      deskButtons[0].addEventListener('click', () => leftButtonClick());
    }

    if (deskButtons[1] && !isMobile) {
      deskButtons[1].addEventListener('click', () => rightButtonClick());
    }

    if (mobileButtons[0] && isMobile) {
      mobileButtons[0].addEventListener('touchstart', (event) => {
        posInitial = items.offsetLeft;
        posX1 = event.touches[0].clientX;
      });

      mobileButtons[0].addEventListener('touchend', () => {
        if (posInitial === items.offsetLeft) {
          leftButtonClick();
        } else {
          dragEnd();
        }
      });

      mobileButtons[0].addEventListener('touchmove', (event) => {
        posX2 = posX1 - event.touches[0].clientX;
        posX1 = event.touches[0].clientX;
        items.style.left = `${(items.offsetLeft - posX2) / 10}rem`;
      });
    }

    if (mobileButtons[1] && isMobile) {
      mobileButtons[1].addEventListener('touchstart', (event) => {
        console.log('mobileButtons');
        posInitial = items.offsetLeft;
        posX1 = event.touches[0].clientX;
      });
      mobileButtons[1].addEventListener('touchmove', (event) => {
        console.log('mobileButtons');
        posX2 = posX1 - event.touches[0].clientX;
        posX1 = event.touches[0].clientX;
        items.style.left = `${(items.offsetLeft - posX2) / 10}rem`;
      });
      mobileButtons[1].addEventListener('touchend', () => {
        if (posInitial === items.offsetLeft) {
          rightButtonClick();
        } else {
          dragEnd();
        }
      });
    }

    // Transition events
    items.addEventListener('transitionend', checkIndex);

    function leftButtonClick() {
      items.style.transition = 'left 0.3s ease';
      items.style.left = `${(items.offsetLeft + (slideSize + 10)) / 10}rem`;
      index--;

      setTimeout(() => {
        checkIndex();
      }, 300);
    }

    function rightButtonClick() {
      items.style.transition = 'left 0.3s ease';
      items.style.left = `${(items.offsetLeft - (slideSize + 10)) / 10}rem`;
      index++;

      setTimeout(() => {
        checkIndex();
      }, 300);
    }

    function dragStart(event) {
      // event = event || window.event;
      event.preventDefault();
      posInitial = items.offsetLeft;

      console.log('dragStart :', event, posInitial);

      if (event.type === 'touchstart') {
        posX1 = event.touches[0].clientX;
      } else {
        posX1 = event.clientX;
        iframeDocument.onmouseup = dragEnd;
        iframeDocument.onmousemove = dragAction;
      }
    }

    function dragAction(event) {
    //   event = event || window.event;
      console.log('dragAction :', posX2, posX1, event.clientX, items.offsetLeft);

      if (event.type === 'touchmove') {
        posX2 = posX1 - event.touches[0].clientX;
        posX1 = event.touches[0].clientX;
      } else {
        posX2 = posX1 - event.clientX;
        posX1 = event.clientX;
      }

      console.log('object :', items.offsetLeft, posX2, posX1, (items.offsetLeft - posX2) / 10);
      items.style.left = `${(items.offsetLeft - posX2) / 10}rem`;
    }

    function dragEnd() {
      posFinal = items.offsetLeft;

      if (posFinal - posInitial < -threshold) {
        shiftSlide(1, 'drag');
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(-1, 'drag');
      } else {
        console.log('dragEnd :', posInitial);
        items.style.left = `${(posInitial) / 10}rem`;
      }

      document.onmouseup = null;
      document.onmousemove = null;
      iframeDocument.onmouseup = null;
      iframeDocument.onmousemove = null;
    }

    function shiftSlide(dir, action) {
      console.log('shiftSlide');
      items.style.transition = 'left 0.2s ease-out';
      items.classList.add('shifting');

      if (allowShift) {
        if (!action) {
          posInitial = items.offsetLeft;
        }

        if (dir === 1) {
          items.style.left = `${(posInitial - (slideSize + 10)) / 10}rem`;
          index++;
        } else if (dir === -1) {
          items.style.left = `${(posInitial + (slideSize + 10)) / 10}rem`;
          index--;
        }
      }

      allowShift = false;
    }

    function checkIndex() {
      items.style.transition = 'null';
      items.classList.remove('shifting');

      console.log('slidesLength :', slidesLength);
      if (index === -1) {
        items.style.left = `${(-(
          (slidesLength) * (slideSize + 10) -
          (parentWidth - (slideSize + 10)) / 2
          )) / 10}rem`;
        index = slidesLength - 1;
      }
      if (index >= slidesLength) {
        items.style.left = `${(-(
            (slideSize + 10) * 2 -
          (parentWidth - (slideSize + 10)) / 2
          )) / 10}rem`;
        index = 0;
      }
      allowShift = true;
    }
  }

  render() {
    const { isMobile, dataSource } = this.props;
    const { parentWidth, slideSize } = this.state;

    return (
      <Slider id="slider" className="slider">
        <Wrapper className="wrapper">
          {isMobile
            ? <LeftArea id="left-control-arrea" />
            : <LeftButton id="left-control-button"> <Arrow /> </LeftButton>
          }
          <Items
            id="items"
            className="items"
            style={{
              left: `${-((slideSize + 10) * 2 - (parentWidth - (slideSize + 10)) / 2) / 10}rem`,
            }}
          >
            {dataSource ? dataSource.map((item) => (
              <Slide key={item} className="slide">
                <SlideImg src={item} alt="" />
              </Slide>)) : ''}
            ...
          </Items>
          {isMobile ? <RightArea id="right-control-arrea"> </RightArea>
            : <RightButton id="right-control-button"> <Arrow rotate="rotate(-45deg)" /> </RightButton> }
        </Wrapper>
      </Slider>
    );
  }
}

export default ComponentSlider;
