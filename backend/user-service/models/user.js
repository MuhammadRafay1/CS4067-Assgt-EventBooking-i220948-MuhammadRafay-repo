const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Fix: Only hash password if not already hashed
  User.beforeCreate(async (user) => {
    if (!user.password.startsWith("$2a$")) {  // Check if already hashed
      console.log("Hashing password for:", user.email);
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
