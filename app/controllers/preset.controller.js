const dayjs = require("dayjs");
const sequelize = require("sequelize");
const op = sequelize.Op;
const db = require("../models");
const people = db.people;
const history = db.history;
const preset = db.preset;
const preset_game = db.preset_game;
const game = db.game;
const camp = db.camp;
const { Op } = require("sequelize");

exports.getAllGame = async (req, res) => {

    game
        .findAll({
            attributes: ["id", "campId", "gamename", "imagegame",
                "order", "status"],
            where: { status: 1 }, include: [
                {
                    model: camp,
                    as: "camp",
                    attributes: ["campname"],
                },
            ]
        },


        )
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while retrieving User.",
            });
        });
};
exports.getAllPreset = async (req, res) => {
    preset
        .findAll({
            include: [
                {
                    model: preset_game,
                    as: "preset_games",
                    include: [
                        {
                            model: game,
                            as: "game",
                            attributes: ["gamename", "imagegame", "icongame", "campId", "id"],
                            include: [
                                {
                                    model: camp,
                                    as: "camp",
                                    attributes: ["campname", "iconcamp"],
                                },
                            ]
                        },

                    ],
                    limit: 12,
                    order: [['order', 'ASC']]
                }
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM preset_games
                            WHERE preset_games.presetId = preset.id
                        )`),
                        'total_games'
                    ]
                ]
            },
            order: [["order", "ASC"]],
        })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while retrieving User.",
            });
        });
};
exports.getOnePreset = async (req, res) => {
    preset
        .findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: preset_game,
                    as: "preset_games",
                    include: [
                        {
                            model: game,
                            as: "game",
                            attributes: ["gamename", "imagegame", "icongame", "campId", "id"],
                            include: [
                                {
                                    model: camp,
                                    as: "camp",
                                    attributes: ["campname", "iconcamp"],
                                },
                            ]
                        },
                    ]
                }
            ],
            order: [
                ["order", "ASC"],
                [{ model: preset_game, as: 'preset_games' }, 'order', 'ASC']
            ]
        })
        .then(async (data) => {
            const transformedData = await data.preset_games.map(pg => ({
                id: pg.game.id,
                campId: pg.game.campId,
                gamename: pg.game.gamename,
                icongame:pg.game.icongame,
                imagegame: pg.game.imagegame,
                order: pg.order,
                status: data.status,
                camp: {
                    campname: pg.game.camp.campname
                },
                startTime: pg.startTime,
                endTime: pg.endTime
            }));

            res.status(200).send({ name: data.name, preset_games: transformedData });
        })
        .catch((err) => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while retrieving User.",
            });
        });
};
exports.getOnePresetUser = async (req, res) => {
    preset
        .findOne({
            where: { status: 1},
            include: [
                {
                    model: preset_game,
                    as: "preset_games",
                    include: [
                        {
                            model: game,
                            as: "game",
                            attributes: ["gamename", "imagegame", "icongame", "campId", "id"],
                            include: [
                                {
                                    model: camp,
                                    as: "camp",
                                    attributes: ["campname", "iconcamp"],
                                },
                            ]
                        },
                    ]
                }
            ],
            order: [
                ["order", "ASC"],
                [{ model: preset_game, as: 'preset_games' }, 'order', 'ASC']
            ]
        })
        .then(async (data) => {
            const transformedData = await data.preset_games.map(pg => ({
                id: pg.game.id,
                campId: pg.game.campId,
                gamename: pg.game.gamename,
                icongame:pg.game.icongame,
                imagegame: pg.game.imagegame,
                order: pg.order,
                status: data.status,
                campname: pg.game.camp.campname,
                iconcamp: pg.game.camp.iconcamp,
                startTime: pg.startTime,
                endTime: pg.endTime
            }));

            res.status(200).send(transformedData );
        })
        .catch((err) => {
            res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while retrieving User.",
            });
        });
};

exports.createPreset = async (req, res) => {
    try {
        let count_preset = await preset.count();
        await
            preset.create({ name: req.body.presetname, order: count_preset + 1 })
                .then(async (data) => {
                    if (req.body.dataSource.length > 0) {
                        const data_game = req.body.dataSource;
                        await data_game.map(async (game) => {
                            await preset_game.create({
                                order: game.order, startTime: game.startTime,
                                endTime: game.endTime, gameId: game.id, presetId: data.id
                            })
                        })
                    }


                    res.status(200).send({ status: true, id: data.id });
                })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        });
    }

}
exports.UpdatePreset = async (req, res) => {
    try {
        const presetId = req.params.id;

        await preset.update({ name: req.body.presetname }, { where: { id: presetId } })
        if (req.body.dataSource.length > 0) {
            await preset_game.destroy({ where: { presetId: presetId }, })

            const data_game = req.body.dataSource;
            await Promise.all(data_game.map((game) =>
                preset_game.create({
                    order: game.order,
                    startTime: game.startTime,
                    endTime: game.endTime,
                    gameId: game.id,
                    presetId: presetId
                })
            ));
        }


        res.status(200).send({ status: true });

    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        });
    }

}

exports.SelectPreset = async (req, res) => {
    const id = req.params.id;
    try {
        await preset.update(
            { status: 0 },
            { where: {} }
        );
        await preset.update({ status: 1 }, { where: { id: id } });

        res.status(200).send({ status: true });
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: error.message,
        });
    }



};

exports.deletePreset = (req, res) => {
    const id = req.params.id;

    preset
        .destroy({
            where: { id: id },
        })
        .then(() => {
            res.status(200).send({
                message: "preset was deleted successfully!",
            });
        })
        .catch((error) => {
            res.status(500).send({
                status: 500,
                message: error.message,
            });
        })

};