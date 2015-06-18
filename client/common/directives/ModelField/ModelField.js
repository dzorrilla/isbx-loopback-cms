angular.module('dashboard.directives.ModelField', [
  'dashboard.directives.ModelFieldImage', 
  'dashboard.directives.ModelFieldFile', 
  'dashboard.directives.ModelFieldReference',
  'dashboard.directive.DateTimePicker',
  'ngCookies',
  'ngSlider'
])

.directive('modelFieldView', function($compile) {
  function getTemplate(type) {
    var template = '';
    switch(type) {
      default:
        template = '<b>{{ field.label }}</b>: {{ data[field.name] }}';
    }
    return template;
  }
  return {
    restrict: 'E',
    scope: {
      key: '=key',
      model: '=model',
      data: '=ngModel'
    },
    link: function(scope, element, attrs) {
        element.html(getTemplate(scope.field.type)).show();
        $compile(element.contents())(scope);
    }
  };
})

.directive('modelFieldEdit', function($compile, $cookies) {
  function getTemplate(type) {
    var template = '';
    switch(type) {
      case 'reference':
        // depends on directive modelFieldReferenceEdit
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label> \
          <div class="col-sm-10"> \
            <model-field-reference-edit key="key" property="property" options="display.options" model-data="data" ng-model="data[key]" class="field" ng-required="{{ model.properties[key].required }}" ng-disabled="display.readonly"  /> \
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div> \
          <div class="col-sm2"></div> \
          <div class="col-sm-10"> \
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'file':
        // depends on directive modelFieldFileEdit
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label> \
          <div class="col-sm-10"> \
            <model-field-file-edit key="key" options="display.options" disabled="display.readonly" model-data="data" ng-model="data[key]" class="field" /> \
          </div> \
          <br /> \
          <label class="col-sm-2 control-label place-holder-file-label"></label> \
          <div class="col-sm-10"> \
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'image':
        // depends on directive modelFieldImageEdit
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label> \
          <div class="col-sm-10"> \
            <model-field-image-edit key="key" options="display.options" disabled="display.readonly" model-data="data" ng-model="data[key]" class="field" /> \
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'datetime':
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label> \
          <div class="col-sm-10"> \
            <p class="date-picker input-group"> \
              <input type="text" class="form-control" \
              control="test"\
              ng-model="data[key]" \
              ng-format="display.options.format" \
              ng-view-mode="display.options.viewMode" \
              ng-required="{{ model.properties[key].required }}" ng-disabled="{{ display.readonly }}" \
              data-date-time-picker \
               /> \
              <span class="input-group-btn"> \
                <button type="button" class="btn btn-default" ng-click="test.show()" ng-disabled="{{ display.readonly }}"><i class="fa fa-calendar"></i></button> \
              </span>\
            </p> \
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        //<model-field-datetime-edit options="field.options" ng-model="data[field.name]" class="field" /> \
        break;
      case 'multi-select':
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label>\
          <div class="col-sm-10 multi-select">\
            <div class="select-item checkbox-container" ng-repeat="(itemKey, itemValue) in display.options">\
              <input type="checkbox" class="field" ng-model="multiSelectOptions[itemKey]" ng-checked="multiSelectOptions[itemKey]" ng-disabled="{{ display.readonly }}" ng-change="clickMultiSelectCheckbox(itemKey, itemValue, multiSelectOptions[itemKey])">\
              <span class="checkbox-label">{{ itemValue }}</span>\
            </div>\
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'select':
        //NOTE: need to add empty <option> element to prevent weird AngularJS select issue when handling first selection
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label>\
          <div class="col-sm-10">\
            <select ng-model="data[key]" ng-options="key as value for (key, value) in display.options" ng-required="{{ model.properties[key].required }}" class="field form-control"><option value=""></option></select>\
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'slider':
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label>\
          <div class="col-sm-10">\
            <input slider ng-model="data[key]" options="display.options" class="slider ng-isolate-scope ng-valid ng-hide ng-dirty"> \
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'boolean':
        template = '<div class="col-sm-2"></div> \
          <div class="col-sm-10 checkbox-container">\
            <input type="checkbox" ng-model="data[key]" ng-checked="check(data, key)" class="field" ng-disabled="{{ display.readonly }}">\
            <span class="checkbox-label">{{ display.label || key }}</span>\
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'password':
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label>\
          <div class="col-sm-10">\
            <input type="password" ng-model="data[key]" ng-pattern="{{ display.pattern }}" ng-disabled="{{ display.readonly }}" ng-required="{{ model.properties[key].required }}" class="field form-control">\
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'textarea':
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label>\
          <div class="col-sm-10">\
            <textarea ng-model="data[key]" ng-disabled="{{ display.readonly }}" ng-required="{{ model.properties[key].required }}" class="field form-control"></textarea>\
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
        break;
      case 'text':
      default:
        template = '<label class="col-sm-2 control-label">{{ display.label || key }}:</label>\
          <div class="col-sm-10">\
            <input type="text" ng-model="data[key]" ng-pattern="{{ display.pattern }}" ng-disabled="{{ display.readonly }}" ng-required="{{ model.properties[key].required }}" class="field form-control">\
            <div class="model-field-description" ng-if="display.description">{{ display.description }}</div>\
          </div>';
    }
    return template;
  }
  return {
    restrict: 'E',
    scope: {
      key: '=key',
      model: '=model',
      data: '=ngModel'
    },
    link: function(scope, element, attrs) {
        
        //In situations where edit form has fields not in the model json properties object (i.e. ModelFieldReference multi-select)
        if(scope.key !== null && typeof scope.key === 'object') {
          if (!scope.model.properties[scope.key.property]) {
            scope.model.properties[scope.key.property] = {};
            scope.model.properties[scope.key.property].display = scope.key;
          }
          scope.key = scope.key.property;
        } 
        
        var property = { display: {type: "text"} };
        if (scope.model.properties && scope.model.properties[scope.key]) property = scope.model.properties[scope.key];
        if (!property) {
          console.log("ModelField link error: no property for model '" + scope.model.name + "'; property key = '" + scope.key + "' found!");
          return; //ABORT if no property definition
        }
        if (!property.display || !property.display.type) {
          if (!property.display) property.display = {};
          //TODO: check the property definition in the loopback model and pick a better default "type"
          switch (property.type) {
            case "date": 
            case "Date":
                property.display.type = "datetime";
            break;
            default: property.display.type = "text"; break;
          }
        }
        
        scope.property = property;
        scope.display = property.display;


        //Set default date format
        if (property.display.type == "datetime") {
          if (!property.display.options) property.display.options = {};
          if (!property.display.options.format) property.display.options.format = "YYYY-MM-DD  h:mm A";
        }
        
        if (property.display.type == "boolean") {
          scope.check = function(data, key) {
            //This function is needed to accept string '1' and numeric 1 values when state changes
            var value = data[key];
            if (value == undefined || value == null) return scope.display.default;
            data[key] = value == '1' || value == 1; //Fixes a bug where data[key] changes from bool to string can cause checkbox to get unchecked
            return data[key];
          }
          //Make sure boolean (checkbox) values are numeric (below only gets called on init and not when state changes)
          if (typeof scope.data[scope.key] === "string") scope.data[scope.key] = parseInt(scope.data[scope.key]);
        }
        
        if (property.display.type == "slider") {
          if (!scope.data[scope.key]) scope.data[scope.key] = scope.display.options.from + ";" + scope.display.options.to;
        }

        //See if there is a default value
        if (!scope.data[scope.key] && (property["default"] || typeof property["default"] === 'number')) {
          scope.data[scope.key] = property["default"];
        }

        //Set multi-select output type
        if (property.display.type == "multi-select") {
          if (typeof property.display.output === 'undefined') {
            property.display.output = scope.display.options instanceof Array ? "comma" : "object";
          }
          switch (property.display.output) {
            case "comma":
              if (!scope.data[scope.key]) scope.data[scope.key] = "";
              var items = scope.data[scope.key].split('","');
              scope.multiSelectOptions = {};
              for (var i in items) {
                var item = items[i];
                if (item[0] == '"') item = item.substring(1, item.length);
                if (item[item.length-1] == '"') item = item.substring(0, item.length-1);
                var index = scope.display.options.indexOf(item);
                scope.multiSelectOptions[index] = true;
              }
              break;
            case "array":
              if (!scope.data[scope.key]) scope.data[scope.key] = [];
              for (var i in scope.data[scope.key]) {
                var index = scope.data[scope.key][i];
                scope.multiSelectOptions[index] = true;
              }
              break;
            case "object":
              if (!scope.data[scope.key]) scope.data[scope.key] = {};
              scope.multiSelectOptions = angular.copy(scope.data[scope.key]);
              break;
          }
        }
        
        //Handle translating multi-select checks to scope.data[scope.key] output format
        scope.clickMultiSelectCheckbox = function() {
          var output = property.display.output == "array" ? [] : property.display.output == "object" ? {} : "";
          if (property.display.output == "object") {
            //Return Key/Value Pair
            var keys = Object.keys(scope.display.options);
            for (var i in keys) {
              var key = keys[i];
              var value = scope.display.options[key];
              var selected = scope.multiSelectOptions[key];
              if (selected) output[key] = value; //return object

            }
          } else {
            //Results are always in order of scope.display.options
            for (var i = 0; i < scope.display.options.length; i++) {
              var value = scope.display.options[i];
              var selected = scope.multiSelectOptions[i];
              switch (property.display.output) {
                case "comma":
                  if (selected) output += "\"" + value + "\","; //quote qualified
                  break;
                case "array":
                  if (selected) output.push(i); // return array of selected indexes in order
                  break;
              }
            }
            if (property.display.output == "comma" && output.length > 0) output = output.substring(0, output.length-1); //remove last comma
          }
          scope.data[scope.key] = output;
          
        };


        if (property.display.type == "custom") {
          element.html(property.display.editTemplate).show();
        } else {
          element.html(getTemplate(property.display.type)).show();
        }
        $compile(element.contents())(scope);

    }
  };
})

;