import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import styled from "styled-components";
import requestShopifyImageBySize from "../../../lib/requestShopifyImageBySize";
import cloneDeep from "lodash.clonedeep";

const ViewImage = styled.div`
${props => props.image_layout === 'horizontal' && (props.isPreview ? 'height: 150px;' : 'height: 200px;')}
${props => props.image_layout === 'horizontal' && (props.isPreview ? 'width: 225px;' : 'width: 300px;')}

${props => (props.image_layout === 'sqaure' || props.image_layout === 'square') && (props.isPreview ? 'height: 187.5px;' : 'height: 250px;')}
${props => (props.image_layout === 'sqaure' || props.image_layout === 'square') && (props.isPreview ? 'width: 187.5px;' : 'width: 250px;')}

${props => props.image_layout === 'vertical' && (props.isPreview ? 'height: 280px;' : 'height: 375px;')}
${props => props.image_layout === 'vertical' && (props.isPreview ? 'width: 187.5px;' : 'width: 250px;')}
  margin: 0px auto;
  border: 1px solid #ECECEC;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background-image: url('${props => requestShopifyImageBySize(props.image, "large")}');
  background-size: cover;
  background-position: center;
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
`;

const SliderImage = styled.div`
  width: 100%;
  /* height: 16.8rem; */
  ${props => props.image_layout === 'horizontal' && (props.isMobile ? 'height: 16.8rem;' : 'height: 23rem;')}

${props => (props.image_layout === 'sqaure' || props.image_layout === 'square') && (props.isMobile  ? 'height: 21.864rem;' : 'height: 28rem;')}

${props => props.image_layout === 'vertical' && (props.isMobile  ? 'height: 32rem;' : 'height: 38rem;')}
  background-image: url('${props => requestShopifyImageBySize(props.image, "medium")}');
  background-position: center;
  background-size: cover;
  margin: 0 0.5rem;
  border: 1px solid #ECECEC;
  box-sizing: border-box;
  border-radius: 5px;
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
`;

class SliderImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active_offer !== this.props.active_offer) {
      this.setState({ selectedItem: 0 });
    }
    if (nextProps.variant !== this.props.variant) {
      this.setState({ selectedItem: 0 });
    }
  }

  render() {
    const { images, isMobile, variant, pageToShow, settings_theme, isPreview } = this.props;
    const { selectedItem } = this.state;
    const tmpImages = cloneDeep(images);
    const { image_layout } = settings_theme.product || 'square';
    
    let relevantImagesArray = tmpImages.filter(image => {
      if (variant && image.variant_ids && image.variant_ids.length > 0) {
        return image.variant_ids.includes(variant.id)
      } else {
        return true;
      }
    });
    
    if (relevantImagesArray.length == 1 && relevantImagesArray[0].src) {
      return (
        <div style={{ marginTop: "2rem", padding: "0 1rem" }}>
          <ViewImage image={relevantImagesArray[0].src} image_layout={image_layout} isMobile={isMobile} className='singleImageView' isPreview={isPreview} />
        </div>
      );
    }
    relevantImagesArray.sort((a,b)=>{
      if(a.variant_ids && a.variant_ids[0]){
        return -1;
      } else if (b.variant_ids && b.variant_ids[0]){
        return 1;
      } else {
        return 0;
      }
   })

    relevantImagesArray = relevantImagesArray.map(image =>(
      <SliderImage
          className="carouselImage"
          key={`img- + ${image.src}`}
          image={image.src}
          image_layout={image_layout}
          isMobile={isMobile}
        />
    ))


    let widthProcent = 70;

    
    if(!isMobile && pageToShow == 'cart_page'){
      const iframeDocument = document.getElementById('widget').contentWindow.document;
      if(image_layout != 'horizontal'){
        if(iframeDocument){
          const clientWidth = iframeDocument.body.clientWidth;
          widthProcent = 100/clientWidth * (218.64 + 10);
        }
      } else {
        if(iframeDocument){
          const clientWidth = iframeDocument.body.clientWidth;
          widthProcent = 100/clientWidth * (254 + 10);
        }
      }
    }

    return (
      <div 
        style={{ marginTop: "2rem"}} 
      >
        <Carousel
          onChange={data => {
            this.setState({ selectedItem: data });
          }}
          onClickItem={data => {
            this.setState({ selectedItem: data });
          }}
          selectedItem={selectedItem}
          showArrows={!isMobile}
          swipeable
          centerMode
          infiniteLoop={images.length !== 2}
          centerSlidePercentage={widthProcent}
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          className="carousel"
        >
          {relevantImagesArray}
        </Carousel>
      </div>
    );
  }
}

export default SliderImages;
