mean.controller('NoteActionCtrl', ['$scope', 'Api', '$routeParams', '$location', function ($scope, Api, $routeParams, $location) {

  // keep stte of whether this is an edit, or new note action
  var isEdit = !!$routeParams.id;
  $scope.action = isEdit ? 'Edit' : 'New';

  // inputs and errors for display
  $scope.inputs = {};
  $scope.errors = {};

  // if this is an edit
  if (isEdit) {
    // reques the note
    $scope.loading = true;

    Api.note.read({
      id : $routeParams.id

    // on success
    }, function (result) {
      $scope.loading = false;

      // apply the resulting note to the inputs
      $scope.inputs  = {
        id      : result._id,
        title   : result.title,
        content : result.content
      }

    // on error
    }, function () {
      $scope.notFound = true; // display not found message
    });

    // add a delete request option
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

  // resource success callback, redirects to home
  function responseSuccess () {
    $location.path("/"); // redirect to home
  }

  // response error callback. Displays errors
  function responseError (response) {
    var err     = response.data || {};
    var details = err.details || [];

    $scope.errors.global = err.error;

    // pair up each error to its input
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