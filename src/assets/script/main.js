$(document).ready(function () {
    AOS.init();
    const lenis = new Lenis({
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const main = {
        scrollTriggerInit() {
            gsap.registerPlugin(ScrollTrigger);
            const tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: '.main-kv',
                    start: 'center center',
                    end: 'bottom+=230% center',
                    scrub: 2,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: () => AOS.refresh(),
                },
            });
        },

        init() {
            this.scrollTriggerInit();
            AOS.init({
                once: true,
                duration: 1000,
            });
        },
    };
    main.init();

    const img = document.querySelector('.main-kv__image img');
    const viewportWidth = window.innerWidth;
    window.addEventListener('scroll', () => {
        const title = document.querySelector('.main-kv__title');
        const description = document.querySelector('.main-kv__description');
        const scrollbar = document.querySelector('.main-kv__scroll');
        const nav = document.querySelector('.nav');
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = Math.min(scrollTop / (docHeight - winHeight), 1);

        const speedFactor = 5;
        let startX1, startY1, startX2, startY2, endX1, endY1, endX2, endY2;

        if (viewportWidth <= 375) {
            startX1 = 5;
            startY1 = 42;
            startX2 = 95;
            startY2 = 66;
            endX1 = 0;
            endY1 = 0;
            endX2 = 100;
            endY2 = 100;
        } else {
            startX1 = 18;
            startY1 = 41;
            startX2 = 85;
            startY2 = 70;
            endX1 = 0;
            endY1 = 0;
            endX2 = 100;
            endY2 = 100;
        }

        const adjustedScrollPercent = Math.min(scrollPercent * speedFactor, 1);
        const x1 = startX1 + (endX1 - startX1) * adjustedScrollPercent;
        const y1 = startY1 + (endY1 - startY1) * adjustedScrollPercent;
        const x2 = startX2 + (endX2 - startX2) * adjustedScrollPercent;
        const y2 = startY2 + (endY2 - startY2) * adjustedScrollPercent;

        img.style.clipPath = `polygon(${x1}% ${y1}%, ${x2}% ${y1}%, ${x2}% ${y2}%, ${x1}% ${y2}%)`;

        if (scrollPercent >= 0.1) {
            title.classList.add('active');
        } else {
            title.classList.remove('active');
        }

        if (scrollPercent >= 0.15) {
            nav.classList.add('active');
            description.classList.add('active');
            scrollbar.classList.add('active');
        } else {
            nav.classList.remove('active');
            description.classList.remove('active');
            scrollbar.classList.remove('active');
            $('.nav').css('padding-bottom', '10px');
            $('.nav__hidemenu').slideUp();
            $('.nav__menu').removeClass('active');
        }
    });

    function marquee() {
        const marquee = new SimpleMarquee('.brand__list', {
            autoplay: true,
            speed: 2,
            pauseOnMouseEnter: true,
            duplicated: true,
            direction: 'right',
        });
    }
    marquee();

    let swiper = new Swiper('.sale__slide--type01', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        speed: 800,
        loop: false,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
            formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
            },
            formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
            },
            renderFraction: function (currentClass, totalClass) {
                return '<span class="' + currentClass + '"></span>' + ' <span style="vertical-align: super; margin:0 -3px">/</span> ' + '<span class="' + totalClass + '"></span>';
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChange: function () {
                const viewportWidth = window.innerWidth;
                const activeIndex = swiper.activeIndex;
                $('.sale__box--type01 .sale__content').removeClass('active');
                $('.sale__box--type01 .sale__status').removeClass('active');
                $('.sale__box--type01 .sale__slidewrap .sale__status').eq(activeIndex).addClass('active');
                if (viewportWidth > 375) {
                    $('.sale__box--type01 .sale__content').eq(activeIndex).addClass('active');
                }
            },
        },
    });
    let swiper2 = new Swiper('.sale__slide--type02', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        speed: 800,
        loop: false,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination2',
            type: 'fraction',
            formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
            },
            formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
            },
            renderFraction: function (currentClass, totalClass) {
                return '<span class="' + currentClass + '"></span>' + ' <span style="vertical-align: super; margin:0 -3px">/</span> ' + '<span class="' + totalClass + '"></span>';
            },
        },
        navigation: {
            nextEl: '.swiper-button-next2',
            prevEl: '.swiper-button-prev2',
        },
        on: {
            slideChange: function () {
                const viewportWidth = window.innerWidth;
                const activeIndex = swiper2.activeIndex;
                $('.sale__box--type02 .sale__content').removeClass('active');
                $('.sale__box--type02 .sale__status').removeClass('active');
                $('.sale__box--type02 .sale__slidewrap .sale__status').eq(activeIndex).addClass('active');
                if (viewportWidth > 375) {
                    $('.sale__box--type02 .sale__content').eq(activeIndex).addClass('active');
                }
            },
        },
    });

    let currentIndex = null;
    const isSmallScreen = viewportWidth <= 375;

    if (!isSmallScreen) {
        $('.custom__menu > li').on('mouseenter', function () {
            currentIndex = $(this).index();
            $('.custom').attr('class', `custom custom--0${currentIndex + 1}`);
            $('.custom__menu > li').removeClass('active');
            $(this).addClass('active');
        });

        $('.custom__menu').on('mouseleave', function () {
            if (currentIndex !== null) {
                $('.custom').attr('class', `custom custom--0${currentIndex + 1}`);
                $('.custom__menu > li').eq(currentIndex).addClass('active');
            }
        });

        $('.custom__menu').on('mouseenter', function () {
            if (currentIndex !== null) {
                $('.custom').attr('class', `custom custom--0${currentIndex + 1}`);
                $('.custom__menu > li').eq(currentIndex).addClass('active');
            }
        });
    } else {
        $('.custom__menu > li').off('mouseenter');
        $('.custom__menu').off('mouseleave');
        $('.custom__menu').off('mouseenter');
    }

    $('.custom__menu--mo .custom__submenu').hide();
    $('.custom__menu--mo > li:first-child .custom__submenu').show();

    $('.custom__menu--mo > li').on('click', function () {
        let submenu = $(this).find('.custom__submenu');
        let idx = $(this).index();

        if (submenu.is(':visible')) {
            return;
        }

        submenu.slideDown();
        openSubmenu = $(this);

        $('.custom__menu--mo > li')
            .not($(this))
            .each(function () {
                $(this).find('.custom__submenu').slideUp();
            });

        $('.custom').attr('class', `custom custom--0${idx + 1}`);
    });

    $('.news__list li').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.news__list li').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    const menuTrigger = $('.nav__menu');
    $('.nav__hidemenu').hide();
    menuTrigger.on('click', function () {
        $(this).toggleClass('active');
        $('.nav').css('padding-bottom', $('.nav__hidemenu').is(':visible') ? '10px' : '0px');
        $('.nav__hidemenu').slideToggle(800);
    });

    $('.nav__submenu').hide();
    $('.nav__menuname').on('click', function (e) {
        var dot = $(this).find('.dot');
        var submenu = $(this).siblings('.nav__submenu');

        var otherMenus = $('.nav__menuname').not($(this));
        var otherDots = otherMenus.find('.dot');
        var otherSubmenus = otherMenus.siblings('.nav__submenu');

        otherSubmenus.slideUp(300);
        otherDots.removeClass('active');

        if (submenu.is(':visible')) {
            submenu.slideUp(300);
            dot.removeClass('active');
        } else {
            submenu.slideDown(300);
            dot.addClass('active');
        }
    });

    $(window).on('scroll', function () {
        let brand = $('.main-section--brand').offset().top;
        let clientHeight = window.innerHeight;
        let brandOffset = brand - clientHeight;
        let st = $(window).scrollTop();

        if (st > brandOffset) {
            $('.floating__circle').addClass('active');
            $('.floating__icon').addClass('active');
        } else {
            $('.floating__circle').removeClass('active');
            $('.floating__icon').removeClass('active');
        }
    });

    $('.sale__infowrap .sale__info').hide();
    $('.sale__infowrap').on('click', function () {
        const info = $(this).find('.sale__info');
        const icon = $(this).find('img');

        if (info.is(':visible')) {
            icon.attr('src', '../resources/assets/images/icons/plus.svg');
            info.slideUp();
        } else {
            icon.attr('src', '../resources/assets/images/icons/minus.svg');
            info.slideDown();
        }
    });

    let swiper3 = new Swiper('.news__content--mo', {
        slidesPerView: 'auto',
        spaceBetween: 35,
        speed: 800,
        loop: false,
        grabCursor: true,
        pagination: {
            el: '.news__page',
            type: 'progressbar',
        },
    });
});
