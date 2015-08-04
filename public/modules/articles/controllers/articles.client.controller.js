'use strict';

angular.module('articles').filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

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

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];

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
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
        console.log($stateParams)
			});
		};

    $scope.getView = function() {
        var article = $scope.article;
        return "/views/Neighborhoods" + article.name + ".html";
    }
	}
  ]);

// Chosen



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

