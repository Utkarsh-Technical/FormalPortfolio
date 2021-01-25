let gettingListItem = false;
let sendingContact = false;
let gettingList = false;
let gettingEdit = false;
let gettingNext = false;
let contactForm;
let projectListInnerHtml = false;
let projectDetailInnerHtml = {};
let intervalID;
let contactClosing = false;
let videoPlaying = false;
let homeInitialized = false;
let smoothScroll;

document.onreadystatechange = () => {
    if (document.readyState === 'interactive') {

        contactForm = document.getElementById('contactForm');

        checkImagesLoaded(['image_1, image_2, image_3, image_4, image_5, video_01']);

        clickEventsInit();

        smoothScrollInit();

        initScrollProjectList();

        if (document.querySelector('.wrap.home').classList.contains('contact')) {
            contactInit();
            navInitState('contact');
        }
        if (document.querySelector('.wrap.home').classList.contains('projects')) {
            projectSaveInitHtml();

            projectListInit();
            navInitState('projects');
        }

        if (document.querySelector('.wrap.home').classList.contains('project') && document.querySelector('.content_work .row.content_headings') != null) {

            var id = document.querySelector('.content_work .row.content_headings').getAttribute('data-id');
            projectDetailSaveInitHtml(id);

            projectInit({id: id});
            navInitState('project');

        }
        if (document.querySelector('.wrap.home').classList.contains('home-section')) {
            if (document.querySelector('.wrap.home').getAttribute('data-page') != "") {
                var page = document.querySelector('.wrap.home').getAttribute('data-page');
//                homeSectionInit(page);
                homeInit(page);
                navInitState(page);
            } else {
                homeInit();
                navInitState('home');
            }
        }
    }
};


/***************************************************************************
 ************************     GENERAL     **********************************
 ***************************************************************************/
var mainSetActiveAndResize = function (timeoutTime) {

    setTimeout(function () {
        if (document.querySelector('body').classList.contains('show')) {
            document.querySelector('body').classList.remove('show');
        }
        document.querySelector('body').classList.add('active');
        window.dispatchEvent(new Event('resize'));
    }, timeoutTime);
};



/***************************************************************************
 **********************     CLICK EVENTS     *******************************
 ***************************************************************************/
var clickEventsInit = () => {

    // Our Team Slider
    setTimeout(function () {
        document.querySelectorAll('.navigation_slider li a').forEach((element) => {
            element.addEventListener('click', homeOurTeamSliderNav);
        });
    }, 5000);

    // Down project del projecto que estoy mostrando
    addCustomEventListener('.content_work .down_project', 'click', (e) => {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $(".content_big_image").offset().top - 20
        }, 100);
    }, '.content_projects ');

    // Down project del next project
    addCustomEventListener('.content_work_next .a-down-project', 'click', (e) => {
        e.preventDefault();
        var target = e.target;
        if (target.tagName === "IMG") {
            target = target.parentNode;
        }

        navForward(target);
    }, '.content_projects ');

    // Contact
    document.querySelector('.modal.content_contact .row.form .btn_send').addEventListener('click', contactSend);
    document.querySelector('.modal.content_contact .row.content_success .btn_send').addEventListener('click', contactClean);
};


/***************************************************************************
 *************************     DEMO     ************************************
 ***************************************************************************/
var smoothScrollInit = () => {
//    // And then...
//    preloadImages().then(() => {
//        // Remove the loader
//        document.body.classList.remove('loading');
//
//    });
// And then..
    preloadImages().then(() => {
        // Remove the loader
        document.body.classList.remove('loading');
        // Get the scroll position and update the lastScroll variable
        getPageYScroll();
        lastScroll = docScroll;
        // Initialize the Smooth Scrolling
        smoothScroll = new SmoothScroll();
    });
};
/***************************************************************************
 *************************     HOME     ************************************
 ***************************************************************************/
var homeInit = (section) => {

    var timeoutTime = 0;

    contactEnd();

    if (!contactClosing) {

        /* Mobile Hide menu on click */
        if (document.querySelector('.header_navigation').classList.contains('open_menu_mobile')) {
            document.querySelectorAll('body, .header_navigation, .btn_open_close').forEach(element => element.classList.remove('open_menu_mobile'));
            timeoutTime = 1000;

        }

        setTimeout(function () {

            document.querySelector('.header_navigation').classList.remove('hide');

            var playPromise = document.getElementById("video_01").play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    videoPlaying = true;
                }).catch(error => {
                    videoPlaying = false;
                });
            }

            let timeoutTime = projectListClose(0);
            timeoutTime = projectClose(timeoutTime);

            setTimeout(() => {
                $('.mobile_overlay, .header_navigation').removeClass('white');


                $('.content_projects').removeClass('animation');

            }, timeoutTime + 500);


            setTimeout(() => {
                if (typeof (section) == "undefined")
                    section = 'home';

                if (typeof section === 'object')
                    section = section.page;

                if (homeInitialized) {
                    if (section != 'home') {
                        if (document.querySelector('section.wrap.home').getAttribute('data-scroll-pos') != null) {
                            window.scrollTo(0, document.querySelector('section.wrap.home').getAttribute('data-scroll-pos'));
                        }
                    }
                } else {
                    if (section != 'home') {
                        console.log(section);
                        homeSectionInit(section);
                    }
                }
                if (section == 'home') {
                    window.scrollTo(0, 0);
                    $("li.item").removeClass('active');
                    document.querySelector('li.home').classList.add('active');
                }

                homeInitialized = true;

            }, timeoutTime);

            setTimeout(() => {
                $('.wrap.home, nav.internal_navigation, section.content_social_fixed').removeClass('remove');

                $('.content_projects, .content_project').removeClass('show');
                $('.content_projects_list').addClass('remove');

                $('.btn_open_projects').removeClass('active');
            }, timeoutTime + 1500);


            setTimeout(() => {
                $('.wrap.home, nav.internal_navigation, section.content_social_fixed').removeClass('hide')
                $('.modal').removeClass('black').addClass('white');

                mainSetActiveAndResize(500);

            }, timeoutTime + 2500);


        }, timeoutTime);
    } else {
        contactClosing = false;
    }
};

var homeSectionInit = (page) => {
    gotoSection(page);
};

var homeSectionLoad = (page) => {
    homeInit(page);
};

var homeSectionWhyUs = () => {
    homeSectionLoad('why-us');
};
var homeSectionWhatWeDo = () => {
    homeSectionLoad('what-we-do');
};
var homeSectionOurTeam = () => {
    homeSectionLoad('our-team');
};
var homeSectionOurProjects = () => {
    homeSectionLoad('our-projects');
};

var gotoSection = function (page) {
    console.log("gotoSection page: ", page);

    if (typeof page === 'object')
        page = 'home';
    scrollToSection($('li.item.' + page + ' a'), false);
};

var homeOurTeamSliderNav = function (e) {
    e.preventDefault();
    // Quito el active de todos los elementos del slider
    document.querySelectorAll('article.content_team .navigation_slider li, article.content_team .content_img_slider figure').forEach(function (element) {
        element.classList.remove('active');
    });

    // Obtengo el index del elemento clickeado y lo marco activo, en el nav li y en el figure
    var li = this.parentNode;
    var index = Array.prototype.indexOf.call(li.parentNode.children, li);
    setTimeout(() => {
        document.querySelectorAll('article.content_team .navigation_slider li')[index].classList.add('active');
        document.querySelectorAll('article.content_team .content_img_slider figure')[index].classList.add('active');
    }, 300);
};


/***************************************************************************
 **********************     CONTACT     ************************************
 ***************************************************************************/

var contactInit = () => {
//    contactClean();

    document.querySelector('.modal.content_contact').classList.add('show');
    document.body.classList.add('show');
};

var contactEnd = () => {
    if (document.querySelector('.modal.content_contact').classList.contains('show')) {

        contactClosing = true;

        document.querySelector('.modal.content_contact').classList.remove('show');
        document.body.classList.remove('show');

        contactClean();
    }

};

var contactClean = () => {
    document.querySelector('.modal.content_contact .content_form').classList.remove('success');

    contactForm.querySelectorAll('input, textarea').forEach(function (element) {
        element.value = "";
    });

    contactForm.querySelectorAll('.warning').forEach(function (element) {
        element.classList.remove('warning');
    });
};

var contactSend = (e) => {
    e.preventDefault();

    if (sendingContact) {
        return false;
    }

    contactForm.querySelectorAll('.warning').forEach(function (element) {
        element.classList.remove('warning');
    });

    var errores = [];

    contactForm.querySelectorAll('input, textarea').forEach(function (element) {
        var input_name = element.getAttribute('name');

        if (element.value.trim() == "") {
            errores.push(input_name);
            element.parentElement.classList.add('warning');
        }
    });
    if (errores.length > 0) {
        return false;
    }

    sendingContact = true;
    var formData = new FormData(contactForm);

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("POST", contactForm.getAttribute('action'));
    xhr.send(formData);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {

            if (xhr.response.status) {

                setTimeout(() => {
                    document.querySelector('.modal.content_contact .content_form').classList.add('success');

                    sendingContact = false;
                }, 500);
            }
        }
    };
};


/***************************************************************************
 **************************     PROJECTS     *******************************
 ***************************************************************************/


var projectGeneralSettings = (timeoutTime) => {

    document.querySelector('.modal').classList.add('black');

    document.querySelector('.content_projects').classList.add('show');

    /*Mobile Hide menu on click*/
    document.querySelectorAll('body, .header_navigation, .btn_open_close').forEach(element => element.classList.remove('open_menu_mobile'));

    if (!document.querySelector('.wrap.home').classList.contains('hide')) {
        document.querySelectorAll('.wrap.home, nav.internal_navigation, section.content_social_fixed').forEach(element => element.classList.add('hide'));


        // , nav.internal_navigation, section.content_social_fixed

        setTimeout(function () {
            document.querySelectorAll('.wrap.home, nav.internal_navigation, section.content_social_fixed').forEach(element => element.classList.add('remove'));//.classList.add('remove');
        }, timeoutTime + 1000);
    }

    setTimeout(function () {
        $("html, body").animate({scrollTop: 0}, 0);
    }, timeoutTime + 1000);

    setTimeout(function () {
        document.querySelector('.content_projects').classList.add('animation');
    }, timeoutTime + 2500);

    setTimeout(function () {

        document.querySelector('body').classList.remove('active');

    }, timeoutTime + 2500);

    setTimeout(function () {
        document.querySelectorAll('.mobile_overlay, .header_navigation').forEach(element => element.classList.add('white'));
    }, timeoutTime + 800);

};

/****************************     LIST     *********************************/
var projectListInit = () => {
    var timeoutTime = 0;

    var callback = () => {
        document.querySelector('.content_projects_list').innerHTML = projectListInnerHtml;

        document.querySelector('.btn_open_projects').classList.add('active');

        timeoutTime = projectClose(timeoutTime);
        projectGeneralSettings(timeoutTime);

        setTimeout(function () {

            document.querySelector('.header_navigation').classList.remove('hide');

            if (document.querySelector('.content_projects_list').classList.contains('remove')) {
                document.querySelector('.content_projects_list').classList.remove('remove');
//                setTimeout(function () {
                document.querySelector('.content_projects_list').classList.remove('hide');
//                }, 1000);
            }

            if (document.querySelector('.content_projects_list li.show')) {
                document.querySelectorAll('.content_projects_list li.show').forEach(element => element.style.display = "block");
            }

            // chequea finish loading y cuando cambio de vista, sacar el animation info
            var interval = setInterval(function () {
                if (document.querySelector('body').classList.contains('finish_loading')) {
                    document.querySelector('.content_projects_list').classList.add('animation_info');
                    clearInterval(interval);

                    mainSetActiveAndResize(500);
                }
            }, 200);
        }, timeoutTime + 2000);


    };


    if (!contactClosing) {
        if (document.querySelector('.content_projects_list .center_content') == null) {
            if (gettingList) {
                return false;
            }
            gettingList = true;

            var request = new XMLHttpRequest();
            request.open("GET", webPath + "console/project/getList/");
            request.send('');

            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    var jsonResponse = JSON.parse(request.response);

                    setTimeout(() => {
                        projectListInnerHtml = jsonResponse.html;
                        callback();
                    }, 500);
                }

                gettingList = false;
            };
        } else {
            callback();
        }
    } else {
        contactClosing = false;
    }

};

var projectSaveInitHtml = () => {
    if (document.querySelector('.content_projects_list') != null) {
        projectListInnerHtml = document.querySelector('.content_projects_list').innerHTML;
    }
};

var initScrollProjectList = () => {
// Listen for scroll events
    document.addEventListener('scroll', projectListScrollEvent, false);

};

// Log scroll events
var projectListScrollEvent = (event) => {
    if (!gettingListItem && document.querySelector('.content_projects_list') != null &&
            !document.querySelector('.content_projects_list').classList.contains('hide') && document.querySelector('li.loading') != null) {

        var element = document.querySelector('li.loading');

        var position = element.getBoundingClientRect();

        // checking whether fully visible
//        if (position.top >= 0 && position.bottom <= window.innerHeight) {

        // checking for partial visibility
        if (position.top < window.innerHeight && position.bottom >= 0) {
            console.log('entró en scroll');
            var id = $(element).data('id');
            projectListGetItem(id, element);
        }

        // checking for partial visibility
//        if (position.top < window.innerHeight && position.bottom >= 0) {
//        }


    }
};

var projectListGetItem = (id, loadingElement) => {
    if (gettingListItem) {
        return false;
    }
    $.ajax({
        url: webPath + 'console/project/getLisItem/',
        type: 'POST',
        data: {id: id},
        dataType: "json",
        async: true,

        beforeSend: () => {
            gettingListItem = true;
        },
        success: (json) => {

            if (json.status) {

                loadingElement.classList.remove('loading');
                loadingElement.classList.remove('show');

                $(loadingElement).prepend(json.html)

                setTimeout(function () {
                    $(loadingElement).addClass('loaded');

                }, 200);

                if (document.querySelector('li.loading')) {
                    var count = 0;
                    document.querySelectorAll('li.loading').forEach(function (el) {
                        if (count < 3) {
                            el.classList.add('show');
                            el.style.display = 'block';
                            count++;
                        }
                    });
                    mainSetActiveAndResize(500);
                }
            }
        }, complete: () => {
            gettingListItem = false;
        }
    });
};

var projectListClose = (timeoutTime, setWhite) => {
    if (document.querySelector('.content_projects_list').classList.contains('animation_info')) {
        if (setWhite) {
            document.querySelector('body').classList.add('white');
        }

        timeoutTime += 1500;
        document.querySelector('.content_projects_list').classList.remove('animation_info');

        setTimeout(() => {
            document.querySelector('.content_projects_list').classList.add('hide');
        }, timeoutTime);

        setTimeout(() => {
            document.querySelector('.content_projects_list').classList.add('remove');
        }, timeoutTime + 1000);

    }

    return timeoutTime;
};

/****************************     DETAIL     *********************************/

var projectInit = (data) => {
    var timeoutTime = 0;
    var callback = (id) => {
        if (id != undefined) {

            timeoutTime = projectListClose(timeoutTime, true);

            projectGeneralSettings(timeoutTime);

            if (videoPlaying) {
                document.getElementById("video_01").pause();
            }

            document.querySelector('.header_navigation').classList.add('hide');

            document.querySelector('.content_project').classList.add('show');
            setTimeout(function () {
                document.querySelector('.content_project').classList.add('animation');

                document.querySelector('.btn_open_projects').classList.remove('active');

                $('.content_work').html(projectDetailInnerHtml[id]);


                setTimeout(() => {
                    getNext(id, callbackNext);

                    projectInitComponents();

                    mainSetActiveAndResize(2000);


                    document.querySelector('body').classList.remove('white');
                }, 500);

            }, timeoutTime + 2000);

        }
    };
    if (!contactClosing) {
        if (data !== undefined && data.hasOwnProperty('id')) {
            var id = data.id;
            projectGet(id, callback);
        } else {
            callback(id);
        }
    } else {
        contactClosing = false;
    }

};

var projectDetailSaveInitHtml = (id) => {
    if (id) {
        projectDetailInnerHtml[id] = document.querySelector('.content_work').innerHTML;
    }

};

var projectInitComponents = (next) => {

    setTimeout(() => {
        $('.content_work .responsive').not('.slick-slider').slick({
            dots: true,
            arrows: false,
            infinite: false,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
            variableWidth: false,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 1000,
                    settings: {
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1}
                }
            ]
        });

        $('.content_work .responsive_mobile').not('.slick-slider').slick({
            dots: true,
            arrows: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: false,
            centerMode: true,
            centerPadding: '30px'
        });

        var image = document.querySelector('.content_work .thumbnail');
        new simpleParallax(image, {
            delay: 0.4,
            scale: 1.2
        });


        // Drag and Drop Add Class
        if (document.querySelector('.content_work .content_slider_drag')) {
            document.querySelector('.content_work .content_slider_drag').addEventListener('mouseover', function () {
                $('.cursor-dot-outline, .cursor-dot').addClass('active');
            });

            document.querySelector('.content_work .content_slider_drag').addEventListener('mouseout', function () {
                $('.cursor-dot-outline, .cursor-dot').removeClass('active');
            });
        }

        /*Show Description*/
        $('.content_work .content_description').waypoint(
                function (direction) {
                    $('.content_work .content_description').addClass('intro_animation');
                    this.destroy();
                },
                {offset: '300'});

        /*Show Slider Drag*/
        $('.content_work .content_slider_drag').waypoint(
                function (direction) {
                    $('.content_work .content_slider_drag').addClass('intro_animation');
                    this.destroy();
                },
                {offset: '600'}
        );

        /*Show This Project*/
        $('.content_work .content_this_project').waypoint(
                function (direction) {
                    $('.content_work .content_this_project').addClass('intro_animation');
                    this.destroy();
                },
                {offset: '600'}
        );

        /*Show Testimonial*/
        if (document.querySelector('.content_work .row.content_testimonial') != null) {
            if (!document.querySelector('.content_work .row.content_testimonial').classList.contains('hide')) {
                $('.content_work .content_testimonial').waypoint(
                        function (direction) {
                            $('.content_work .content_testimonial').addClass('intro_animation');
                            this.destroy();
                        },
                        {offset: '600'}
                );
            } else {
                document.querySelector('.content_work .row.content_testimonial').style.display = "none";
            }
        }

        $('.content_work_next').waypoint(
                function (direction) {
                    $('.content_work_next').addClass('intro_animation');
                    this.destroy();
                },
                {offset: '600'}
        );

    }, 1000);
};

var projectClose = function (timeoutTime) {

    if (document.querySelector('.content_project').classList.contains('animation')) {
        timeoutTime += 1000;
        document.querySelector('.content_project').classList.remove('animation');

        setTimeout(function () {
            document.querySelector('.content_project').classList.remove('show');
        }, timeoutTime + 2000);
    }

    return timeoutTime;
};

var projectGet = (id, callback) => {
    if (projectDetailInnerHtml.hasOwnProperty(id)) {
        callback(id);
    } else {

        if (gettingEdit) {
            return false;
        }
        gettingEdit = true;

        var xhr = new XMLHttpRequest();


        var url = new URL(webPath + "console/project/getDetail/");
        url.search = new URLSearchParams({id: id}).toString();
        xhr.open("GET", url);
        xhr.responseType = 'json';
        xhr.send('');

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {

                setTimeout(() => {
                    // projectDetailInnerHtml.splice(id, 0, xhr.response.html);
                    $('.content_work').html("");
                    projectDetailInnerHtml[id] = xhr.response.html.toString();
                    callback(id);
                }, 500);

            }
            gettingEdit = false;
        };
    }
};

//var elementTop;
var projectNextInit = () => {
    $('.content_work').addClass('hide');

    setTimeout(function () {
        $('body').addClass('show');
    }, 200);

    var elementTop = document.querySelector('.content_work_next').getBoundingClientRect().top;
    setTimeout(function () {
        $('.content_work_next').addClass('animate');

        document.querySelector('.content_work_next').style.transform = "translateY(-" + elementTop + "px)";

    }, 500);

    setTimeout(function () {

        smoothScroll.destroy()

        $('.content_work_next').css({top: elementTop + "px"});

        $('.content_work_next').addClass('show');

    }, 1000);

    setTimeout(function () {
        $('.content_work').addClass('remove');

        $('.content_work').remove();
    }, 1500);

    setTimeout(() => {
        $("html, body").animate({scrollTop: 0}, 0);

        $('.content_work_next').addClass('open');

        $('.content_work_next').css({top: elementTop + "px"});


        var id = $('.content_work_next .down_project').data('id');

        getNext(id, callbackNext);

        mainSetActiveAndResize(500);
    }, 2000);

    setTimeout(() => {
        $('.content_work_next').addClass('content_work').removeClass('content_work_next intro_animation');

        $('<article class="row row-detail content_work_next intro_animation"></article>').insertAfter('.content_work');

        projectInitComponents(true);

    }, 2500);

    setTimeout(() => {
        smoothScroll.reload();
    }, 3000);

    setTimeout(() => {
        $('body').removeClass('show');

        mainSetActiveAndResize(500);

    }, 4500);


};

var callbackNext = function (id) {
    $('.content_work_next').html(projectDetailInnerHtml[id]);
};

var getNext = (id, callback) => {
    if (gettingNext) {
        return false;
    }
    gettingNext = true;

    var xhr = new XMLHttpRequest();

    const url = new URL(webPath + "console/project/getNext/");
    url.search = new URLSearchParams({id: id}).toString();
    xhr.open("GET", url);
    xhr.responseType = 'json';
    xhr.send('');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
                // projectDetailInnerHtml.splice(id, 0, xhr.response.html);
                if (xhr.response.hasOwnProperty('id')) {
                    var idNext = xhr.response.id;
                    projectDetailInnerHtml[idNext] = xhr.response.html;
                    callback(idNext);
                }
            }, 500);

        }
        gettingNext = false;
    };

};

var addCustomEventListener = function (selector, event, handler, parent = 'body') {

    let rootElement = document.querySelector(parent);
    //since the root element is set to be body for our current dealings
    rootElement.addEventListener(event, function (evt) {
        var targetElement = evt.target;
        while (targetElement != null) {
            if (targetElement.matches(selector)) {
                handler(evt);
                return;
            }
            targetElement = targetElement.parentElement;
        }
    }, true);
};