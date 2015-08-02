'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

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
			});
		};
	}
  ]);


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

angular.module('articles').controller('contactAgentCtrl', ['$scope', '$http',
  function($scope, $http){
    $scope.toastPosition = {
      bottom: false,
      top: true,
      left:false,
      right:true
    };
    $scope.getToastPosition = function(){
      return Object.keys($scope.toastPosition)
      .filter(function(pos){
        return $scope.toastPosition(pos);
      })
    }
    this.sendMail = function(){

      data = ({
        input : this.contactAgentInput
      })

      $http.post('/contact-agent', data.
        then(function(response) {
    // this callback will be called asynchronously
    $mdtoast.show(
      $mdtoast.simple()
      .content("Thanks for sending this over. your message is" + data.contactAgentForm)
      .position($scope.getToastPosition())
      .hideDelay(5000)
      )

    console.log("all is well")
    // when the response is available
  }, function(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  })
        )


    }
  }
  ]);
