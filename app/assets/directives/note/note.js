
// Note
//
// directive for displaying noted
//
// scope should contain:
// {
//   _id     : Number,
//   title   : String,
//   content : String,
//   created : Date
// }
mean.directive('note', ['Api', function (Api) {
  return {
    restrict    : 'E', // only exectue the directive on elements `<note></note>`
    templateUrl : '../views/note.html', // use the note template
    scope       : true, // share the container's scope
    replace     : true, // replace the directive html with the compiled template
    link        : function(scope, element, attrs, ctrl) {
      // send delete this note from the server
      // if successful, remove it from the DOM
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
