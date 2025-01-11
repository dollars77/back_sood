const dayjs = require("dayjs");
const sequelize = require("sequelize");
const op = sequelize.Op;
const db = require("../models");
const people = db.people;
const history = db.history;
const { Op } = require("sequelize");

exports.EnterCamp = async (req, res) => {
    try {
        await history.create({
            note: req.body.note,
            ipaddress: req.body.ipaddress,
            peopleId: req.body.peopleId,
        });

        return res.status(200).json({ access: true });

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: error.message || "Some error occurred while retrieving Exams.",
        });
    }

}

exports.getAllHisroty = async (req, res) => {

    await history
        .findAll({
            include: [
                {
                    model: people,
                    as: "people",
                    attributes: ["username","phone"],
                }
            ],

            order: [["createdAt", "DESC"]],
        })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving User.",
            });
        });
};