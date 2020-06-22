async function getItemsPage({ url, accessToken }) {

  const result = await fetch(
    url,
    {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    },
  );

  const link = result.headers.get('link')
    ? result.headers.get('link').split(',').map((item) => item.trim())
    : [];

  let nextLink = null;
  let prevLink = null;
  link.forEach((linkItem) => {
    let [_url, relStr] = linkItem.split(';');
    if (!relStr) {
      return;
    }
    _url = _url.replace('<', '').replace('>', '');
    relStr = relStr.trim();
    if (relStr === 'rel="next"') {
      nextLink = _url;
    }
    if (relStr === 'rel="previous"') {
      prevLink = _url;
    }
  });

  if (result.status === 200) {
    const resultData = await result.json();
    return { data: resultData, nextLink, prevLink };
  } else {
    console.log('here', result.body);
  }
}

module.exports = getItemsPage;
