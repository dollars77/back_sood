module.exports = (sequelize, Sequelize) => {
    const Preset = sequelize.define("preset", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            defaultValue: "",
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
        },
        order: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        note: {
            type: Sequelize.STRING,
            defaultValue: "",
        },
    }, {
        timestamps: true,
        updatedAt: false
    });
    return Preset;
};
