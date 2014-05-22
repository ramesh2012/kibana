define(function (require) {
  return function SearchLooperService(Private, Promise) {
    var errors = require('errors');
    var fetch = Private(require('../fetch/fetch'));
    var Looper = Private(require('./_looper'));

    // track the currently executing search resquest
    var _activeAutoSearch = null;

    /**
     * The Looper which will manage the doc fetch interval
     * @type {Looper}
     */
    var searchLooper = new Looper(null, function () {
      // fatal if refreshes take longer then the refresh interval
      if (_activeAutoSearch) Promise.rejected(new errors.HastyRefresh());
      return _activeAutoSearch = fetch.searches().finally(function (res) {
        _activeAutoSearch = null;
      });
    }).start();

    return searchLooper;
  };
});