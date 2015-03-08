mean.controller('NoteActionCtrl', ['$scope', 'Api', '$routeParams', '$location', function ($scope, Api, $routeParams, $location) {
  var isEdit = !!$routeParams.id;

  $scope.action = isEdit ? 'Edit' : 'New';
  $scope.inputs = {};
  $scope.errors = {};

  if (isEdit) {
    $scope.loading = true;

    // define note request
    Api.note.read({
      id : $routeParams.id
    }, function (result) {
      $scope.loading = false
      $scope.inputs  = {
        id      : result._id,
        title   : result.title,
        content : result.content
      }
    }, function () {
      $scope.notFound = true;
    });

    $scope.delete = function () {
      clearErrors();
      Api.note.destroy({
        id : $routeParams.id
      }, responseSuccess, responseError);
    }
  }

  $scope.submit = function submit () {
    clearErrors();

    // if there is an id, assume its an edit
    if (isEdit) {
      Api.note.update($scope.inputs, responseSuccess, responseError);

    // otherwise it must be a create
    } else {
      Api.notes.create({
        title   : $scope.inputs.title,
        content : $scope.inputs.content
      }, responseSuccess, responseError);
    }
  }

  // resource success callback
  function responseSuccess () {
    $location.path("/");
  }

  // response success callback
  function responseError (response) {
    var err     = response.data || {};
    var details = err.details || [];

    $scope.errors.global = err.error;

    details.forEach(function (error) {
      if (error.path && error.message) {
        $scope.errors[error.path] = error.message;
      }
    });
  }

  // helper to clear errors
  function clearErrors () {
    var errorKeys = Object.keys($scope.errors);
    for (var i = 0; i < errorKeys.length; i++) {
      if (errorKeys[i]) {
        delete $scope.errors[errorKeys[i]]
      }
    }
  }
}]);