const currencies = {
  USD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} USD',
    money_name: 'US Dollar',
  },
  EUR: {
    money_format: '€{{amount}}',
    money_with_currency_format: '€{{amount}} EUR',
    money_name: 'Euro',
  },
  GBP: {
    money_format: '£{{amount}}',
    money_with_currency_format: '£{{amount}} GBP',
    money_name: 'British Pound Sterling',
  },
  CAD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} CAD',
    money_name: 'Canadian Dollar',
  },
  ALL: {
    money_format: 'Lek {{amount}}',
    money_with_currency_format: 'Lek {{amount}} ALL',
    money_name: 'Albanian Lek',
  },
  DZD: {
    money_format: 'DA {{amount}}',
    money_with_currency_format: 'DA {{amount}} DZD',
    money_name: 'Algerian Dinar',
  },
  AOA: {
    money_format: 'Kz{{amount}}',
    money_with_currency_format: 'Kz{{amount}} AOA',
    money_name: 'Angolan Kwanza',
  },
  ARS: {
    money_format: '${{amount_with_comma_separator}}',
    money_with_currency_format: '${{amount_with_comma_separator}} ARS',
    money_name: 'Argentine Peso',
  },
  AMD: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} AMD',
    money_name: 'Armenian Dram',
  },
  AWG: {
    money_format: 'Afl{{amount}}',
    money_with_currency_format: 'Afl{{amount}} AWG',
    money_name: 'Aruban Florin',
  },
  AUD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} AUD',
    money_name: 'Australian Dollar',
  },
  BBD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} Bds',
    money_name: 'Barbadian Dollar',
  },
  AZN: {
    money_format: '₼{{amount}}',
    money_with_currency_format: '₼{{amount}} AZN',
    money_name: 'Azerbaijani Manat',
  },
  BDT: {
    money_format: 'Tk {{amount}}',
    money_with_currency_format: 'Tk {{amount}} BDT',
    money_name: 'Bangladeshi Taka',
  },
  BSD: {
    money_format: 'BS${{amount}}',
    money_with_currency_format: 'BS${{amount}} BSD',
    money_name: 'Bahamian Dollar',
  },
  BHD: {
    money_format: '{{amount}} BD',
    money_with_currency_format: '{{amount}} BHD',
    money_name: 'Bahraini Dinar',
  },
  BYN: {
    money_format: 'Br {{amount}}',
    money_with_currency_format: 'Br {{amount}} BYN',
    money_name: 'Belarusian Ruble',
  },
  BZD: {
    money_format: 'BZ${{amount}}',
    money_with_currency_format: 'BZ${{amount}} BZD',
    money_name: 'Belize Dollar',
  },
  BTN: {
    money_format: 'Nu {{amount}}',
    money_with_currency_format: 'Nu {{amount}} BTN',
    money_name: 'Bhutanese Ngultrum',
  },
  BAM: {
    money_format: 'KM {{amount_with_comma_separator}}',
    money_with_currency_format: 'KM {{amount_with_comma_separator}} BAM',
    money_name: 'Bosnia-Herzegovina Convertible Mark',
  },
  BRL: {
    money_format: 'R$ {{amount_with_comma_separator}}',
    money_with_currency_format: 'R$ {{amount_with_comma_separator}} BRL',
    money_name: 'Brazilian Real',
  },
  BOB: {
    money_format: 'Bs{{amount_with_comma_separator}}',
    money_with_currency_format: 'Bs{{amount_with_comma_separator}} BOB',
    money_name: 'Bolivian Boliviano',
  },
  BWP: {
    money_format: 'P{{amount}}',
    money_with_currency_format: 'P{{amount}} BWP',
    money_name: 'Botswanan Pula',
  },
  BND: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} BND',
    money_name: 'Brunei Dollar',
  },
  BGN: {
    money_format: '{{amount}} лв',
    money_with_currency_format: '{{amount}} лв BGN',
    money_name: 'Bulgarian Lev',
  },
  MMK: {
    money_format: 'K{{amount}}',
    money_with_currency_format: 'K{{amount}} MMK',
    money_name: 'Myanmar Kyat',
  },
  KHR: {
    money_format: 'KHR{{amount}}',
    money_with_currency_format: 'KHR{{amount}}',
    money_name: 'Cambodian Riel',
  },
  KYD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} KYD',
    money_name: 'Cayman Islands Dollar',
  },
  XAF: {
    money_format: 'FCFA{{amount}}',
    money_with_currency_format: 'FCFA{{amount}} XAF',
    money_name: 'Central African CFA Franc',
  },
  CLP: {
    money_format: '${{amount_no_decimals}}',
    money_with_currency_format: '${{amount_no_decimals}} CLP',
    money_name: 'Chilean Peso',
  },
  CNY: {
    money_format: '¥{{amount}}',
    money_with_currency_format: '¥{{amount}} CNY',
    money_name: 'Chinese Yuan',
  },
  COP: {
    money_format: '${{amount_with_comma_separator}}',
    money_with_currency_format: '${{amount_with_comma_separator}} COP',
    money_name: 'Colombian Peso',
  },
  CRC: {
    money_format: '₡ {{amount_with_comma_separator}}',
    money_with_currency_format: '₡ {{amount_with_comma_separator}} CRC',
    money_name: 'Costa Rican Colon',
  },
  HRK: {
    money_format: '{{amount_with_comma_separator}} kn',
    money_with_currency_format: '{{amount_with_comma_separator}} kn HRK',
    money_name: 'Croatian Kuna',
  },
  CZK: {
    money_format: '{{amount_with_comma_separator}} Kč',
    money_with_currency_format: '{{amount_with_comma_separator}} Kč',
    money_name: 'Czech Republic Koruna',
  },
  DKK: {
    money_format: 'kr {{amount_with_comma_separator}}',
    money_with_currency_format: 'kr {{amount_with_comma_separator}} DKK',
    money_name: 'Danish Krone',
  },
  DOP: {
    money_format: 'RD$ {{amount}}',
    money_with_currency_format: 'RD$ {{amount}}',
    money_name: 'Dominican Peso',
  },
  XCD: {
    money_format: '${{amount}}',
    money_with_currency_format: 'EC${{amount}}',
    money_name: 'East Caribbean Dollar',
  },
  EGP: {
    money_format: 'LE {{amount}}',
    money_with_currency_format: 'LE {{amount}} EGP',
    money_name: 'Egyptian Pound',
  },
  ETB: {
    money_format: 'Br{{amount}}',
    money_with_currency_format: 'Br{{amount}} ETB',
    money_name: 'Ethiopian Birr',
  },
  XPF: {
    money_format: '{{amount_no_decimals_with_comma_separator}} XPF',
    money_with_currency_format: '{{amount_no_decimals_with_comma_separator}} XPF',
    money_name: 'CFP Franc',
  },
  FJD: {
    money_format: '${{amount}}',
    money_with_currency_format: 'FJ${{amount}}',
    money_name: 'Fijian Dollar',
  },
  GMD: {
    money_format: 'D {{amount}}',
    money_with_currency_format: 'D {{amount}} GMD',
    money_name: 'Gambian Dalasi',
  },
  GHS: {
    money_format: 'GHS{{amount}}',
    money_with_currency_format: 'GHS{{amount}}',
    money_name: 'Ghanaian Cedi',
  },
  GTQ: {
    money_format: 'Q{{amount}}',
    money_with_currency_format: '{{amount}} GTQ',
    money_name: 'Guatemalan Quetzal',
  },
  GYD: {
    money_format: 'G${{amount}}',
    money_with_currency_format: '${{amount}} GYD',
    money_name: 'Guyanaese Dollar',
  },
  GEL: {
    money_format: '{{amount}} GEL',
    money_with_currency_format: '{{amount}} GEL',
    money_name: 'Georgian Lari',
  },
  HNL: {
    money_format: 'L {{amount}}',
    money_with_currency_format: 'L {{amount}} HNL',
    money_name: 'Honduran Lempira',
  },
  HKD: {
    money_format: 'HK${{amount}}',
    money_with_currency_format: 'HK${{amount}} HKD',
    money_name: 'Hong Kong Dollar',
  },
  HUF: {
    money_format: '{{amount_no_decimals_with_comma_separator}}',
    money_with_currency_format: '{{amount_no_decimals_with_comma_separator}} Ft',
    money_name: 'Hungarian Forint',
  },
  ISK: {
    money_format: '{{amount_no_decimals}} kr',
    money_with_currency_format: '{{amount_no_decimals}} kr ISK',
    money_name: 'Icelandic Krona',
  },
  INR: {
    money_format: '₹ {{amount}}',
    money_with_currency_format: '₹ {{amount}} INR',
    money_name: 'Indian Rupee',
  },
  IDR: {
    money_format: '{{amount_with_comma_separator}} IDR',
    money_with_currency_format: 'Rp {{amount_with_comma_separator}} IDR',
    money_name: 'Indonesian Rupiah',
  },
  ILS: {
    money_format: '₪{{amount}}',
    money_with_currency_format: '₪{{amount}} NIS',
    money_name: 'Israeli New Shekel',
  },
  JMD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} JMD',
    money_name: 'Jamaican Dollar',
  },
  JPY: {
    money_format: '¥{{amount_no_decimals}}',
    money_with_currency_format: '¥{{amount_no_decimals}} JPY',
    money_name: 'Japanese Yen',
  },
  JEP: {
    money_format: '£{{amount}}',
    money_with_currency_format: '£{{amount}} JEP',
    money_name: 'Jersey Pound',
  },
  JOD: {
    money_format: '{{amount}} JD',
    money_with_currency_format: '{{amount}} JOD',
    money_name: 'Jordanian Dinar',
  },
  KZT: {
    money_format: '{{amount}} KZT',
    money_with_currency_format: '{{amount}} KZT',
    money_name: 'Kazakhstani Tenge',
  },
  KES: {
    money_format: 'KSh{{amount}}',
    money_with_currency_format: 'KSh{{amount}}',
    money_name: 'Kenyan Shilling',
  },
  KWD: {
    money_format: '{{amount}} KD',
    money_with_currency_format: '{{amount}} KWD',
    money_name: 'Kuwaiti Dinar',
  },
  KGS: {
    money_format: 'лв{{amount}}',
    money_with_currency_format: 'лв{{amount}}',
    money_name: 'Kyrgystani Som',
  },
  LVL: {
    money_format: 'Ls {{amount}}',
    money_with_currency_format: 'Ls {{amount}} LVL',
    money_name: 'Latvian Lats',
  },
  LBP: {
    money_format: 'L.L.{{amount}}',
    money_with_currency_format: 'L.L.{{amount}} LBP',
    money_name: 'Lebanese Pound',
  },
  LTL: {
    money_format: '{{amount}} Lt',
    money_with_currency_format: '{{amount}} Lt',
    money_name: 'Lithuanian Litas',
  },
  MGA: {
    money_format: 'Ar {{amount}}',
    money_with_currency_format: 'Ar {{amount}} MGA',
    money_name: 'Malagasy Ariary',
  },
  MKD: {
    money_format: 'ден {{amount}}',
    money_with_currency_format: 'ден {{amount}} MKD',
    money_name: 'Macedonian Denar',
  },
  MOP: {
    money_format: 'MOP${{amount}}',
    money_with_currency_format: 'MOP${{amount}}',
    money_name: 'Macanese Pataca',
  },
  MVR: {
    money_format: 'Rf{{amount}}',
    money_with_currency_format: 'Rf{{amount}} MVR',
    money_name: 'Maldivian Rufiyaa',
  },
  MXN: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} MXN',
    money_name: 'Mexican Peso',
  },
  MYR: {
    money_format: 'RM{{amount}}',
    money_with_currency_format: 'RM{{amount}} MYR',
    money_name: 'Malaysian Ringgit',
  },
  MUR: {
    money_format: 'Rs {{amount}}',
    money_with_currency_format: 'Rs {{amount}} MUR',
    money_name: 'Mauritian Rupee',
  },
  MDL: {
    money_format: '{{amount}} MDL',
    money_with_currency_format: '{{amount}} MDL',
    money_name: 'Moldovan Leu',
  },
  MAD: {
    money_format: '{{amount}} dh',
    money_with_currency_format: 'Dh {{amount}} MAD',
    money_name: 'Moroccan Dirham',
  },
  MNT: {
    money_format: '{{amount_no_decimals}} ₮',
    money_with_currency_format: '{{amount_no_decimals}} MNT',
    money_name: 'Mongolian Tugrik',
  },
  MZN: {
    money_format: '{{amount}} Mt',
    money_with_currency_format: 'Mt {{amount}} MZN',
    money_name: 'Mozambican Metical',
  },
  NAD: {
    money_format: 'N${{amount}}',
    money_with_currency_format: 'N${{amount}} NAD',
    money_name: 'Namibian Dollar',
  },
  NPR: {
    money_format: 'Rs{{amount}}',
    money_with_currency_format: 'Rs{{amount}} NPR',
    money_name: 'Nepalese Rupee',
  },
  ANG: {
    money_format: 'ƒ {{amount}}',
    money_with_currency_format: '{{amount}} ƒ',
    money_name: 'Netherlands Antillean Guilder',
  },
  NZD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} NZD',
    money_name: 'New Zealand Dollar',
  },
  NIO: {
    money_format: 'C${{amount}}',
    money_with_currency_format: 'C${{amount}} NIO',
    money_name: 'Nicaraguan Cordoba',
  },
  NGN: {
    money_format: '₦{{amount}}',
    money_with_currency_format: '₦{{amount}} NGN',
    money_name: 'Nigerian Naira',
  },
  NOK: {
    money_format: 'kr {{amount_with_comma_separator}}',
    money_with_currency_format: 'kr {{amount_with_comma_separator}} NOK',
    money_name: 'Norwegian Krone',
  },
  OMR: {
    money_format: '{{amount_with_comma_separator}} OMR',
    money_with_currency_format: '{{amount_with_comma_separator}} OMR',
    money_name: 'Omani Rial',
  },
  PKR: {
    money_format: 'Rs.{{amount}}',
    money_with_currency_format: 'Rs.{{amount}} PKR',
    money_name: 'Pakistani Rupee',
  },
  PGK: {
    money_format: 'K {{amount}}',
    money_with_currency_format: 'K {{amount}} PGK',
    money_name: 'Papua New Guinean Kina',
  },
  PYG: {
    money_format: 'Gs. {{amount_no_decimals_with_comma_separator}}',
    money_with_currency_format: 'Gs. {{amount_no_decimals_with_comma_separator}} PYG',
    money_name: 'Paraguayan Guarani',
  },
  PEN: {
    money_format: 'S/. {{amount}}',
    money_with_currency_format: 'S/. {{amount}} PEN',
    money_name: 'Peruvian Nuevo Sol',
  },
  PHP: {
    money_format: '₱{{amount}}',
    money_with_currency_format: '₱{{amount}} PHP',
    money_name: 'Philippine Peso',
  },
  PLN: {
    money_format: '{{amount_with_comma_separator}} zl',
    money_with_currency_format: '{{amount_with_comma_separator}} zl PLN',
    money_name: 'Polish Zloty',
  },
  QAR: {
    money_format: 'QAR {{amount_with_comma_separator}}',
    money_with_currency_format: 'QAR {{amount_with_comma_separator}}',
    money_name: 'Qatari Rial',
  },
  RON: {
    money_format: '{{amount_with_comma_separator}} lei',
    money_with_currency_format: '{{amount_with_comma_separator}} lei RON',
    money_name: 'Romanian Leu',
  },
  RUB: {
    money_format: '₽ {{amount_with_comma_separator}}',
    money_with_currency_format: '₽ {{amount_with_comma_separator}} RUB',
    money_name: 'Russian Ruble',
  },
  RWF: {
    money_format: '{{amount_no_decimals}} RF',
    money_with_currency_format: '{{amount_no_decimals}} RWF',
    money_name: 'Rwandan Franc',
  },
  WST: {
    money_format: 'WS$ {{amount}}',
    money_with_currency_format: 'WS$ {{amount}} WST',
    money_name: 'Samoan Tala',
  },
  SAR: {
    money_format: '{{amount}} SR',
    money_with_currency_format: '{{amount}} SAR',
    money_name: 'Saudi Riyal',
  },
  STD: {
    money_format: 'Db {{amount}}',
    money_with_currency_format: 'Db {{amount}} STD',
    money_name: 'Sao Tome and Principe Dobra',
  },
  RSD: {
    money_format: '{{amount}} RSD',
    money_with_currency_format: '{{amount}} RSD',
    money_name: 'Serbian Dinar',
  },
  SCR: {
    money_format: 'Rs {{amount}}',
    money_with_currency_format: 'Rs {{amount}} SCR',
    money_name: 'Seychellois Rupee',
  },
  SGD: {
    money_format: 'S${{amount}}',
    money_with_currency_format: 'S${{amount}} SGD',
    money_name: 'Singapore Dollar',
  },
  SYP: {
    money_format: 'S£{{amount}}',
    money_with_currency_format: 'S£{{amount}} SYP',
    money_name: 'Syrian Pound',
  },
  ZAR: {
    money_format: 'R {{amount}}',
    money_with_currency_format: 'R {{amount}} ZAR',
    money_name: 'South African Rand',
  },
  KRW: {
    money_format: '₩{{amount_no_decimals}}',
    money_with_currency_format: '₩{{amount_no_decimals}} KRW',
    money_name: 'South Korean Won',
  },
  LKR: {
    money_format: 'Rs {{amount}}',
    money_with_currency_format: 'Rs {{amount}} LKR',
    money_name: 'Sri Lankan Rupee',
  },
  SEK: {
    money_format: 'kr {{amount_with_comma_separator}}',
    money_with_currency_format: 'kr {{amount_with_comma_separator}} SEK',
    money_name: 'Swedish Krona',
  },
  CHF: {
    money_format: 'SFr. {{amount}}',
    money_with_currency_format: 'SFr. {{amount}} CHF',
    money_name: 'Swiss Franc',
  },
  TWD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} TWD',
    money_name: 'New Taiwan Dollar',
  },
  THB: {
    money_format: '{{amount}} THB',
    money_with_currency_format: '{{amount}} &#xe3f; THB',
    money_name: 'Thai Baht',
  },
  TZS: {
    money_format: '{{amount}} TZS',
    money_with_currency_format: '{{amount}} TZS',
    money_name: 'Tanzanian Shilling',
  },
  TTD: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}} TTD',
    money_name: 'Trinidad and Tobago Dollar',
  },
  TND: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} DT',
    money_name: 'Tunisian Dinar',
  },
  TRY: {
    money_format: '{{amount}} TL',
    money_with_currency_format: '{{amount}} TL',
    money_name: 'Turkish Lira',
  },
  UGX: {
    money_format: 'Ush {{amount_no_decimals}}',
    money_with_currency_format: 'Ush {{amount_no_decimals}} UGX',
    money_name: 'Ugandan Shilling',
  },
  UAH: {
    money_format: '₴{{amount}}',
    money_with_currency_format: '₴{{amount}} UAH',
    money_name: 'Ukrainian Hryvnia',
  },
  AED: {
    money_format: '{{amount}} AED',
    money_with_currency_format: '{{amount}} AED',
    money_name: 'United Arab Emirates Dirham',
  },
  UYU: {
    money_format: '${{amount_with_comma_separator}}',
    money_with_currency_format: '${{amount_with_comma_separator}} UYU',
    money_name: 'Uruguayan Peso',
  },
  VUV: {
    money_format: '${{amount}}',
    money_with_currency_format: '${{amount}}VT',
    money_name: 'Vanuatu Vatu',
  },
  VEF: {
    money_format: 'Bs. {{amount_with_comma_separator}}',
    money_with_currency_format: 'Bs. {{amount_with_comma_separator}} VEF',
    money_name: 'Venezuelan Bolivar',
  },
  VND: {
    money_format: '{{amount_no_decimals_with_comma_separator}}₫',
    money_with_currency_format: '{{amount_no_decimals_with_comma_separator}} VND',
    money_name: 'Vietnamese Dong',
  },
  BTC: {
    money_format: '{{amount_no_decimals}} BTC',
    money_with_currency_format: '{{amount_no_decimals}} BTC',
    money_name: 'Bitcoin',
  },
  XOF: {
    money_format: 'CFA{{amount}}',
    money_with_currency_format: 'CFA{{amount}} XOF',
    money_name: 'CFA Franc BCEAO',
  },
  ZMW: {
    money_format: 'K{{amount_no_decimals_with_comma_separator}}',
    money_with_currency_format: 'ZMW{{amount_no_decimals_with_comma_separator}}',
    money_name: 'Zambian Kwacha',
  },
  AFN: {
    money_format: 'Af {{amount}}',
    money_with_currency_format: 'Af {{amount}} AFN',
    money_name: 'Afghan Afghani',
  },
  BMD: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} BMD',
    money_name: 'Bermudan Dollar',
  },
  BIF: {
    money_format: 'BIF {{amount}}',
    money_with_currency_format: 'BIF {{amount}} BIF',
    money_name: 'Burundian Franc',
  },
  CVE: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} CVE',
    money_name: 'Cape Verdean Escudo',
  },
  KMF: {
    money_format: 'CF {{amount}}',
    money_with_currency_format: 'CF {{amount}} KMF',
    money_name: 'Comorian Franc',
  },
  CDF: {
    money_format: 'FC {{amount}}',
    money_with_currency_format: 'FC {{amount}} CDF',
    money_name: 'Congolese Franc',
  },
  CUC: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} CUC',
    money_name: 'Cuban Convertible Peso',
  },
  CUP: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} CUP',
    money_name: 'Cuban Peso',
  },
  DJF: {
    money_format: 'DJF {{amount}}',
    money_with_currency_format: 'DJF {{amount}} DJF',
    money_name: 'Djiboutian Franc',
  },
  ERN: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} ERN',
    money_name: 'Eritrean Nakfa',
  },
  EEK: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} EEK',
    money_name: 'Estonian Kroon',
  },
  FKP: {
    money_format: '£ {{amount}}',
    money_with_currency_format: '£ {{amount}} FKP',
    money_name: 'Falkland Islands Pound',
  },
  GIP: {
    money_format: '£ {{amount}}',
    money_with_currency_format: '£ {{amount}} GIP',
    money_name: 'Gibraltar Pound',
  },
  XAU: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} XAU',
    money_name: 'Gold Ounce',
  },
  GGP: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} GGP',
    money_name: 'Guernsey Pound',
  },
  GNF: {
    money_format: 'FG {{amount}}',
    money_with_currency_format: 'FG {{amount}} GNF',
    money_name: 'Guinean Franc',
  },
  HTG: {
    money_format: 'G {{amount}}',
    money_with_currency_format: 'G {{amount}} HTG',
    money_name: 'Haitian Gourde',
  },
  XDR: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} XDR',
    money_name: 'IMF Special Drawing Rights',
  },
  IRR: {
    money_format: '﷼ {{amount}}',
    money_with_currency_format: '﷼ {{amount}} IRR',
    money_name: 'Iranian Rial',
  },
  IQD: {
    money_format: 'ع.د {{amount}}',
    money_with_currency_format: 'ع.د {{amount}} IQD',
    money_name: 'Iraqi Dinar',
  },
  IMP: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} IMP',
    money_name: 'Isle of Man Pound',
  },
  LAK: {
    money_format: '₭ {{amount}}',
    money_with_currency_format: '₭ {{amount}} LAK',
    money_name: 'Laotian Kip',
  },
  LSL: {
    money_format: 'L {{amount}}',
    money_with_currency_format: 'L {{amount}} LSL',
    money_name: 'Lesotho Loti',
  },
  LRD: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} LRD',
    money_name: 'Liberian Dollar',
  },
  LYD: {
    money_format: 'ل.د {{amount}}',
    money_with_currency_format: 'ل.د {{amount}} LYD',
    money_name: 'Libyan Dinar',
  },
  MWK: {
    money_format: 'MK {{amount}}',
    money_with_currency_format: 'MK {{amount}} MWK',
    money_name: 'Malawian Kwacha',
  },
  MRO: {
    money_format: 'UM {{amount}}',
    money_with_currency_format: 'UM {{amount}} MRO',
    money_name: 'Mauritanian Ouguiya',
  },
  KPW: {
    money_format: '₩ {{amount}}',
    money_with_currency_format: '₩ {{amount}} KPW',
    money_name: 'North Korean Won',
  },
  XPD: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} XPD',
    money_name: 'Palladium Ounce',
  },
  PAB: {
    money_format: 'PAB {{amount}}',
    money_with_currency_format: 'PAB {{amount}} PAB',
    money_name: 'Panamanian Balboa',
  },
  XPT: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} XPT',
    money_name: 'Platinum Ounce',
  },
  SHP: {
    money_format: '£ {{amount}}',
    money_with_currency_format: '£ {{amount}} SHP',
    money_name: 'Saint Helena Pound',
  },
  SVC: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} SVC',
    money_name: 'Salvadoran Colon',
  },
  SPL: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} SPL',
    money_name: 'Seborgan Luigino',
  },
  SLL: {
    money_format: 'Le {{amount}}',
    money_with_currency_format: 'Le {{amount}} SLL',
    money_name: 'Sierra Leonean Leone',
  },
  XAG: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} XAG',
    money_name: 'Silver Ounce',
  },
  SKK: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} SKK',
    money_name: 'Slovak Koruna',
  },
  SBD: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} SBD',
    money_name: 'Solomon Islands Dollar',
  },
  SOS: {
    money_format: 'S {{amount}}',
    money_with_currency_format: 'S {{amount}} SOS',
    money_name: 'Somali Shilling',
  },
  SDG: {
    money_format: '£ {{amount}}',
    money_with_currency_format: '£ {{amount}} SDG',
    money_name: 'Sudanese Pound',
  },
  SRD: {
    money_format: '$ {{amount}}',
    money_with_currency_format: '$ {{amount}} SRD',
    money_name: 'Surinamese Dollar',
  },
  SZL: {
    money_format: 'L {{amount}}',
    money_with_currency_format: 'L {{amount}} SZL',
    money_name: 'Swazi Lilangeni',
  },
  TJS: {
    money_format: 'TJS {{amount}}',
    money_with_currency_format: 'TJS {{amount}} TJS',
    money_name: 'Tajikistani Somoni',
  },
  TOP: {
    money_format: 'T$ {{amount}}',
    money_with_currency_format: 'T$ {{amount}} TOP',
    money_name: 'Tongan Paʻanga',
  },
  TMT: {
    money_format: 'm {{amount}}',
    money_with_currency_format: 'm {{amount}} TMT',
    money_name: 'Turkmenistani Manat',
  },
  TVD: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} TVD',
    money_name: 'Tuvaluan Dollar',
  },
  UZS: {
    money_format: 'лв {{amount}}',
    money_with_currency_format: 'лв {{amount}} UZS',
    money_name: 'Uzbekistan Som',
  },
  YER: {
    money_format: '﷼ {{amount}}',
    money_with_currency_format: '﷼ {{amount}} YER',
    money_name: 'Yemeni Rial',
  },
  ZWD: {
    money_format: '{{amount}}',
    money_with_currency_format: '{{amount}} ZWD',
    money_name: 'Zimbabwean Dollar',
  },
};

export default currencies;