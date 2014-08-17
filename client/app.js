var Boons = new Meteor.Collection("boons");

var createTimeOptions = function() {

  var _timeOptions = [];

  for (var i = 0; i < 24; i++) {

    if (_.isEqual(i.toString().length, 2)) {
      _timeOptions.push(i + ":00");
      _timeOptions.push(i + ":30");
    } else {
      _timeOptions.push("0" + i + ":00");
      _timeOptions.push("0" + i + ":30");
    }
  }

  return _timeOptions;

}

Router.map(function() {

  this.route('home', {
    path: '/',
    layoutTemplate: 'layout',
    template: 'home'
  });

  this.route('about', {
    path: '/about',
    layoutTemplate: 'layout',
    template: 'about'
  });

  this.route('new', {
    path: '/new',
    layoutTemplate: 'layout',
    template: 'new',
    data: function() {
      return createTimeOptions();
    }
  });

  this.route('show', {
    path: '/posts/:_id',
    layoutTemplate: 'layout',
    template: 'show',
    data: function() {
      return Posts.findOne(this.params._id);
    }
  });

});

var requiredChecker = function(str) {
   
  if(_.isEmpty(str)) {
    return false;
  }

  if(/^\s+$/.test(str)) {
    return false;
  }

  return true;
}

Template.new.events({
  'click #postEntry' : function(e) {

    var $inputEventTitle = $('#inputEventTitle');
    var $inputEventTime = $('#inputEventTime');
    var $infoArea = $('#infoArea');
    var $inputPassword = $('#inputPassword');

    var $selectDate = $('#select-date');
    var $selectStartTime = $('#select-start-time');
    var $selectEndTime = $('#select-end-time');

    if(requiredChecker($inputEventTitle.val())) {
      $('#inputEventTitleIsRequired').addClass('hide');
    } else {
      $('#inputEventTitleIsRequired').removeClass('hide');
    }

    if(requiredChecker($selectDate.val())) {
      $('#selectDateIsRequired').addClass('hide');
    } else {
      $('#selectDateIsRequired').removeClass('hide');
    }

  }
});
