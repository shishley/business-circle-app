import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* register user */
export const register = async (req, res) => {
    try {
      const {
        bizname,
        email,
        password,
        picturePath,
        friends,
        location,
        field,
      } = req.body;

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);/* encryption of password  */
  
      const newUser = new User({
        bizname,
        email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      field,
      viewedProfile: Math.floor(Math.random() * 10000),/* giving random number   */
      impressions: Math.floor(Math.random() * 10000),/* giving random number   */
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);/* res argument from express ,201 mean something was created    */
  } catch (err) {
    res.status(500).json({ error: err.message });/* correct error  ,500 mean something went wrong  */
  }
};

/*signing in */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });/*using mongoose to find specified email */
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);/*using bcrypt to match password  */
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/*authentication setup now above  */