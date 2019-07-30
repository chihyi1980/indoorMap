'use strict';

angular.module('atlas')
  .factory('cache', function($cacheFactory) {
    var cache = $cacheFactory('cahce');

    return {

      /**
       * This will handle caching individual resource records
       * @param  CacheId string where we expect this to be stored in the cache
       * @param  Resource resource The resource object that we want to get
       * @param  Object param An object of params to pass to resource.get
       * @param  Function callback
       * @return resource object
       */
      get: function(cacheId) {
        var result = cache.get(cacheId);

        // See if we had a valid record from cache

        if (result) {
          console.log("cache hit: " + cacheId);
          return result;
        } else {
          return null;
        }

      },
      put: function(cacheId, data) {
        //        var hanckedData = {};
        //        hanckedData.data = data;
        cache.put(cacheId, data);
      }
    }
  });