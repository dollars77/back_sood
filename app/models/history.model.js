module.exports = (sequelize, Sequelize) => {
    const history = sequelize.define("history", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      note:{
        type: Sequelize.STRING,
        defaultValue: "",
      },
      ipaddress:{
        type: Sequelize.STRING,
        defaultValue: "",
      }
    }, {
      timestamps: true,        
      updatedAt: false       
    });
    return history;
  };