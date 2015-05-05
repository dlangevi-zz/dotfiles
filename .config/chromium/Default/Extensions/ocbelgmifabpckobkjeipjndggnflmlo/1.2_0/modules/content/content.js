var CONTROLL = {

    toggleLoopStatus: function () {
        PAGE_ENVIRONMENT.run(function () {
            var currentSound = require("lib/play-manager").getCurrentSound();
            var currentStatus = currentSound.audio._cancelLooping;
            currentSound.audio._cancelLooping = !currentStatus;
        });
    },

    getLoopStatus: function (callback) {
        PAGE_ENVIRONMENT.run(function (resultCallback) {
            var currentSound = require("lib/play-manager").getCurrentSound();
            if (currentSound) {
                var result = currentSound.audio._cancelLooping;
                resultCallback(!result);
            } else {
                resultCallback(false);
            }
        }, function (result) {
            callback(result);
        });
    }
};


$(document).ready(function () {

    var imgUrl = chrome.extension.getURL('modules/content/repeat_small.png');

    var button = $('<button class="skipControl sc-ir disabled loop-button" tabindex="-1" style="background: url(' + imgUrl + ') no-repeat left center;">repeat</button>');
    $(".playControls__playPauseSkip").prepend(button);

    button.click(function () {
        CONTROLL.toggleLoopStatus();
        updateButton();
    });

    var updateButton = function () {
        CONTROLL.getLoopStatus(function (looping) {
            if (looping) {
                button.removeClass("disabled");
            } else {
                button.addClass("disabled");
            }
        });
    };

    setInterval(updateButton, 500);

});

