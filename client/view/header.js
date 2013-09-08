if (Meteor.isClient) {

  Template.header.sitename = function () {
    return "Nanika ;)";
  };

  Template.header.greeting = function () {
    return "Making of the";
  };

}
