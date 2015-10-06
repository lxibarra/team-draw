angular.module('teamDrawApp').controller('toolbarCtrl', function ($scope, $mdSidenav, $_slateAction) {
  var originatorEv;

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
    size:0
  };

  $scope.circle = {
    size:0
  };

  $scope.eraser = {
    size:0
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
   * On color change the value for $_slateAction is changed
   */
  $scope.$watch('foreground', function (newValue) {
    $_slateAction.foregroundColor = newValue || $scope.foreground.color;
  }, true);

  /**
   * Sets a watch for 2 way databinding variables that keeps track of the current background selected color.
   * The true flag indicates a deep watch on the object(object sub properties in this case color)
   *
   * On color change the value for $_slateAction is changed
   */
  $scope.$watch('background', function (newValue) {
    $_slateAction.backgroundColor = newValue || $scope.background.color;
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
  $scope.selectTool = function(tool) {
    $_slateAction.Tool = tool;
    //Object model names is the same as a the service :) to avoid aditional code.
    $_slateAction.stroke = $scope[tool.toLowerCase()].size|| 0;
    console.log($_slateAction);
  };

  $scope.changeBrushStroke = function(value) {
    $_slateAction.stroke = value ||0;
  };


});
