
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
      +'      <div ng-class="getItemClass(item,row.name)" ng-click="clickItem(item,row.name)" data-key="{{item.key}}">{{item.name}}</div>'
      +'    </div>'
      +'    <div class="more" ng-show="row.children.length > max && !row.showMore" ng-click="row.showMore=true">更多</div>'
      +'    <div class="children-container">'
      +'      <div ng-class="getChildrenClass(item, row.name)" ng-repeat="item in row.children">'
      +'        <div ng-repeat="child in item.children">'
      +'          <div ng-switch="!!(child.children && child.children.length)">'
      +'            <div ng-switch-when="true" class="third-item-container">'
      +'              <div class="title">{{child.name}}：</div>'
      +'              <div ng-class="getThirdItem(thirdItem, row.name)" ng-repeat="thirdItem in child.children" ng-click="clickChild(thirdItem, row.name)">{{thirdItem.name}}</div>'
      +'            </div>'
      +'            <div ng-class="getChildItemClass(child, row.name)" ng-switch-when="false" ng-click="clickChild(child, row.name)">'
      +'              {{child.name}}'
      +'            </div>'
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

        function shouldOpen(item, rowName, type){
          var result = false;
            

          if(item.children){
            result = item.children.some(function(c){
              if(item.initialized){
                return item.open
              }else{
                return item.open || shouldOpen(c, rowName);
              }
            }, 'item');
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

          if(item.name == "SEO"){
            console.log(item,rowName);
            console.log("result", result);
          }

          return result;
        }

        function updateSelected(){
          scope.itemSelected({$filters:currentChoosen});
        }

        scope.getThirdItem = function(item,rowName){
          var classes = ["third-item"];
          if(shouldOpen(item, rowName)){
            classes.push("active");
          }
          return classes;
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
          
          if(item.children && item.children.length){
            classes.push("has-third-item");
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