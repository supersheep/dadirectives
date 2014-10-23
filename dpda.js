
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

  dpda.directive('dpdaFilter', function(){
    return {
      restrict: 'A',
      scope: {
        data: "=",
        currentFilters: "=current",
        itemSelected: "&"
      },
      templateUrl: "templates/filter.html",
      link: function(scope, element, attr){

        var currentChoosen = {};
        var currentOpen = {};

        function shouldOpen(item, rowName, type){
          var result = false;
          if(item.children){
            result = item.open;
          }else{
            if(scope.currentFilters.indexOf(item.key) > -1){
              result = true;
            }
          } 

          if(result == true){
            if(type == "item"){
              currentOpen[rowName] = item; 
            }

            if(!item.children){
              currentChoosen[rowName] = item.key;
            }

          }

          return result;
        }

        function updateSelected(){
          var currentFilters = Object.keys(currentChoosen).map(function(k){
            return currentChoosen[k];
          });
          scope.itemSelected({$filters:currentFilters});
        }

        scope.getChildrenClass = function(item, rowName){
          var classes = ["children"];
          if(shouldOpen(item, rowName) && item.children && item.children.length){
            classes.push("active");
          }


          // 初始化过之后不走该逻辑
          if(!item.initialized){
            if(item.children && item.children.some(function(child){
              return shouldOpen(child,rowName);
            })){
              item.open = true;
              item.initialized = true;
              currentOpen[rowName] = item;
            }
          }

          return classes;
        };

        scope.getItemClass = function(item, rowName){
          var classes = ["name"];
          if(shouldOpen(item, rowName, 'item')){
            classes.push("active");
          }
          return classes;
        }

        scope.getChildItemClass = function(item, rowName){
          var classes = ["child-item"];
          if(shouldOpen(item, rowName, 'child')){
            classes.push("active");
          }
          return classes;
        }

        scope.clickItem = function(item, rowName){
          var current = currentOpen[rowName];
          if(current){
            if(current.children){
              current.open = false;
            }else{
              var indexOfKey = scope.currentFilters.indexOf(current.key);
              if(indexOfKey > -1){
                scope.currentFilters.splice(indexOfKey,1);
              }
            }
          };
          currentOpen[rowName] = item;
          if(item.children){
            item.open = true;
          }else{
            currentChoosen[rowName] = item.key;
            scope.currentFilters.push(item.key);
            updateSelected();
          }
        }

        scope.clickChild = function(item, rowName){
          var currentKey = currentChoosen[rowName];
          if(currentKey){
            scope.currentFilters.splice( scope.currentFilters.indexOf(currentKey),1 );
          }

          currentChoosen[rowName] = item.key;
          scope.currentFilters.push(item.key);
          updateSelected();
        }
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