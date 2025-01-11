module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("games", {
      gamename: {
        type: Sequelize.STRING,
        defaultValue: "-",
      },
      imagegame: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      icongame: {
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
      cover:{
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      percent_rtp: {
        type: Sequelize.FLOAT(11, 2),
        defaultValue: 0.0,
      },
      level: {
        type: Sequelize.STRING(50),
        defaultValue: "VIP1",
      },
      
    });
    return Game;
  };
  