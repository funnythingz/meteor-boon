if (Meteor.isClient) {
  
  var timer;

  Meteor.startup(function () {
    resetRender();
  });

  Template.post.events({
    'keypress .get-comment' : function (event) {
      if(isEnter(event.keyCode)) {
        postMessage();
      }
    },
    'focus .get-comment' : function () {
      timer = setInterval(checkCommentAction, 300);
    },

    'blur .get-comment' : function () {
      clearInterval(timer);
    },

    'click .post-button' : function () {
      postMessage();
    }
  });

  var checkCommentAction = function() {
    if(isComment()) {
      okPostButton();
    } else {
      disabledPostButton();
    }
  }

  var postMessage = function() {
    if(isComment()) {
      MessagesController.postMessage($('.get-comment').val());
      resetRender();
    }
  }

  var resetRender = function() {
    $('.get-comment').val('');
    disabledPostButton();
  }

  var isEnter = function(keyCode) {
    if(_.isEqual(keyCode, 13)) {
      return true;
    }
    return false;
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
