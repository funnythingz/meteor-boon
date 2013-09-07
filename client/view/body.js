if (Meteor.isClient) {
  
  var timer;

  Meteor.startup(function () {
    resetRender();
  });

  Template.body.greeting = function () {
    return "なにかをつくっているお";
  };

  Template.body.events({
    'focus .get-comment' : function () {
      timer = setInterval(checkPressButton, 300);
    },

    'blur .get-comment' : function () {
      clearInterval(timer);
    },

    'click .post-button' : function () {
      if(isComment()) {
        $('#comment').append(
          createComment($('.get-comment').val())
        );
        resetRender();
      }
    }
  });

  var checkPressButton = function() {
    if(isComment()) {
      okPostButton();
    } else {
      disabledPostButton();
    }
  }

  var resetRender = function() {
    $('.get-comment').val('');
    disabledPostButton();
  }

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

  var okPostButton = function() {
    var postButton = $('.post-button');
    if(postButton.hasClass('disabled')) {
      postButton.removeClass('disabled');
    }
  }

  var disabledPostButton = function() {
    var postButton = $('.post-button');
    if(!postButton.hasClass('disabled')) {
      postButton.addClass('disabled');
    }
  }

}
