angular.module('teamDrawApp').controller('toolbarCtrl', function ($rootScope, $scope, $mdSidenav) {
  var originatorEv,
    setUpTool = { //We create a default object to provide blueprint and avoid undefined errors when setting different props
      Tool: 'Pencil',
      args: [0, '#000000', '#ffffff']
    };

  /**
   * Sets the initial stroke default color
   * @type {{color: string}}
   */
  $scope.foreground = {
    color: '#ffffff'
  };

  /**
   * Set the initial background default color;
   * @type {{color: string}}
   */
  $scope.background = {
    color: '#000000'
  };

  /**
   * Predefined ng-models values so the labels have something to display.
   *
   */

  $scope.pencil = {
    size: 0
  };

  $scope.circle = {
    size: 0
  };

  $scope.eraser = {
    size: 0
  };

  /**
   * Toggles the user side bar
   */
  $scope.sideBar = function () {
    $mdSidenav('rightSidebar').toggle();
  };

  /**
   * Helper method that allows sub menu option to open.
   * @param $mdOpenMenu
   * @param ev
   */
  $scope.openMenu = function ($mdOpenMenu, ev, tool) {
    originatorEv = ev;
    $mdOpenMenu(ev);
    if (tool) {
      $scope.selectTool(tool);
    }
  };

  /**
   * Toolbar button actions
   */

  /**
   * *************************************************************************************************************
   *                                                Color Pickers
   *
   * ************************************************************************************************************
   *
   * Color pickers rely on watches and 2 way databinding. A tinycolor (just a wrapper) directive was created with
   * 2 way databinding variable. When the value changes inside the directive the watch updates the value in proper
   * scope.
   */

  /**
   * Sets a watch for a 2 way databinding variables that keeps track of the current foreground selected color.
   * The true flag indicates a deep watch on the object(object sub properties in this case color)
   *
   *
   */
  $scope.$watch('foreground', function (newValue) {
    //$_slateAction.foregroundColor = newValue || $scope.foreground.color;
    //This watches posibly can be removed because $scope.foreground already has a value on color change
    //Update the object sent over to

    setUpTool.args[1] = newValue.color || '#000000';
    /*var tmp = setUpTool.args;
    delete setUpTool.args;
    setUpTool.args = tmp.slice();*/
    $rootScope.$broadcast('toolBar/setUpTool', setUpTool);
  }, true);

  /**
   * Sets a watch for 2 way databinding variables that keeps track of the current background selected color.
   * The true flag indicates a deep watch on the object(object sub properties in this case color)
   *
   *
   */
  $scope.$watch('background', function (newValue) {
    setUpTool.args[2] = newValue.color || '#ffffff';
    /*var tmp = setUpTool.args;
    delete setUpTool.args;
    setUpTool.args = tmp.slice();*/
    $rootScope.$broadcast('toolBar/setUpTool', setUpTool);
  }, true);


  /**
   * *************************************************************************************************************
   *                                                Pencil
   *
   * ************************************************************************************************************
   *
   *
   */

  /**
   * Set the Tool of use.
   * @param tool
   */
  $scope.selectTool = function (tool) {

    setUpTool.Tool = tool;
    setUpTool.args = [];
    switch (tool) {
      case 'Pencil' :
        setUpTool.args.push($scope.pencil.size || 0);
        setUpTool.args.push($scope.foreground.color || '#000000');

        break;
      case 'Circle' :
        setUpTool.args.push($scope.circle.size || 0);
        setUpTool.args.push($scope.foreground.color || '#000000');
        setUpTool.args.push($scope.background.color || '#FFFFFF');
        setUpTool.args.push($scope.circle.fill||false);
        break;
      case 'Eraser' :
        setUpTool.args.push($scope.eraser.size || 0);
            break;
    }

    $rootScope.$broadcast('toolBar/setUpTool', setUpTool);


  };

  $scope.changeBrushStroke = function (value) {
    setUpTool.args[0] = value || 0;
    $rootScope.$broadcast('toolBar/setUpTool', setUpTool);
  };

  $scope.onFillChange = function(value) {
    if(setUpTool.args.length < 4) {
      setUpTool.args.push(value);
    } else {
      setUpTool.args[3] = value;
    }
    $rootScope.$broadcast('toolBar/setUpTool', setUpTool);
  }


});
