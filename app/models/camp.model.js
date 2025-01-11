module.exports = (sequelize, Sequelize) => {
    const Camp = sequelize.define("camps", {
      campname: {
        type: Sequelize.STRING,
        defaultValue: "-",
      },
      imagecamp: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      iconcamp: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status:{
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      level: {
        type: Sequelize.STRING(50),
        defaultValue: "VIP1",
      },
      
    });
    return Camp;
  };
  