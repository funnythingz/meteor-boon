if (Meteor.isClient) {

  var createComment = function(comment) {
    var $nanika = $('<li class="nanika">');
    $nanika.html(comment);
    return $nanika;
  }

  var isComment = function() {
    if(_.isEqual($('.get-comment').val(), '')) {
      return false;
    }
    return true;
  }

  Template.body.greeting = function () {
    return "なにかをつくっているお";
  };

  Template.body.events({
    'click .post-button' : function () {
      if(isComment()) {
        $('#comment').append(
          createComment($('.get-comment').val())
        );
        $('.get-comment').val('');
      }
    }
  });

}
