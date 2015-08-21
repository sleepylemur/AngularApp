'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('NeighborhoodService', ['$http','$q',
	function($http,$q) {
    var promiseResult;

		return {
      get: function() {
        if (!promiseResult) {

          promiseResult = $q.defer();

          $http.get('/modules/articles/data/neighborhoods.json')
            .success(function(data) {
							console.log('successful fetch',data);
              promiseResult.resolve(data);
            }).error(function(err) {
							console.log('failed fetch',err);
              promiseResult.reject(err);
            });
        }
        return promiseResult.promise;
      }
    }
	}
]);
