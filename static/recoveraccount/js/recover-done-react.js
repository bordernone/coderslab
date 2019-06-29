'use strict';

const recoverAccountDoneBackBtnContainer = document.querySelector('#recoverAccountDoneBackBtnContainer');
let recoverAccountDoneBckBtn = React.createElement(backBtn, {
    defaultredirect: '/login/',
});
ReactDOM.render(recoverAccountDoneBckBtn, recoverAccountDoneBackBtnContainer);