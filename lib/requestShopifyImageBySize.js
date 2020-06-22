export default function requestShopifyImageBySize(originalImageUrl, desiredSize) {
  let imageQuery = "x500";
  let imageUrlWithFilter = originalImageUrl;
  if (desiredSize) {
    switch (desiredSize) {
      case "small":
        imageQuery = "x100";
        break;
      case "medium":
        imageQuery = "x500";
        break;
      case "large":
        imageQuery = "x1000";
        break;
      default:
        break;
    }

    if(originalImageUrl && originalImageUrl.includes('cdn.shopify.com/s/files') && !originalImageUrl.includes('.gif') && !originalImageUrl.includes('_x500')){
        const matchedArray = originalImageUrl.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
        if(matchedArray && matchedArray.length && matchedArray[6] && matchedArray[6].length > 0){
          if(matchedArray[6].search(/\.png$|\.jpg$|\.jpeg$/i) > -1){


            const prefix = matchedArray[6].substring(0, matchedArray[6].search(/\.png$|\.jpg$|\.jpeg$/i))
            const postfix = matchedArray[6].substring(matchedArray[6].search(/\.png$|\.jpg$|\.jpeg$/i), matchedArray[6].length)
            const filterdPath = prefix + `_${imageQuery}` + postfix;
            imageUrlWithFilter = originalImageUrl.replace(matchedArray[6], filterdPath);
          }
        }
    }
  }

  return imageUrlWithFilter || originalImageUrl;
}
