var ScrollSpeedMonitor = (function() {
    var self = this;

    function ScrollSpeedMonitor (callbackMethod) {
        callback = callbackMethod;

        $("#appContainer").scroll(function(e) {
            var scrollTop = $(this).scrollTop();
            didScroll(new Date().getTime(), scrollTop);
        });
    }

    var callback;
    var direction = 'unknown';
    var lastDate = -1;
    var lastScrollTop = -1;

    this.thisMinimumTrackingDelayInMs = 25;

    function didScroll (timeStamp, scrollTop) {
        if (lastDate + self.thisMinimumTrackingDelayInMs <= timeStamp) {
            var offset = Math.abs(scrollTop - lastScrollTop);
            var direction = getDirection(scrollTop);
            var delayInMs = timeStamp - lastDate;
            var speedInPxPerMs = offset / delayInMs;

            if (speedInPxPerMs > 0) {

                callback(speedInPxPerMs, timeStamp, direction);
            }

            lastDate = timeStamp;
        }
    };

    function getDirection (scrollTop) {
        var currentScrollTop = lastScrollTop;
        lastScrollTop = scrollTop;

        if (currentScrollTop > -1) {
            if (currentScrollTop >= scrollTop) {
                return 'down';
            }

            return 'up';
        }

        return 'unknown';
    }

    function reset () {
        direction = 'unknown';
        lastDate = -1;
        lastScrollTop = -1;
    }

    return ScrollSpeedMonitor;
}());

window.onload = function() {
  var applyStylingToHomeFeed = function () {
    $("#homeFeedMediaList li").each(function() {
      if ($(this).offset().top > 100 && $(this).offset().top < 400) {
        $(this).prev().prev().css({"opacity":"0.35","transform": "scale(1)"});
        $(this).prev().css({"opacity":"0.6","transform": "scale(1)"});
        $(this).css({"opacity":"1","transform": "scale(1.04,1.02)"});
        $(this).next().css({"opacity":"0.6","transform": "scale(1)"});
        $(this).next().next().css({"opacity":"0.35","transform": "scale(1)"});
    }
});
};
$(function() {
    $('[data-toggle="tooltip"]').tooltip();
    applyStylingToHomeFeed();
    var checkScrollSpeedFun =  setInterval(function() {
    var scrollSpeedMonitor = new ScrollSpeedMonitor(function (speedInPxPerMs, timeStamp, newDirection) {
    //        console.log('Scroll speed: ' + speedInPxPerMs);
    if (speedInPxPerMs > 3) {
        $("#homeFeedMediaList li").css("opacity","0.2");
    } else {
        applyStylingToHomeFeed();
    }
});
      $("#homeFeedMediaList li").mouseenter(function() {
        $(this).prev().prev().css({"opacity":"0.35","transform": "scale(1)"});
        $(this).prev().css({"opacity":"0.6","transform": "scale(1)"});
        $(this).css({"opacity":"1","transform": "scale(1.04,1.02)"});
        $(this).next().css({"opacity":"0.6","transform": "scale(1)"});
        $(this).next().next().css({"opacity":"0.35","transform": "scale(1)"});
    });
  }, 1000);
    //    setTimeout(function() {
    //      clearInterval(checkScrollSpeedFun);
    //  },100000000);
});
};
