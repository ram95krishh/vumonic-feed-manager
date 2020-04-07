const router = require('express').Router();

const { logger } = require('../lib');
const userUtils = require('./utils/users');
const { UserModel } = require('../models');

const onboardUser = async (req, res) => {
  try {
    const userData = req.body
    const user = new UserModel(userData);
    const savedData = await user.save();
    return res.status(200).json(savedData);
  } catch (e) {
    logger.error(`Error in onboarding user :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
};

const getByEmail = async (req, res) => {
  try {
    const { email }= req.params;
    const user = await UserModel.findOne({ email }).select(userUtils.sensitiveKeysExclusionString);
    return res.status(200).json(user);
  } catch (e) {
    logger.error(`Error retrieving user by email :: Exception :: ${e.stack}`);
    return res.status(500).json({ error: e.message });
  }
}

router.route('/onboard').post(onboardUser);
router.route('/get_by_email/:email').get(getByEmail);

module.exports = router;