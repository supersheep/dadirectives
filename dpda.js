(function(){

  var dpda = angular.module('dpda', []);

  dpda.directive('dpdaFunnel', function(){
    return {
      restrict: 'A',
      scope:{
        data: "="
      },
      templateUrl:"funnel.html",
      link: function(scope, element, attr){
      }
    }
  });


  dpda.directive('dpdaUpdown', function(){
    return {
      restrict: 'A',
      scope:{
        data: "="
      },
      templateUrl:"updown.html",
      link: function(scope, element, attr){
        scope.data.entryPages.pvAll = scope.data.entryPages.map(function(item){
          return item.pv;
        }).reduce(function(a,b){
          return a + b;
        },0)

        scope.data.exitPages.forEach(function(exit){
          exit.allOutPv = exit.map(function(item){
            return item.out_pv;
          }).reduce(function(a,b){
            return a + b;
          },0);
        });
        console.log(scope.data);
      }
    }
  });

})();