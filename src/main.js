define(['streamhub-sdk/jquery', 'text!streamhub-sdk/version.txt'],
function($, version) {
    return {
        version: $.trim(version);
    };
});
