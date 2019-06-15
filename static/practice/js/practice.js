function showQuestion(slug){
    window.location.href = slug + '?redirect=' + encodeURI(window.location.pathname);
}