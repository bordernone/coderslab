'use strict';


const termsAndConditionsBackBtnContainer = document.querySelector('#termsAndConditionsBackBtnContainer');
let termsAndConditionsBackBtn = React.createElement(backBtn, {
    defaultredirect: '/',
});
ReactDOM.render(termsAndConditionsBackBtn, termsAndConditionsBackBtnContainer);