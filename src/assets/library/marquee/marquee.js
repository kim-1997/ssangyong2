/*
 * marquee plugin 1.02v
 * This offers an alternative to the <marquee> tag, which doesn't align with HTML5 standards.
 * https://github.com/wdevbc/marquee
 *
 * copyright 2024 wdevbc
 *
 * Released under the MIT License
 *
 * Released on: May 31, 2024
 *
 */
((e, t) => {
    class SimpleMarquee {
        constructor(e, t = {}) {
            this.selector = e;
            this.options = Object.assign({}, SimpleMarquee.defaultOptions, t);
            this.parentElement = document.querySelector(e);
            this.contentClone = this.parentElement.innerHTML;
            this.currentPosition = 0;
            this.isPlaying = false;
            this.init();
        }
        init() {
            this.parentElement.style.whiteSpace = 'nowrap';
            this.parentElement.style.display = 'flex';
            this.parentElement.parentElement.style.overflow = 'hidden';
            this.parentElement.parentElement.style.width = '100%';
            this.parentElement.innerHTML += this.contentClone + this.contentClone + this.contentClone + this.contentClone;
            this.children = Array.from(this.parentElement.children);
            const totalWidth = this.parentElement.scrollWidth / 4;

            if (this.options.direction === 'right') {
                this.currentPosition = -totalWidth * 3;
            } else {
                this.currentPosition = 0;
            }

            if (this.options.autoplay) {
                this.isPlaying = true;
                this.startAnimation();
                this.handleMouseEvents();
            } else {
                this.handleMouseEvents();
            }
        }
        startAnimation() {
            const totalWidth = this.parentElement.scrollWidth / 4;
            const animate = () => {
                if (this.isPlaying) {
                    if (this.options.direction === 'right') {
                        this.currentPosition += this.options.speed;
                        if (this.currentPosition >= 0) {
                            this.currentPosition = -totalWidth * 3;
                        }
                    } else {
                        this.currentPosition -= this.options.speed;
                        if (this.currentPosition <= -totalWidth * 4) {
                            this.currentPosition = 0;
                        }
                    }
                    this.parentElement.style.transform = `translateX(${this.currentPosition}px)`;
                }
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
        handleMouseEvents() {
            if (this.options.pauseOnMouseEnter) {
                this.parentElement.addEventListener('mouseenter', () => {
                    this.isPlaying = false;
                });
                this.parentElement.addEventListener('mouseleave', () => {
                    this.isPlaying = true;
                });
            }
        }
    }
    (SimpleMarquee.defaultOptions = { speed: 1, autoplay: !0, pauseOnMouseEnter: !1, direction: 'left' }), (e.SimpleMarquee = SimpleMarquee);
})(window, document);
