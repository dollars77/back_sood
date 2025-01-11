module.exports = (sequelize, Sequelize) => {
    const Preset_game = sequelize.define("preset_game", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },


        startTime: {
            type: Sequelize.STRING(10),
            defaultValue: "00:00",
        },

        endTime: {
            type: Sequelize.STRING(10),
            defaultValue: "00:00",

        },
    }, {
        timestamps: true,
        updatedAt: false
    });
    return Preset_game;
};