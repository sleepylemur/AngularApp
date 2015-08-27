'use strict';

// Sale price filter
angular.module('articles').filter('filterRange', function() {
   return function(input,min,max) {
     if (input.$resolved) {
       if (typeof min === "undefined") min = 0;
       if (typeof max === "undefined") max = Infinity;
       return input.filter(function(e) {
         return e.sales_terms.sales >= Number(min) && e.sales_terms.sales <= Number(max);
       });
     } else {
       return input;
     }
   }
});

// bed filter
angular.module('articles').filter("filterBed", function() {
return function (input,min,max) {
  if (input.$resolved || typeof input.$resolved === 'undefined') {
    if (typeof min === "undefined") min = 0;
    return input.filter(function(e) {
     if (max) {
       return e.details.num_bedrooms >= Number(min);
     } else {
      return e.details.num_bedrooms == Number(min);
     }
     });
  } else {
    return input;
  }
 }
});

// bath filter
angular.module('articles').filter("filterBath", function() {
  return function (input,min,max) {
    if (input.$resolved || typeof input.$resolved === 'undefined') {
      if (typeof min === "undefined") min = 0;
      return input.filter(function(e) {
        if (max) {
          return e.details.num_baths >= Number(min);
        }
        // return any articles with num_baths undefined or >= min
        return e.details.num_baths == Number(min) || typeof e.details.num_baths === 'undefined';
      });
    } else {
     return input;
    }
  }
});


// pagination start from
angular.module('articles').filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

// Chosen multi select

angular.module('articles').filter("myfilt", function() {
  return function (input,search) {
    var out = [], temp=[];
    if (search && search.neighborhood) {
      angular.forEach(input,function (e) {
        if (search.neighborhood.indexOf(e.neighborhood)>=0 ) {
          temp.push(e);
        }
      })
    } else {
      temp = input;
    }
    out = temp ;
    if (search && search.ownership) {
      out = [];
      angular.forEach(temp,function (e) {
        if (search.ownership.indexOf(e.ownership)>=0 ) {
          out.push(e);
        }
      });
    }
  return out;
  };
})

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','NeighborhoodService',
  function($scope, $stateParams, $location, Authentication, Articles, NeighborhoodService) {

    $scope.authentication = Authentication;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];

    // take an array of neighborhood names and update our map to display the relevant shapes
    $scope.updateMapShapes = function() {
      NeighborhoodService.get().then(function(neighborhoods) {
        // create any of the input neighborhoods that aren't currently on our map
        $scope.search.neighborhood.forEach(function(hood) {
          if (!$scope.map.shapes[hood]) {
            // create the new shape and store it in our map object
            var newshape = new google.maps.Polyline({
              path: neighborhoods[hood],
              strokeColor: '#66A3E0',
              fillColor: '#FF0000',
              strokeOpacity: 0.8,
              fillOpacity: 0.35,
              strokeWeight: 2
            });
            $scope.map.shapes[hood] = newshape;
            // actually add our stored shape to the map
            $scope.map.shapes[hood].setMap($scope.map.data.map);
          }
        });

        // remove any shapes that are no longer active
        Object.keys($scope.map.shapes).forEach(function(hood) {
          if ($scope.search.neighborhood.indexOf(hood) === -1) {
            // this hood is no longer active so set its map to null and delete it from our shapes object
            $scope.map.shapes[hood].setMap(null);
            delete $scope.map.shapes[hood];
          }
        });
      });
    };

    $scope.moveMapMarker = function(article) {
      var latlng = new google.maps.LatLng(article.latitude, article.longitude);
      $scope.map.panTo(latlng);
      if ($scope.mapMarker) {
        $scope.mapMarker.setPosition(latlng);
      } else {
        $scope.mapMarker = new google.maps.Marker({
          position: latlng,
          map: $scope.map
        });
      }
      // console.log(article.latitude,article.longitude,$scope.map);
    };

    // Set of Photos
    // $http.get(article).success(function(data){
      // $scope.photos = data;
    // })
    // $scope.photos = [
    //     {src: 'http://nyapartmentblog.com/wp-content/uploads/2011/07/Continental-Living.jpg', desc: 'Image 01'},
    //     {src: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', desc: 'Image 02'},
    //     {src: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', desc: 'Image 03'},
    //     {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
    //     {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
    //     {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'}
    // ];

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    $scope.create = function() {
      var article = new Articles({
        title: this.title,
        content: this.content
      });
      article.$save(function(response) {
        $location.path('articles/' + response._id);

        $scope.title = '';
        $scope.content = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // pagination
    $scope.numberOfPages=function(){
        return Math.ceil($scope.data.length/$scope.pageSize);
    }
    for (var i=0; i<45; i++) {
        $scope.data.push("Item "+i);
    }

    $scope.remove = function(article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function() {
          $location.path('articles');
        });
      }
    };

    $scope.update = function() {
      var article = $scope.article;

      article.$update(function() {
        $location.path('articles/' + article._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.articles = Articles.query();
    };

    $scope.findOne = function() {
      Articles.get({
        articleId: $stateParams.articleId
      }, function(data) {
        $scope.article = data;
        // convert photos url hash to easily loopable array
        $scope.photos = Object.keys(data.apartment_features.photos).map(function(key) {
          return data.apartment_features.photos[key];
        });
      });
    };

    $scope.getView = function() {
        var article = $scope.article;
        return "/views/Neighborhoods" + article.name + ".html";
    }
  }
  ]);

angular.module('articles').filter('noFractionCurrency',
  [ '$filter', '$locale',
  function(filter, locale) {
    var currencyFilter = filter('currency');
    var formats = locale.NUMBER_FORMATS;
    return function(amount, currencySymbol) {
      var value = currencyFilter(amount, currencySymbol);
      var sep = value.indexOf(formats.DECIMAL_SEP);
      if(amount >= 0) {
        return value.substring(0, sep);
      }
      return value.substring(0, sep) + ')';
    };
  } ]);

// Modals
angular.module('articles').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('articles').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, $http) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.sendMail = function(){

    var data = ({
      input : this.contactAgentInput
    })

    $http.post('/contact-agent', data).
    then(function(response) {
    // this callback will be called asynchronously
    $modalInstance.close($scope.selected.item);

    console.log("all is well")
    // when the response is available
  }, function(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  })
  }


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


// Accordian javascript
angular.module('articles').controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = false;

  $scope.groups = [
  {
    title: 'Dynamic Group Header - 1',
    content: 'Dynamic Group Body - 1'
  },
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
});
