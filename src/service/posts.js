const router = require('express').Router();
const config = require('config');
const mongoose = require('mongoose');

const { logger, api } = require('../lib');
const postUtils = require('./utils/posts')
const userUtils = require('./utils/users');
const { UserModel, PostModel } = require('../models');

const userModelName = UserModel.collection.name
const { ObjectId } = mongoose.Types
const postsUrl = config.get('postsUrl');

const injectPosts = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users.length) {
      return res.status(500).send('Onboard users before injecting posts');
    }
    let posts = await api.callGet(postsUrl)
    posts = posts.map((post, index) => {
      const date = new Date()
      return {
        ...post,
        author: users[0]._id,
        comments: [],
        publishedDate: new Date(date.getTime() - (index * 24 * 60 * 60 * 1000))
      }
    })
    const result = await PostModel.insertMany(posts);
    return res.status(200).send('Success');
  } catch (e) {
    logger.error(`Error in injecting posts :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
};

const updateLikesById = async (req, res) => {
  try {
    const payload = req.body
    const { postId: id, like, userId } = payload
    const post = await PostModel.findOne({ id })
    if (like) {
      if (!post.likes.includes(userId)) {
        post.likes.push(userId)
      }
    } else {
      post.likes = post.likes.filter(id => {
        return id.toString() !== userId
      })
    }
    const result = await post.save();
    return res.status(200).json({ isLiked: like, likesCount: result.likes.length })
  } catch (e) {
    logger.error(`Error while updating likes :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
}

const getAllPosts = async (req, res) => {
  try {
    let { page = 0, count = 20 } = req.body;
    const { userId } = req.body
    page = parseInt(page);
    count = parseInt(count);

    const feedQuery = postUtils.getAllPostsQuery(userModelName, count, page, new ObjectId(userId))
    const posts = await PostModel.aggregate(feedQuery)

    return res.status(200).json(posts);
  } catch (e) {
    logger.error(`Error while retrieving posts :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
}

const addComment = async (req, res) => {
  try {
    const comment = req.body
    const { postId: id } = comment
    const post = await PostModel.findOne({ id })
    post.comments.push(comment.data)
    const result = await post.save()
    return res.status(200).send(result.comments)
  } catch (e) {
    logger.error(`Error while adding comments post with id :: ${req.body.postId} Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
}

const getCommmentsById = async (req, res) => {
  try {
    const { postId: id } = req.body;
    let { skip = 0, count = 10 } = req.body;
    skip = parseInt(skip);
    count = parseInt(count);
    let result = await PostModel.aggregate(postUtils.getCommentsByIdQuery(userModelName, id, skip, count))
    result = (result[0] && result[0].comments) || []
    return res.status(200).json(result)
  } catch (e) {
    logger.error(`Error while retrieving post comments :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
}

const getLikesById = async (req, res) => {
  try {
    const { postId: id } = req.body
    let { skip = 0, count = 20 } = req.body
    skip = parseInt(skip);
    count = parseInt(count);
    let result = await PostModel.aggregate(postUtils.getLikesByIdQuery(userModelName, id, skip, count))
    result = (result[0] && result[0].likes) || []
    return res.status(200).json(result)
  } catch (e) {
    logger.error(`Error while retrieving post likes :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
}


router.route('/inject').get(injectPosts);
router.route('/get_feed').post(getAllPosts);

router.route('/get_likes_by_id').post(getLikesById)
router.route('/update_likes_by_id').post(updateLikesById);

router.route('/get_comments_by_id').post(getCommmentsById)
router.route('/add_comment').post(addComment)


module.exports = router;