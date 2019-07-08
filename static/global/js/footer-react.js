'use strict';

const footerSubscribeContainer = document.querySelector('#subscribeBoxContainer');
ReactDOM.render(React.createElement(FooterSubscription), footerSubscribeContainer);

const siteCookieConsentContainer = document.querySelector('#siteCookieConsentContainer');
ReactDOM.render(React.createElement(SiteCookieConsent), siteCookieConsentContainer);