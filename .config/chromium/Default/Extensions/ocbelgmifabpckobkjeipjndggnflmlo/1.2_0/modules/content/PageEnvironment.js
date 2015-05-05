var PAGE_ENVIRONMENT = {

    internalCounter: 0,

    run: function (script, callback) {

        var internalEventNameForCallback = "eventName" + PAGE_ENVIRONMENT.internalCounter++;

        document.addEventListener(internalEventNameForCallback, function (event) {
            callback(JSON.parse(event.detail));
        });

        var resultCallback = function (result) {
            var event = new CustomEvent(internalEventNameForCallback, {"detail": JSON.stringify(result)});
            document.dispatchEvent(event);
        };

        var scriptContent = '(' +
            'function() {' +
            'var internalEventNameForCallback = "' + internalEventNameForCallback + '";' +
            '(' + script + ')(' + resultCallback + ');' +
            '})()';

        var elem = document.createElement("script");
        elem.type = "text/javascript";
        elem.innerHTML = scriptContent;
        document.head.appendChild(elem);

        setTimeout(function () {
            document.head.removeChild(elem);
        }, 1000);
    }



};