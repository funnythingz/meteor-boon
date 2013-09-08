MessagesController = {

  findEntry: function() {
    return Messages.find({}, {sort: {created_at: -1}});
  },

  createEntry: function(comment) {
    Messages.insert({
      text: comment,
      liked: 0,
      baded: 0,
      created_at: (new Date()).getTime()
    });
    console.log('posted');
  },

  removeEntry: function(_id) {
    Messages.remove(_id);
    console.log('removed');
  },

};
