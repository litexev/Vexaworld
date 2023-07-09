$get = document.querySelector.bind(document);
$getAll = document.querySelectorAll.bind(document);
$new = function (propObj) {
    // {type, class, id, value, parent}
    let n = document.createElement(propObj.type);
    if (propObj.class != null) {
        n.classList = propObj.class;
    }
    if (propObj.id != null) {
        n.id = propObj.id;
    }
    if (propObj.value != null) {
        n.innerText = propObj.value;
    }
    if (propObj.parent != null) {
        propObj.parent.appendChild(n)
    }
    return n;
}
$hide = function (element) {
    element.style.display = "none";
}
$show = function (element) {
    element.style.display = "block";
}

// Cookie helpers
// source: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}