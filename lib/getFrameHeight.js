export default function getFrameHeight(settings, product, scale = 1) {
  let iframeHeight = 70;

  let viewBloctProduct = false;

  if (
    settings.design_settings.show_product_image ||
    settings.design_settings.show_product_name ||
    settings.design_settings.show_price
  ) {
    viewBloctProduct = true;
    if (settings.design_settings.show_product_image) {
      iframeHeight += 45;
    } else if (settings.design_settings.show_product_name && settings.design_settings.show_price) {
      iframeHeight += 37;
    } else {
      iframeHeight += 18;
    }
  }

  if (settings.design_settings.show_variants && product.variants.length > 1) {
    iframeHeight += 37;
  }

  if (viewBloctProduct && settings.design_settings.show_variants) {
    if (product.variants.length > 1) {
      iframeHeight += 8;
    }
  } else if (settings.design_settings.show_variants) {
    iframeHeight += 7;
  }

  return iframeHeight * scale;
}
