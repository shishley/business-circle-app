import Post from "../models/Post.js";
import User from "../models/User.js";

/* crudCREATE */
export const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath } = req.body;
      const user = await User.findById(userId);
      const newPost = new Post({
        userId,
        bizname: user.bizname,
        location: user.location,
        description,
        userPicturePath: user.picturePath,/* all the frontend with be sending  */
        picturePath,
        likes: {},
        comments: [],
      });
      await newPost.save();
      /* grabbing all posts to be returned to frontend  */
      const post = await Post.find();
      res.status(201).json(post);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };

  /* crudREAD */
export const getFeedPosts = async (req, res) => {
    try {
      const post = await Post.find();
      res.status(200).json(post);/* success request  */
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  
  export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });/* only grab user post  */
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  /* crudUPDATE */
export const likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const post = await Post.findById(id);/* grabbing post info */
      const isLiked = post.likes.get(userId);/* to check in the likes if user id exist , whether they liked or not */
  
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,/* update frontend after hitting like button  */
        { likes: post.likes },
        { new: true }
      );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };