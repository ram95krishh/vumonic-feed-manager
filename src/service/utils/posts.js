const getAllPostsQuery = (userModelName, count, page, userId) => {
  return [
    { $match: {}},
    {
      $addFields: {
        likesCount: {
          $size: '$likes'
        },
        commentsCount: {
          $size: '$comments'
        },
        isLiked: {
          $in: [userId, '$likes']
        }
      }
    },
    {
      $sort: {
        publishedDate: -1
      }
    },
    { $limit: count }, { $skip: (count * page) },
    {
      $lookup: {
        from: userModelName,
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: '$author'
    },
    {
      $project: {
        '_id': 0,
        '__v': 0,
        'likes': 0,
        'author._id': 0,
        'author.__v': 0,
        'comments': 0
      }
    }
  ]
}

const getCommentsByIdQuery = (userModelName, id, skip, count) => {
  return [
    { $match: { id: parseInt(id) }},
    { $unwind: '$comments' },
    {
      $lookup: {
        from: userModelName,
        localField: 'comments.user',
        foreignField: '_id',
        as: 'comments.user'
      }
    },
    {
      $unwind: '$comments.user'
    },
    { $project: { 'comments.user._id': 0, 'comments.user.__v': 0 }},
    { $sort: {
      'comments.createdOn': -1
    }},
    {
      '$group': {
        _id: null,
        'comments': {
          $push: '$comments'
        }
      }
    },
    { $project: { _id: 0, comments: { $slice: ['$comments', skip, count] } }}
  ]
}

const getLikesByIdQuery = (userModelName, id, skip, count) => {
  return [
    { $match: { id: parseInt(id) }},
    { $unwind: '$likes' },
    {
      $lookup: {
        from: userModelName,
        localField: 'likes',
        foreignField: '_id',
        as: 'likes'
      }
    },
    { $unwind: '$likes' },
    { $project: { 'likes._id': 0, 'likes.__v': 0 }},
    {
      '$group': {
        _id: null,
        'likes': {
          $push: '$likes'
        }
      }
    },
    { $project: { _id: 0, likes: { $slice: ['$likes', skip, count] } }}
  ]
}

module.exports = {
  getAllPostsQuery,
  getCommentsByIdQuery,
  getLikesByIdQuery,
}
