
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
        max:"@",
        currentFilters: "=current",
        itemSelected: "&"
      },
      template: '<div class="header-filter">'
      +'<div class="row" ng-repeat="row in data">'
      +'  <div class="label">{{row.name}}：</div>'
      +'  <div class="items-container">'
      +'    <div class="items" ng-show="$index < max || row.showMore" ng-repeat="item in row.children">'
      +'      <div ng-class="getItemClass(item,row)" ng-click="clickItem(item,row)" data-key="{{item.key}}"><span>{{item.name}}</span></div>'
      +'    </div>'
      +'    <div class="more" ng-show="row.children.length > max" ng-click="row.showMore=!row.showMore"><span>{{row.showMore?"收起":"更多"}}</span></div>'
      +'    <div class="children-container">'
      +'      <div ng-class="getChildrenClass(item, row)" ng-repeat="item in row.children">'
      +'        <div ng-repeat="child in item.children" class="child-wrapper">'
      +'          <div ng-switch="!!(child.children && child.children.length)">'
      +'            <div ng-switch-when="true" class="third-item-container">'
      +'              <div class="title">{{child.name}}：</div>'
      +'              <div ng-class="getThirdItem(thirdItem, row)" ng-repeat="thirdItem in child.children" ng-click="clickChild(thirdItem, row)"><span>{{thirdItem.name}}</span></div>'
      +'            </div>'
      +'            <div ng-class="getChildItemClass(child, row)" ng-switch-when="false" ng-click="clickChild(child, row)"><span>{{child.name}}</span></div>'
      +'          </div>'
      +'        </div>'
      +'      </div>'
      +'    </div>'
      +'  </div>'
      +'</div>'
      +'</div>',
      link: function(scope, element, attr){
        var currentChoosen = {};
        var currentOpen = {};

        function shouldOpen(item, row, type){
          var result = false;
          if(item.children){
            result = item.children.some(function(c){
              if(row.initialized){
                return item.open;
              }else{
                return item.open || shouldOpen(c, row);
              }
            }, 'item');
          }else{
            if(scope.currentFilters[row.name] == item.key){
              result = true;
            }
          } 

          if(result == true){
            if(type == "item"){
              currentOpen[row.name] = item; 
            }

            if(!item.children){
              currentChoosen[row.name] = item.key;
            }

          }

          return result;
        }




        function updateSelected(){
          scope.itemSelected({$filters:currentChoosen});
        }

        scope.getThirdItem = function(item,row){
          var classes = ["third-item"];
          if(shouldOpen(item, row)){
            classes.push("active");
          }
          return classes;
        }

        scope.getChildrenClass = function(item, row){
          var classes = ["children"];
          if(shouldOpen(item, row) && item.children && item.children.length){
            classes.push("active");
          }

          // 初始化过之后不走该逻辑
          if(!row.initialized){
            if(item.children && item.children.some(function(child){
              return shouldOpen(child,row);
            })){
              item.open = true;
              row.initialized = true;
              currentOpen[row] = item;
            }
          }

          return classes;
        };

        scope.getItemClass = function(item, row){
          var classes = ["name"];
          if(shouldOpen(item, row, 'item')){
            classes.push("active");
          }

          if(item.children && item.children.length){
            classes.push("haschild");
          }

          return classes;
        }

        scope.getChildItemClass = function(item, row){
          var classes = ["child-item"];
          if(shouldOpen(item, row, 'child')){
            classes.push("active");
          }
          
          if(item.children && item.children.length){
            classes.push("has-third-item");
          }

          return classes;
        }

        scope.clickItem = function(item, row){
          var current = currentOpen[row.name];
          if(current){
            if(current.children){
              current.open = false;
            }
          };
          currentOpen[row.name] = item;
          if(item.children){
            item.open = true;
          }else{
            scope.currentFilters[row.name] = item.key;
            updateSelected();
          }
        }

        scope.clickChild = function(item, row){
          currentChoosen[row.name] = item.key;
          scope.currentFilters[row.name] = item.key;
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
      }
    }
  });

})();