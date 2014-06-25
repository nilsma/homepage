function getProjects(callback) {
    var result;

    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject();
    }

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            result = xmlhttp.responseText;
            callback(result);
        }
    }

    xmlhttp.open("POST", "../public/get-projects.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function loadSlideshow() {
    getProjects(function(result) {
        alert(result);
    });
}

function init() {
    loadSlideshow();
}

window.onload = function() {
    init();
}