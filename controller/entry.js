EntryController = {

  findEntry: function() {
    return Entry.find({}, {sort: {created_at: -1}});
  },

  createEntry: function(comment) {
    Entry.insert({
      text: comment,
      liked: 0,
      baded: 0,
      created_at: (new Date()).getTime()
    });
    console.log('posted');
  },

  removeEntry: function(id) {
    Entry.remove(id);
    console.log('removed');
  },

  updateLiked: function(id) {
    Entry.update({_id: id}, {$inc: {liked: 1}});
  },

  updateBaded: function(id) {
    Entry.update({_id: id}, {$inc: {baded: 1}});
  },

};
