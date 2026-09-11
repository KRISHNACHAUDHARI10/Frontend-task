const mongoose = require('mongoose');

const modulePermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permission: [{ type: String }],
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['UserA', 'UserB'], default: 'UserA' },
    modules: [modulePermissionSchema],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
