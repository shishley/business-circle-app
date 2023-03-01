/*logic here*/

import User from "../models/User.js";

/* crudREAD */
export const getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);/* using id to grab info we need of user */
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, bizname, field, location, picturePath }) => {
          return { _id, bizname, field, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  /* crudUPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await User.findById(id);
      const friend = await User.findById(friendId);/* grabbing user nfriend id */
  
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();
  
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, bizname, field, location, picturePath }) => {
          return { _id, bizname, field, location, picturePath };
        }
      );

      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };