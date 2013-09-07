if (Meteor.isClient) {
  
  var timer;

  Meteor.startup(function () {
    resetRender();
  });

  Template.body.greeting = function () {
    return "なにかをつくっているお";
  };

  Template.body.events({
    'keypress .get-comment' : function (event) {
      if(isEnter(event.keyCode)) {
        inputClear();
      }
    },
    'focus .get-comment' : function () {
      timer = setInterval(checkCommentAction, 300);
    },

    'blur .get-comment' : function () {
      clearInterval(timer);
    },

    'click .post-button' : function () {
      inputClear();
    }
  });

  var checkCommentAction = function() {
    if(isComment()) {
      okPostButton();
    } else {
      disabledPostButton();
    }
  }

  var inputClear = function() {
    if(isComment()) {
      $('#comment').append(
        createNanika($('.get-comment').val())
      );
      resetRender();
    }
  }

  var resetRender = function() {
    $('.get-comment').val('');
    disabledPostButton();
  }

  var createNanika = function(comment) {
    var $nanika = $('<li class="nanika">');
    var $less = $('<div class="less">');
    var $action = $('<div class="action">');
    var $like = $('<div class="like">');
    var $bad = $('<div class="bad">');

    $less.html(comment);
    $like.html('(^q^)b');
    $bad.html('p(-q-)');

    $action.append($like, $bad);
    $nanika.append($less, $action);
    return $nanika;
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
