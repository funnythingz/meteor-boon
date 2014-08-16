if (Meteor.isClient) {

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

}
