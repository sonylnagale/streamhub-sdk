var phantom = require('phantom');

var child = require('child_process');

var serverProcess = child.spawn('./node_modules/http-server/bin/http-server',  ['.', '-p', '64646']);

var url = 'http://localhost:64646/tests/index.html';

console.log('phantom.create');
phantom.create(function(ph) {
    console.log('phantom created: '+ph);

    /**
    * Wait until the test condition is true or a timeout occurs. Useful for waiting
    * on a server response or for a ui change (fadeIn, etc.) to occur.
    *
    * @param testFx javascript condition that evaluates to a boolean,
    * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
    * as a callback function.
    * @param onReady what to do when testFx condition is fulfilled,
    * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
    * as a callback function.
    * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
    */
    function waitFor(testFx, onReady, timeOutMillis) {
        var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
            start = new Date().getTime(),
            condition = false,
            interval = setInterval(function() {
                if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                    // If not time-out yet and condition not yet fulfilled
                    condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
                } else {
                    if(!condition) {
                        // If condition still not fulfilled (timeout but condition is 'false')
                        console.log("'waitFor()' timeout");
                        exit(1);
                    } else {
                        // Condition fulfilled (timeout and/or condition is 'true')
                        typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                        clearInterval(interval); //< Stop this interval
                    }
                }
            }, 100); //< repeat check every 250ms
    };

    console.log('ph.createPage');
    ph.createPage(function(page) {
        console.log('ph created page: '+page);
        page.set('onConsoleMessage', function(msg) {
            console.log(msg);
        });

        setTimeout(function () {
            console.log('test run timeout');
            exit(1);
        }, 60 * 1000);

        console.log('page.open');
        page.open(url, function(status){
            console.log('page opened: '+status);
            if (status !== "success") {
                console.log("Unable to access network");
                exit(1);
            } else {
                function checkDone(cb) {
                    console.log('checking if done');
                    page.evaluate(function(){
                        var $ = window.$;
                        if ( ! $) {
                            return false;
                        }
                        var numTests = $('.symbolSummary > li').length,
                            numPending = $('.symbolSummary > li.pending').length;
                        if (numTests > 0 && numPending === 0) {
                            return true;
                        }
                    }, cb);
                }

                checkDone(function handleDoneState (err, isDone, b) {
                    console.log('is done? '+err+' '+isDone+' '+b);
                    console.log('handleDoneState args: '+Array.prototype.slice.call(arguments));
                    if ( ! isDone) {
                        return checkDone(handleDoneState);
                    } else {
                        console.log('checking number of fails');
                        page.evaluate(function(){
                            try {
                                return $('.symbolSummary > li.failed').length;
                            } catch (e) { }
                            return 10000;
                        }, function (failedNum) {
                            console.log('fails: '+failedNum);
                            exit((failedNum > 0) ? 1 : 0);
                        });
                    }
                })
            }
        });
    });

    function exit(code) {
        ph.exit();
        serverProcess.kill();
        process.exit(code);
    }
});
