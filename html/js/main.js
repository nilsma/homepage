var interval_id;
var slideshow_id;

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

function setProjectTitle(title) {
    var elements = new Array();
    var element = document.getElementById('bottom_header');
    elements.push(element);
    var element = document.getElementById('top_header');
    elements.push(element);

    for(var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = title;
    }
}

function setImage(project_name, image) {
    var path = '../images/projects/' + project_name + '/' + image;
    var elements = document.getElementsByClassName('screenshot');
    var current_canvas;
    var next_canvas;
    if(window.getComputedStyle(elements[0], null).getPropertyValue('display') === 'none') {
        next_canvas = elements[0];
        current_canvas = elements[1];
    } else {
        next_canvas = elements[1];
        current_canvas = elements[0];
    }

    setNextCanvasImage(next_canvas, path, function() {
        hideCanvas(current_canvas, function() {
            $(next_canvas).fadeIn(500);
        });
    });
}

function hideCanvas(element, callback) {
    element.style.display='none';
    callback();
}

function setProjectParagraphs(project_paragraphs) {
    var paragraph_keys = Object.keys(project_paragraphs);
    document.getElementById('open_par').innerHTML = project_paragraphs[paragraph_keys[0]];
    document.getElementById('mid_par').innerHTML = project_paragraphs[paragraph_keys[1]];
    document.getElementById('close_par').innerHTML = project_paragraphs[paragraph_keys[2]];
}

function setProjectLink(link) {
    var url = 'http://'.concat(link);
    document.getElementById('link').children[0].setAttribute('href', url);
}

function setCounter(limit, current, callback) {
    var incremented;
    if(current < limit - 1) {
        incremented = current + 1;
    } else {
        incremented = 0;
    }

    callback(incremented);
}

function setIntervalId(id) {
    interval_id = id;
}

function setSlideshowId(id, callback) {
    slideshow_id = id;
    callback();
}

function setNextCanvasImage(next_canvas, path, callback) {
    next_canvas.setAttribute('src', path);
    callback();
}

function setPreviousSlideshow(current_slideshow_id, callback) {
    getProjects(function(projects) {
        var num_projects = Object.keys(projects).length;
        var previous;
        if(current_slideshow_id >= 1) {
            previous = current_slideshow_id - 1;
        } else {
            previous = num_projects - 1;
        }
        callback(previous);
    });
}

function setNextSlideshow(current_slideshow_id, callback) {
    getProjects(function(projects) {
        var num_projects = Object.keys(projects).length;
        var next;
        if(current_slideshow_id >= num_projects - 1) {
            next = 0;
        } else {
            next = current_slideshow_id + 1;
        }
        callback(next);
    });
}

function displayProject(project) {
    setProjectTitle(project.title);
    setProjectParagraphs(project.paragraphs);
    setProjectLink(project.link);
    setImage(project.name, project.images[0]);
}

function runSlideshow(projects, counter) {
    var keys = Object.keys(projects);
    var project = projects[keys[counter]];

    setSlideshowId(counter, function() {

        displayProject(project);

        roundabout(project.name, project.images, function() {
            setCounter(keys.length, counter, function(incremented) {
                runSlideshow(projects, incremented);
            });
        });
    });
}

function roundabout(project_name, images, callback) {
    var counter = 3;
    var keys = Object.keys(images);

    var interval = setInterval(function() {
        if(counter >= keys.length) {
            clearInterval(interval);
            callback();
        } else {
            setImage(project_name, images[counter]);
            counter++;
        }
    }, 5000);

    setIntervalId(interval);
}

function initSlideshow(id) {
    getProjects(function(projects) {
        setSlideshowId(id, function() {
            runSlideshow(projects, slideshow_id);
        });
    });
}

function stopSlides(callback) {
    clearInterval(interval_id);
    callback();
}

function previousSlide() {
    stopSlides(function() {
        setPreviousSlideshow(slideshow_id, function(previous) {
            initSlideshow(previous);
        });
    });
}

function nextSlide() {
    stopSlides(function() {
        setNextSlideshow(slideshow_id, function(next) {
            initSlideshow(next);
        });
    });
}

function addListeners(elements, func_name) {
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', func_name, false);
    }
}

function attachListeners() {
    var elements = new Array();
    var element = document.getElementById('arrow_left');
    elements.push(element);
    addListeners(elements, previousSlide);

    var elements = new Array();
    var element = document.getElementById('arrow_right');
    elements.push(element);
    addListeners(elements, nextSlide);
}

function hideAndRemove(callback) {
    var elements = new Array();
    elements.push(document.getElementById('pres_inner'));
    elements.push(document.getElementById('footer_name'));
    elements.push(document.getElementById('footer_link'));

    for(var i = 0; i < elements.length; i++) {
        elements[i].style.display='none';
    }

    $('#title_header').removeClass('focus_text_white');
    $('#subtitle_header').removeClass('focus_text_gray');
    $('header').removeClass('bottom_borders');
    $('footer').removeClass('top_borders');

    $('#pres_main').addClass('mainShrink');
    document.getElementById('red_line').style.width='0';
    callback();
}

function animate(callback) {
    $('#red_line').animate({
       width: ['+=100%', 'swing']
    }, 1000, function() {
        $('#pres_main').addClass('mainExpand');
        $('#title_header').addClass('focus_text_white');
        $('#subtitle_header').addClass('focus_text_gray');
        $('header').addClass('bottom_borders');
        $('footer').addClass('top_borders');
        $('#pres_inner').delay(1200).fadeIn(1000);
        $('#footer_link').delay(1500).fadeIn(3000);
    });
    callback();
}

function init() {
    hideAndRemove(function() {
        animate(function() {
            attachListeners();
            initSlideshow(0);
        });
    });
}

window.onload = function() {
    init();
}