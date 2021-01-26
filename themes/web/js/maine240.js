var $window;
var $document;

var section01;
var section02;
var section03;
var section04;
var section05;
var section06;

var section01Top;
var section02Top; // 300
var section03Top;
var section04Top;
var section05Top;
var section06Top;

var section01End;
var section02End;
var section03End;
var section04End;
var section05End;
var section06End;

var scrolling = false;

$(document).ready(function () {

    /*Cursor*/
    var cursor = {
        delay: 8,
        _x: 0,
        _y: 0,
        endX: (window.innerWidth / 2),
        endY: (window.innerHeight / 2),
        cursorVisible: true,
        cursorEnlarged: false,
        $dot: document.querySelector('.cursor-dot'),
        $outline: document.querySelector('.cursor-dot-outline'),

        init: function () {
            // Set up element sizes
            this.dotSize = this.$dot.offsetWidth;
            this.outlineSize = this.$outline.offsetWidth;

            this.setupEventListeners();
            this.animateDotOutline();
        },

        setupEventListeners: function () {
            var self = this;

            // Anchor hovering
            document.querySelectorAll('a').forEach(function (el) {
                el.addEventListener('mouseover', function () {
                    self.cursorEnlarged = true;
                    self.toggleCursorSize();
                });
                el.addEventListener('mouseout', function () {
                    self.cursorEnlarged = false;
                    self.toggleCursorSize();
                });
            });

            // Click events
            document.addEventListener('mousedown', function () {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            document.addEventListener('mouseup', function () {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });


            document.addEventListener('mousemove', function (e) {
                // Show the cursor
                self.cursorVisible = true;
                self.toggleCursorVisibility();

                self.endX = e.clientX;
                self.endY = e.clientY;

                self.$dot.style.top = self.endY + 'px';
                self.$dot.style.left = self.endX + 'px';
            });

            // Hide/show cursor
            document.addEventListener('mouseenter', function (e) {
                self.cursorVisible = true;
                self.toggleCursorVisibility();
                self.$dot.style.opacity = 1;
                self.$outline.style.opacity = 1;
            });

            document.addEventListener('mouseleave', function (e) {
                self.cursorVisible = true;
                self.toggleCursorVisibility();
                self.$dot.style.opacity = 0;
                self.$outline.style.opacity = 0;
            });
        },

        animateDotOutline: function () {
            var self = this;

            self._x += (self.endX - self._x) / self.delay;
            self._y += (self.endY - self._y) / self.delay;
            self.$outline.style.top = self._y + 'px';
            self.$outline.style.left = self._x + 'px';

            requestAnimationFrame(this.animateDotOutline.bind(self));
        },

        toggleCursorSize: function () {
            var self = this;

            if (self.cursorEnlarged) {
                self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
                self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            } else {
                self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
                self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        },

        toggleCursorVisibility: function () {
            var self = this;

            if (self.cursorVisible) {
                self.$dot.style.opacity = 1;
                self.$outline.style.opacity = 1;
            } else {
                self.$dot.style.opacity = 0;
                self.$outline.style.opacity = 0;
            }
        }
    };
    /*Preload Images*/
    cursor.init();

    $window = $(window);
    $document = $(document);

    section01 = $('#s1');
    section02 = $('#s2');
    section03 = $('#s3');
    section04 = $('#s4');
    section05 = $('#s5');
    section06 = $('#s6');

    section01Top = section01.position().top - 400;
    section02Top = section02.position().top - 400; // 300
    section03Top = section03.position().top - 400;
    section04Top = section04.position().top - 400;
    section05Top = section05.position().top - 400;
    section06Top = section06.position().top;

    section01End = section01Top + section01.height();
    section02End = section02Top + section02.height();
    section03End = section03Top + section03.height();
    section04End = section04Top + section04.height();
    section05End = section05Top + section05.height();
    section06End = section06Top + section06.height();

    /*Active Fixed Menu with Scroll*/
    $window.scroll(function () {
        var scrollTop = $window.scrollTop();

        checkOnEnterSection(scrollTop);

    });

    /*Button Scroll*/
    $('li.item a').click(function (e) {
        e.preventDefault();
        scrollToSection($(this), true);
    });

    /*Btn Arrow*/
    $(".btn_arrow_down").click(function () {
        if (document.querySelector("ul.row.nav_home li.row.item.active").nextElementSibling) {
            document.querySelector("ul.row.nav_home li.row.item.active").nextElementSibling.querySelector('a').click();
        }
    });

    $(".btn_arrow_up").click(function () {
        if (document.querySelector("ul.row.nav_home li.row.item.active").previousElementSibling) {
            document.querySelector("ul.row.nav_home li.row.item.active").previousElementSibling.querySelector('a').click();
        }

    });


    /*Open/Close Mobile*/
    $('.btn_open_close').click(function (e) {
        e.preventDefault();
        $('body, .content_logo, .btn_open_close, .header_navigation').toggleClass('open_menu_mobile');
    });


    /*Mobile down arrow*/
    $(".btn_arrow_down_mobile").click(function () {
        $('html, body').animate({
            scrollTop: $(".content_wwd").offset().top - 50
        }, 100);
    });

});


var scrollToSection = function ($tab, doNavForward) {
    scrolling = true;

    doNavForward = !!doNavForward;

    var sectionID = $tab.data('section');
    var animation = $tab.data('animation');

    var offsetTop = $(sectionID).offset().top;


    $('html, body').animate({
        scrollTop: offsetTop
    }, 100);

    setTimeout(function () {
        $(animation).addClass('show');

        scrollNav($tab.parent(), doNavForward);
    }, 200);
    
    setTimeout(function () {
        scrolling = false;
    }, 800);
};


var checkImagesLoaded = function (arrayIds) {
    // Initialize the counter
    var counter = arrayIds.length;

    arrayIds.forEach(function (id) {
        var element = $('#' + id);
        if (!element.prop('complete')) {
            element.on('load', function () {
                counter--;
                whenImagesAreLoaded(counter);
            });
            element.on('error', function () {
                counter--;
                whenImagesAreLoaded(counter);
            });
        } else {
            counter--;
            whenImagesAreLoaded(counter);
        }
    });
};

var whenImagesAreLoaded = function (counter) {
    if (counter === 0) {

        setTimeout(function () {
            $('.content_loading').addClass('load');
        }, 2000);

        setTimeout(function () {
            $('.content_loading').addClass('animation');
        }, 2500);

        setTimeout(function () {
            $('.content_loading').addClass('hide');
        }, 4000);

        setTimeout(function () {
            $('.internal_navigation, .header_navigation, .content_social_fixed, .content_logo').addClass('show');
            $('body').addClass('active finish_loading');
        }, 6000);

        setTimeout(function () {
            $('.content_presentation').addClass('show');
        }, 6000);

    }
};

var removePreviousHomeLiActive = function () {
    $('.internal_navigation li.item').removeClass('active');
};

var checkOnEnterSection = function (scrollTop) {

    /*Navigation position Add Class*/

    var firstTab = $('.item.first');
    var secondTab = $('.item.second');
    var thirdTab = $('.item.third');
    var fourthTab = $('.item.fourth');
    var fiveTab = $('.item.five');


//    if (!$('.wrap.home').hasClass('hide') && !document.querySelector('.wrap.home').classList.contains('home-section')) {
    if (!$('.wrap.home').hasClass('hide')) {
        switch (true) {
            case !firstTab.hasClass('active') && section01Top < scrollTop && section01End > scrollTop :
                scrollNav(firstTab, !scrolling);

                break;

            case !secondTab.hasClass('active') && section02Top < scrollTop && section02End > scrollTop :
                scrollNav(secondTab, !scrolling);

                break;

            case !thirdTab.hasClass('active') && section03Top < scrollTop && section03End > scrollTop :
                scrollNav(thirdTab, !scrolling);

                break;

            case !fourthTab.hasClass('active') && section04Top < scrollTop && section04End > scrollTop :
                scrollNav(fourthTab, !scrolling);

                break;

            case !fiveTab.hasClass('active') && section05Top < scrollTop && section05End > scrollTop :
                scrollNav(fiveTab, !scrolling);

                break;

            case $window.scrollTop() + $window.height() > $document.height() - 160:
                $('.btn_arrow_down').removeClass('show').addClass('hide');
                $('.btn_arrow_up').removeClass('hide').addClass('show');

                break;
            default:
                break;
        }

    }


    var $animation01 = $(".animation_01");
    var $animation02 = $(".animation_02");
    var $animation03 = $(".animation_03");
    var $animation04 = $(".animation_04");
    var $animation05 = $(".animation_05");
    var $animation06 = $(".animation_06");

    var contentTop;

    if (!$animation01.hasClass('show') && $animation01.length > 0) {
        contentTop = $animation01.offset().top - 200;
        if (scrollTop >= contentTop) {
            $animation01.addClass('show');
        }
    }

    if (!$animation02.hasClass('show') && $animation02.length > 0) {
        contentTop = $animation02.offset().top - 600;
        if (scrollTop >= contentTop) {
            $animation02.addClass('show');
        }
    }

    if (!$animation03.hasClass('show') && $animation03.length > 0) {
        contentTop = $animation03.offset().top - 600;
        if (scrollTop >= contentTop) {
            $animation03.addClass('show');
        }
    }

    if (!$animation04.hasClass('show') && $animation04.length > 0) {
        contentTop = $animation04.offset().top - 600;
        if (scrollTop >= contentTop) {
            $animation04.addClass('show');
        }
    }

    if (!$animation05.hasClass('show') && $animation05.length > 0) {
        contentTop = $animation05.offset().top - 600;
        if (scrollTop >= contentTop) {
            $animation05.addClass('show');
        }
    }

    if (!$animation06.hasClass('show') && $animation06.length > 0) {
        contentTop = $animation06.offset().top - 800;
        if (scrollTop >= contentTop) {
            $animation06.addClass('show');
        }
    }

};

var scrollNav = function (tab, doNavForward) {

    removePreviousHomeLiActive();

    tab.addClass('active');

    $('.btn_arrow_up').removeClass('show').addClass('hide');
    $('.btn_arrow_down').removeClass('hide').addClass('show');

    if (doNavForward) {
        navForward(tab.children('a')[0], true);
    }
};
