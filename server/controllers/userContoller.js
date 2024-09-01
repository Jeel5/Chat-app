const User = require('../models/user');

const searchUsers = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    console.log(req.user.id)
    const users = await User.find({
      _id: { $ne: req.user.id }, 
      username: { $regex: searchTerm, $options: 'i' },
    }).limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { searchUsers };

