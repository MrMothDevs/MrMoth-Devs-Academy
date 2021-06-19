// Funksionin ne te cilin kur klikon ikonen > shfaqet butoni dark mode

(window.console = 
    window.console ||
    (function () {
        var s = {};
        return (s.log = s.warn = s.debug = s.info = s.error = s.time = s.dir = s.profile = s.clear = s.exception = s.trace = s.assert = function () {}), s;
    }) ()),
    $(document).ready(function (s) {
        s("#color-switcher .bottom a.color-link").click(function (t) {
            t.preventDefault(), "-189px" === s("#color-switcher").css("left") ? s("#color-switcher").animate({ left: "0px" }) : s("#color-switcher").animate({ left: "-189px" });
        }),
        s("#color-switcher").animate({ left: "-189px" });
    });