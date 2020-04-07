const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    required: true,
    type: Schema.Types.String,
  },
  lastName: {
    required: true,
    type: Schema.Types.String,
  },
  email: {
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    type: Schema.Types.String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
  },
  picture: {
    type: Schema.Types.String,
    default: ''
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
