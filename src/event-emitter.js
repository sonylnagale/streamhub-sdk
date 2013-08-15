define(['event-emitter', 'streamhub-sdk/debug'], function(EventEmitter, debug) {
    var log = debug('streamhub-sdk/event-emitter');
    log("'streamhub-sdk/event-emitter' is deprecated. Please switch to " +
        "'event-emitter'. You can find an implementation here: " +
        "https://github.com/Livefyre/event-emitter")
    return EventEmitter;
});
