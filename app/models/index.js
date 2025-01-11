const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    
    dialectOptions: {
      useUTC: false, // for reading from database
    },
    timezone: '+07:00', // for writing to database
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/roles.model.js")(sequelize, Sequelize);
db.creditadmin = require("../models/creditadmin.model.js")(sequelize, Sequelize);
db.people = require("../models/people.model.js")(sequelize, Sequelize);

db.camp = require("../models/camp.model.js")(sequelize, Sequelize);
db.timerestriction = require("../models/timerestriction.model.js")(sequelize, Sequelize);
db.game = require("../models/game.model.js")(sequelize, Sequelize);

db.weburl = require("../models/weburl.model.js")(sequelize, Sequelize);
db.banner = require("../models/banner.model.js")(sequelize, Sequelize);
db.history = require("../models/history.model.js")(sequelize, Sequelize);
db.preset = require("../models/preset.model.js")(sequelize, Sequelize);
db.preset_game = require("../models/preset_game.model.js")(sequelize, Sequelize);


db.people.hasMany(db.creditadmin,{foreignKey:{name:'peopleId',allowNull:false},onDelete:'CASCADE'});
db.creditadmin.belongsTo(db.people,{foreignKey:{name:'peopleId',allowNull:false},onDelete:'CASCADE'});

db.camp.hasMany(db.game,{foreignKey:{name:'campId',allowNull:false},onDelete:'RESTRICT'});
db.game.belongsTo(db.camp,{foreignKey:{name:'campId',allowNull:false},onDelete:'RESTRICT'});

db.user.hasMany(db.creditadmin,{foreignKey:{name:'userId',allowNull:false},onDelete:'CASCADE'});
db.creditadmin.belongsTo(db.user,{foreignKey:{name:'userId',allowNull:false},onDelete:'CASCADE'});

db.camp.hasMany(db.timerestriction,{foreignKey:{name:'campId',allowNull:false},onDelete:'CASCADE'});
db.timerestriction.belongsTo(db.camp,{foreignKey:{name:'campId',allowNull:false},onDelete:'CASCADE'});

db.people.hasMany(db.timerestriction,{foreignKey:{name:'peopleId',allowNull:false},onDelete:'CASCADE'});
db.timerestriction.belongsTo(db.people,{foreignKey:{name:'peopleId',allowNull:false},onDelete:'CASCADE'});

db.people.hasMany(db.history,{foreignKey:{name:'peopleId',allowNull:false},onDelete:'CASCADE'});
db.history.belongsTo(db.people,{foreignKey:{name:'peopleId',allowNull:false},onDelete:'CASCADE'});

db.game.hasMany(db.preset_game,{foreignKey:{name:'gameId',allowNull:false},onDelete:'CASCADE'});
db.preset_game.belongsTo(db.game,{foreignKey:{name:'gameId',allowNull:false},onDelete:'CASCADE'});

db.preset.hasMany(db.preset_game,{foreignKey:{name:'presetId',allowNull:false},onDelete:'CASCADE'});
db.preset_game.belongsTo(db.preset,{foreignKey:{name:'presetId',allowNull:false},onDelete:'CASCADE'});

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.people.belongsToMany(db.user,{
  through:{
  model:db.creditadmin,
  as: "user",
  unique: false,
  // onDelete:'restrict'
  },foreignKey:"peopleId",
})
db.user.belongsToMany(db.people,{
  through:{
  model:db.creditadmin,
  as: "people",
  unique: false,
  // onDelete:'restrict'
  },foreignKey:"userId",
})

db.game.belongsToMany(db.preset,{
  through:{
  model:db.preset_game,
  as: "preset",
  unique: false,
  // onDelete:'restrict'
  },foreignKey:"gameId",
})
db.preset.belongsToMany(db.game,{
  through:{
  model:db.preset_game,
  as: "game",
  unique: false,
  // onDelete:'restrict'
  },foreignKey:"presetId",
})






db.ROLES = ["user", "admin", "mod"];






module.exports = db;