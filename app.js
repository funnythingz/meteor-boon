if (Meteor.isClient) {

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
      template: 'new'
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
