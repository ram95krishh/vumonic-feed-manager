const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  body: {
    required: true,
    type: Schema.Types.String,
  },
  createdOn: {
    type: Schema.Types.Date,
    default: () => Date.now()
  }
}, { _id: false });

const PostSchema = new Schema({
  author: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  id: {
    required: true,
    unique: true,
    type: Schema.Types.Number,
  },
  title: {
    required: true,
    type: Schema.Types.String,
  },
  body: {
    required: true,
    type: Schema.Types.String,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  comments: {
    type: [CommentSchema]
  },
  publishedDate: {
    type: Schema.Types.Date,
    required: true
  }
})

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
