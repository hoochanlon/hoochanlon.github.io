function dark() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var n, e, i, h, t = .05,
        s = document.getElementById("universe"),
        o = !0,
        a = "180,184,240",
        r = "226,225,142",
        d = "226,225,224",
        c = [];

    function f() {
        n = window.innerWidth, e = window.innerHeight, i = .216 * n;
        s.setAttribute("width", n);
        s.setAttribute("height", e);
    }

    function u() {
        h.clearRect(0, 0, n, e);
        for (var t = c.length, i = 0; i < t; i++) {
            var s = c[i];
            s.move();
            s.fadeIn();
            s.fadeOut();
            s.draw();
        }
    }

    function y() {
        this.reset = function () {
            this.giant = m(3);
            this.comet = !this.giant && !o && m(10);

            // ⭐ 随机位置（从上方或左侧出现）
            this.x = l(0, n - 10);
            this.y = l(0, e);

            this.r = l(1.1, 2.6);

            // ⭐ 修正：往右下掉落（dx > 0, dy > 0）
            this.dx = l(t, 6 * t) + (this.comet ? t * l(50, 120) : 0);
            this.dy = l(t, 6 * t) + (this.comet ? t * l(50, 120) : 0);

            this.fadingOut = null;
            this.fadingIn = !0;
            this.opacity = 0;
            this.opacityTresh = l(.2, 1 - .4 * (this.comet ? 1 : 0));
            this.do = l(5e-4, .002) + .001 * (this.comet ? 1 : 0);
        };

        this.fadeIn = function () {
            if (this.fadingIn) {
                this.fadingIn = !(this.opacity > this.opacityTresh);
                this.opacity += this.do;
            }
        };

        this.fadeOut = function () {
            if (this.fadingOut) {
                this.fadingOut = !(this.opacity < 0);
                this.opacity -= this.do / 2;

                // ⭐ 流星飞出屏幕后重置
                (this.x > n || this.y > e) && (this.fadingOut = !1, this.reset());
            }
        };

        this.draw = function () {
            h.beginPath();

            if (this.giant) {
                h.fillStyle = "rgba(" + a + "," + this.opacity + ")";
                h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1);

            } else if (this.comet) {
                h.fillStyle = "rgba(" + d + "," + this.opacity + ")";
                h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1);

                // ⭐ 流星尾迹（右下方向）
                for (var t = 0; t < 30; t++) {
                    h.fillStyle = "rgba(" + d + "," + (this.opacity - this.opacity / 20 * t) + ")";
                    h.rect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t + 2, 2, 2);
                    h.fill();
                }
            } else {
                h.fillStyle = "rgba(" + r + "," + this.opacity + ")";
                h.rect(this.x, this.y, this.r, this.r);
            }

            h.closePath();
            h.fill();
        };

        this.move = function () {
            this.x += this.dx;
            this.y += this.dy;

            if (!this.fadingOut && (this.x > n - n / 4 || this.y > e)) {
                this.fadingOut = !0;
            }
        };

        setTimeout(function () {
            o = !1;
        }, 50);
    }

    function m(t) {
        return Math.floor(1e3 * Math.random()) + 1 < 10 * t;
    }

    function l(t, i) {
        return Math.random() * (i - t) + t;
    }

    f();
    window.addEventListener("resize", f, !1);

    (function () {
        h = s.getContext("2d");
        for (var t = 0; t < i; t++) {
            c[t] = new y;
            c[t].reset();
        }
        u();
    })();

    (function t() {
        // ⭐ 仅夜间模式渲染
        if (document.documentElement.getAttribute('data-theme') == 'dark') {
            u();
        }
        window.requestAnimationFrame(t);
    })();
}

dark();
