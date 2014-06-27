function getProjectsData(callback) {
    var result;

    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject();
    }

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            result = JSON.parse(xmlhttp.responseText);
            callback(result);
        }
    }

    xmlhttp.open("POST", "../public/get-projects.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function getProjects(callback) {
    getProjectsData(function(data) {
        var keys = Object.keys(data);
        var projects = new Array();
        for(var i = 0; i < keys.length; i++) {
            projects.push(data[keys[i]]);
        }
        callback(projects);
    });
}

function runSlideshow(project_name, images, callback) {
    var keys = Object.keys(images);
    var element = document.getElementById('screenshot');
    for(var i = 0; i < keys.length; i++) {
        alert('../images/projects/' + project_name + '/' + images[keys[i]]);
    }
    callback();
}

function increaseCounter(counter, length, callback) {
    var increased = counter;
    if(counter < (length - 1)) {
        increased++;
    } else {
        increased = 0;
    }

    callback(increased);
}

function setTitle(title) {
    var element = document.getElementById('top_header');
    element.innerHTML=title;
}

function setParagraphs(paragraphs) {
    //alert(paragraphs);
}

function initSlideshow() {
    getProjects(function(projects) {
        var length = projects.length;
        var counter = 0;
        while(counter < length) {
            var project = projects[counter];
            var keys = Object.keys(project);
            var project_name = project[keys[0]];
            var title = project[keys[1]];
            var paragraphs = project[keys[2]];
            var images = project[keys[3]];
            setTitle(title);
            setParagraphs(paragraphs);
            runSlideshow(project_name, images, function() {
                increaseCounter(counter, length, function(increased) {
                    counter = increased;
                });
            });
        }
    });
}

window.onload = function() {
    initSlideshow();
}