var links = false;
let prevLocation = false;
var doingNav = false;
let projects = [];

window.onload = () => {

    addCustomEventListener(".nav.forward", 'click', navForwardListener);

    addCustomEventListener(".nav.backward", 'click', navBackwardListener);

    // Para prevenir el salto de scroll en el popstate
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
};
window.addEventListener('popstate', function (event) {
    event.preventDefault();
    if (event.state) {

        var linkData = getPageData(event.state.hasOwnProperty('page') ? event.state.page : 'home');

        var init = linkData.hasOwnProperty('init') ? linkData.init : function () {};
        init(event.state);
    }
});

var getPageData = function (key = false) {
    if (links === false) {
        links = {

            'home': {
                'init': homeInit
            },
            'why-us': {
                'init': homeSectionWhyUs
            },
            'what-we-do': {
                'init': homeSectionWhatWeDo
            },
            'our-team': {
                'init': homeSectionOurTeam
            },
            'our-projects': {
                'init': homeSectionOurProjects
            },
            'contact': {
                'title': "Contact",
                'init': contactInit,
                'end': contactEnd
            },
            'projects': {
                'title': "Our Projects",
                'init': projectListInit,
//                'end': projectListEnd,
            },
            'project': {
                'title': "Project ",
                'init': projectInit,
//                'end': projectClose,
            },
            'project-next': {
                'title': "Project ",
                'init': projectNextInit,
            }
        };
    }

    if (key != false) {
        if (links.hasOwnProperty(key)) {
            return links[key];
        }
    }
    return false;
};

var navForwardListener = function (e) {
    e.preventDefault();
    var element = e.target;

    return navForward(element);
};

var navForward = function (element, preventInit) {
    if (doingNav) {
        return false;
    }
    var link = element.getAttribute('href');
    var page = element.getAttribute('data-page');

    var linkData = getPageData(page);

    var init = linkData.hasOwnProperty('init') ? linkData.init : function () {};
    var title = linkData.hasOwnProperty('title') ? APP_TITLE + " - " + linkData.title : APP_TITLE;

    var data = {link: link, page: page, title: title};
    if (element.getAttribute('data-id') != null) {
        data['id'] = element.getAttribute('data-id');
    }


    if (link !== document.location.href) {
        prevLocation = document.location.href;
        setTimeout(function () {
            history.pushState(data, data.title, link);
        }, 500);
    }

    if (preventInit !== true) {
        init(data);
    }
    
    setTimeout(function () {
        doingNav = false;
    }, 2000);


    return false;
}



var navBackwardListener = function (e) {
    e.preventDefault();
    var element = e.target;

    var linkDataEnd = getPageData(element.getAttribute('data-page-end'));
    var end = linkDataEnd.hasOwnProperty('end') ? linkDataEnd.end : function () {};

    end();

    if (element.getAttribute('data-page') == null) {
        if (prevLocation == null) {
            history.pushState({title: APP_TITLE, link: webPath}, APP_TITLE, webPath);
            var linkData = getPageData('home');
            var init = linkData.hasOwnProperty('init') ? linkData.init : function () {};
            init(linkData);
        } else {
            history.back();
        }
    } else {
        var link = element.getAttribute('href');

        if (prevLocation == link) {
            history.back();
        } else {
            navForward(element);
        }

    }


    return false;
};

var navInitState = (page) => {
    var pageData = getPageData(page);
    var title = pageData.hasOwnProperty('title') ? APP_TITLE + " - " + pageData.title : APP_TITLE;

    var data = {title: title, link: location.href, page: page};

    history.replaceState(data, data.title);
};