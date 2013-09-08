MessagesController = {

  findMessages: function() {
                  return Messages.find({}, {sort: {created_at: -1}});
                },

  postMessage: function(comment) {
                 Messages.insert({
                   text: comment,
                   created_at: (new Date()).getTime()
                 });
                 console.log('posted');
               },

  removeMessage: function(_id) {
                   Messages.remove(_id);
                   console.log('removed');
                 },

};
