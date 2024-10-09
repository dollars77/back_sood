module.exports = (sequelize, Sequelize) => {
  const People = sequelize.define("peoples", {
    firstname: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },
    lastname: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },

    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
    },
    credit: {
      type: Sequelize.DECIMAL(11, 2),
      defaultValue: 0.0,
    },

    phone: {
      type: Sequelize.STRING(10),
      defaultValue: "",
      unique: true
    },
    email: {
      type: Sequelize.STRING(50),
      defaultValue: "",
    },
    level: {
      type: Sequelize.STRING(50),
      defaultValue: "VIP1",
    },
    imagefrontcard: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    imagebackcard: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    verify_status:{
      type: Sequelize.TINYINT,
      defaultValue: 0,
    },
    refcode: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
  });
  return People;
};
