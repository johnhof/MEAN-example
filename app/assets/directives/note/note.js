mean.directive('note', ['Api', function (Api) {
  return {
    restrcit    : 'E', // mmatch attributes only
    templateUrl : '../views/note.html', // use the note partial
    scope       : true, // transfer the scope of the containing controller
    replace     : true, //replace the html with the template
    link        : function(scope, element, attrs, ctrl) {
      scope.delete = function () {
        Api.note.destroy({
          id : attrs.id
        }, function (result) {
          if (result.success) {
            element.remove();
          }
        });
      }
    }
  };
}]);
