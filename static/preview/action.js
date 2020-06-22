/* eslint-disable no-var */
function showDesktop() {

  if (window.resetDesktop) {
    window.showButtonRefresh();
  } else {
    window.hideButtonRefresh();
  }

  var mobileContent = document.getElementById('mobile-container-div');
  mobileContent.style.display = 'none';

  var desktopContent = document.getElementById('desktop-container-div');
  desktopContent.style.display = 'flex';

  var desktopSwitcher = document.getElementById('desktop-switcher');
  desktopSwitcher.classList.add('active');

  var mobileSwitcher = document.getElementById('mobile-switcher');
  mobileSwitcher.classList.remove('active');

  var content = document.getElementById('desktop-container-div');
  content.innerHTML = `<iframe src="/static/preview/desktop.html?shop=${shop}" id="desktop-frame" width="100%" height = "100%" frameborder="0" scrolling="no"></iframe>`;
  document.getElementById('mobile-content-div').innerHTML = '';
  if(amplitude){
    amplitude.logEvent('click-preview_show_device',{value: 'desktop'});
  }
}

function showMobile() {

  if (window.resetMobile) {
    window.showButtonRefresh();
  } else {
    window.hideButtonRefresh();
  }

  var mobileContent = document.getElementById('mobile-container-div');
  mobileContent.style.display = 'flex';

  var desktopContent = document.getElementById('desktop-container-div');
  desktopContent.style.display = 'none';

  var desktopSwitcher = document.getElementById('desktop-switcher');
  desktopSwitcher.classList.remove('active');

  var mobileSwitcher = document.getElementById('mobile-switcher');
  mobileSwitcher.classList.add('active');
  document.getElementById('desktop-container-div').innerHTML = '';
  var content = document.getElementById('mobile-content-div');
  content.innerHTML = ` <iframe src="/static/preview/mobile.html?shop=${shop}" id="mobile-frame" width="100%" height = "100%" frameborder="0" scrolling="no" seamless></iframe>`
  if(amplitude){
    amplitude.logEvent('click-preview_show_device',{value: 'mobile'});
  }
}

document.addEventListener('DOMContentLoaded', () => {
  var data = [
    {
      product_image:
        './img/i1.png',
      product_name: 'Ultimate Dog Leash',
      variants: ['Yellow'],
      quantity: 1,
      currency: '$',
      discounted_price: '11.35',
    },
    {
      product_image:
                './img/i2.png',
      product_name: 'Ultimate Dog Bed',
      variants: ['Black'],
      quantity: 3,
      currency: '$',
      discounted_price: '105.00',
    },
    {
      product_image:
                './img/i3.png',
      product_name: 'Ultimate Dog Snack',
      variants: ['20pcs'],
      quantity: 2,
      currency: '$',
      discounted_price: '2.50',
    },
  ];

  var mobileFrame = document.getElementById('mobile-frame');
  var desktopFrame = document.getElementById('desktop-frame');

  if (mobileFrame && desktopFrame) {
    // setTimeout(() => {
    //   var mobileFrameContent =
    //     mobileFrame.contentWindow || mobileFrame.contentDocument;
    //   mobileFrameContent.renderProducts(data);

    //   var deskFrameContent =
    //     desktopFrame.contentWindow || desktopFrame.contentDocument;
    //   deskFrameContent.renderProducts(data);

    //   clear_button = document.getElementById("clear-button");
    //   clear_button.style.display = "flex";

    //   header_text = document.getElementById("bottom-header-text");
    //   header_text.innerHTML =
    //     "The upsell process is complete. This is a checkout page simulation. Click “Restart” to start over.";
    // }, 3000);
  }
});

window.showButtonRefresh = function(type) {

  if (type === 'mobile') {
    window.resetMobile = true;
  } else if (type === 'desktop') {
    window.resetDesktop = true;
  }

  // var bootom_header = document.getElementById('bottom-header');
  // bootom_header.style.height = '68px';

  // var clear_button = document.getElementById('clear-button');
  // clear_button.style.display = 'flex';

  document.getElementById('header-description').style.display = 'none';
  document.getElementById('header-description-restar').style.display = 'block';

  // var header_text = document.getElementById('header-description');
  // header_text.innerHTML = 'The upsell process is complete. This is a checkout page simulation. Click “Restart” to start over.';
};


window.hideButtonRefresh = function() {
  // var header_text = document.getElementById('bottom-header-text');
  // header_text.innerHTML = 'This is a thank you page simulation.';

  // var clear_button = document.getElementById('clear-button');
  // clear_button.style.display = 'none';

  document.getElementById('header-description').style.display = 'block';
  document.getElementById('header-description-restar').style.display = 'none';
};

window.clearButtonClick = function () {
  if (window.resetDesktop) {
    window.resetDesktop = false;
    document.getElementById('desktop-frame').contentWindow.location.reload();
  }

  if (window.resetMobile) {
    window.resetMobile = false;
    document.getElementById('mobile-frame').contentWindow.location.reload();
  }

  // var header_text = document.getElementById('bottom-header-text');
  // header_text.innerHTML = 'This is a thank you page simulation.';
  document.getElementById('header-description').style.display = 'block';
  document.getElementById('header-description-restar').style.display = 'none';
  if(amplitude){
    amplitude.logEvent('click-preview_restart_simulation');
  }
}


function clearButtonClick() {

  if (window.resetDesktop) {
    window.resetDesktop = false;
    document.getElementById('desktop-frame').contentWindow.location.reload();
  }

  if (window.resetMobile) {
    window.resetMobile = false;
    document.getElementById('mobile-frame').contentWindow.location.reload();
  }

  // var header_text = document.getElementById('bottom-header-text');
  // header_text.innerHTML = 'This is a thank you page simulation.';
  document.getElementById('header-description').style.display = 'block';
  document.getElementById('header-description-restar').style.display = 'none';
  if(amplitude){
    amplitude.logEvent('click-preview_restart_simulation');
  }
}
