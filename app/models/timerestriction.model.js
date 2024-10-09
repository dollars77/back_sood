module.exports = (sequelize, Sequelize) => {
    const TimeRestriction = sequelize.define('timerestrictions', {

        startTime: {
            type: Sequelize.DATE,

        },
        endTime: {
            type: Sequelize.DATE,

        },
        status:{
            type: Sequelize.TINYINT,
            defaultValue: 0,
          },
    },{timestamps: false});
    return TimeRestriction;
};