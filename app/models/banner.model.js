module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define("banners", {

      imagebanner: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      type:{
        type: Sequelize.TINYINT,
        defaultValue: 1,
      },
      level: {
        type: Sequelize.STRING(50),
        defaultValue: "VIP1",
      },
      language: {
        type: Sequelize.STRING(2),
        defaultValue: "TH",
      },
      
    });
    return Banner;
  };
  