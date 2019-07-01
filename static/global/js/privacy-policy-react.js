'use strict';


const privacypolicyBackBtnContainer = document.querySelector('#privacypolicyBackBtnContainer');
let privacypolicyBackBtn = React.createElement(backBtn, {
    defaultredirect: '/',
});
ReactDOM.render(privacypolicyBackBtn, privacypolicyBackBtnContainer);