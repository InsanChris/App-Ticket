const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    status: req.body.status,
    response: req.body.response,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
}

exports.updatePost = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    status: req.body.status,
    response: req.body.response,
    creator: req.userData.userId
  });
  Post.updateOne(
    { _id: req.params.id },
    post
  ).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find().sort({ date: -1 });
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "fetching posts failed!"
      });
    });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "fetching post failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(
    result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  )
  .catch(error => {
    res.status(500).json({
      message: "Deleting post failed!"
    });
  });
}
