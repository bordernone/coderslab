var unread_list;

function fill_notification_list_custom(data) {
    unread_list = data.unread_list;
    var menus = document.getElementsByClassName(notify_menu_class);
    if (menus) {
        var messages = data.unread_list.map(function (item) {
            var message = "";
            var userFriendlyMsg = "";
            if (typeof item.actor !== 'undefined') {
                message = item.actor;
            }
            if (typeof item.verb !== 'undefined') {
                message = message + " " + item.verb;
            }
            if (typeof item.target !== 'undefined') {
                message = message + " " + item.target;
            }
            //if(typeof item.timestamp !== 'undefined'){
            //  message = message + " " + item.timestamp;
            //}
            if (typeof item.level !== 'undefined') {
                if (item.level === 'info') {
                    return '<li><a href="#" class="dropdown-item text-info fas fa-info-circle" onclick="notificationClicked(' + item.id + ')"> ' + message + '</a></li>';
                } else if (item.level === 'success') {
                    return '<li><a href="#" class="dropdown-item text-success fas fa-check-circle" onclick="notificationClicked(' + item.id + ')"> ' + message + '</a></li>';
                } else if (item.level === 'warning') {
                    return '<li><a href="#" class="dropdown-item text-warning fas fa-exclamation-triangle" onclick="notificationClicked(' + item.id + ')"> ' + message + '</a></li>';
                } else if (item.level === 'error') {
                    return '<li><a href="#" class="dropdown-item text-error fas fa-exclamation-triangle" onclick="notificationClicked(' + item.id + ')"> ' + message + '</a></li>';
                } else {
                    return '<li><a href="#" class="dropdown-item text-secondary" onclick="notificationClicked(' + item.id + ')"> ' + message + '</a></li>';
                }
            } else {
                return '<li><a href="#" class="dropdown-item text-secondary" onclick="notificationClicked(' + item.id + ')">' + message + '</a></li>';
            }
        }).join('')

        for (var i = 0; i < menus.length; i++) {
            menus[i].innerHTML = messages;
        }
    }
}

function notificationClicked(id) {
    var item = unread_list.filter(obj => {
        return obj.id === id;
    });
    item = item[0];
    markThisAsRead(item.slug);
    redirectToUrl(item);
}

function markThisAsRead(slug) {
    //making ajax request
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: "POST",
        url: "/inbox/notifications/mark-as-read/" + slug + '/',
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function (dataObj, status, xhr) {
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function redirectToUrl(item) {
    try {
        let data = item.data;
        let url = data.url;
        window.location.href = url;
    } catch (error) {

    }
}

function markallnotificationasread() {
    //making ajax request
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: "POST",
        url: "/inbox/notifications/mark-all-as-read/",
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function (dataObj, status, xhr) {
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}