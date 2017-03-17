var app = angular.module('HowToApp', ["ui.bootstrap", 'ngAnimate', 'ngCookies', 'pascalprecht.translate']);
 
app.config(['$translateProvider', function ($translateProvider) {
  var supported_languages = ['en', 'de', 'kor'];
  $translateProvider.registerAvailableLanguageKeys(supported_languages, {
    'en_*': 'en',
    'de_*': 'de',
    'kor_*': 'kor'
  });
  $translateProvider.useStaticFilesLoader({
    prefix: 'locale/',
    suffix: '.json'
  });
  $translateProvider.determinePreferredLanguage();
  // set preferred language to english in case an unsupported or invalid
  // language was determined.
  if (supported_languages.indexOf($translateProvider.preferredLanguage()) < 0) {
    $translateProvider.preferredLanguage("en");
  }
  $translateProvider.fallbackLanguage("en");
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
}]);
 
app.controller('MainController', ['$translate', '$scope', '$location', function ($translate, $scope, $location) {
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };
  $scope.getPartial = function (path) {
      return 'include/descriptions-'+$translate.use()+'/'+path+'.html';
  };
  $scope.setProgress = function(percent, speed) { //TODO figure out what this is for
      if(!speed) {
          speed = 1;
      }
      $scope.progress = percent;
  };

  $scope.showQuestion = function(next) {
      if(next == "os") {
          $scope.setProgress(33);
      } else if(next == "level") {
          $scope.setProgress(66);
      } else {
          $scope.setProgress(0);
          next = "client";
      }
      $scope.question = next;
      $scope.content_include = "questions";
      $location.path("/" + next);
  };

  $scope.selectOS = function(os) {
      $scope.os = os;
      $scope.showQuestion("level");
  }

  $scope.selectClient = function(client) {
      $scope.client = client;
      $scope.showQuestion("os");
  }

  $scope.submitQuestions = function(difficulty) {
      $scope.difficulty = difficulty;
      $scope.setProgress (100, 0.5);
      $scope.content_include = "snippets";
      $location.path("/result");
  }

  $scope.showStartPage = function() {
      $location.path("");
      $scope.content_include = "startpage";
      $scope.os = "";
      $scope.client = "";
      $scope.difficulty = 2;
      $scope.progress = 0;
  }

  $scope.showQuestions = function() {
      $scope.showQuestion("client");
  }
  $scope.showImpressum = function() {
      $scope.content_include = "impressum";
  }
  $scope.showSources = function() {
      $scope.content_include = "sources";
  }
  $scope.getLanguageImageUrl = function(lang) {
      return 'image/'+lang+'_flag.png'
  }
  $scope.getLocalizedImageUrl = function(prefix) {
      return 'image/'+prefix+$translate.use()+'.png'
  }

  $scope.handlePath = function() {
      var question = $location.path().substr(1);
      var valid = false;
      if(question != ""){valid = true}
      if(question == "result"){
          $scope.content_include = "snippets";
          return;
      }
      if (!valid) {
          // no matching path, start from the beginning
          $scope.showStartPage();
      } else {
          $scope.showQuestion(question);
      }
  }

  $scope.$on('$locationChangeSuccess', function() {
      $scope.handlePath();
  });
  $scope.languages = ["en", "de", "kor"];
  $scope.textblock_classes = "description_block text_block";
  $scope.handlePath();
}]);
