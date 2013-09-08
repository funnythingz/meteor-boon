MessagesController = {

  findMessages: function() {
                  return Messages.find({}, {sort: {created_at: -1}});
                },

  postMessage: function(comment) {
                 Messages.insert({
                   text: _.escape(comment),
                   created_at: (new Date()).getTime()
                 });
               }
};
