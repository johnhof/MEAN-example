
//
// Api
//
// wrapper for simplifying requests to the API
//
mean.service('Api', ['$http',  '$resource', function ($http, $resource) {

  // return a function which thinly wraps the $http object
  var api = function (settings) {
    return $http(settings);
  }

  // Notes
  api.notes = $resource('/notes', null,  {
    create  : { method : 'POST' },
    read    : { method : 'GET' },
  });

  // Note
  api.note = $resource('/notes/:id', null,  {
    create  : { method : 'POST' },
    read    : { method : 'GET' },
    destroy : { method : 'DELETE'},
    update  : {
      method : 'PUT',
      params : {
        id : '@id'
      }
    }
  });


  return api;
}])