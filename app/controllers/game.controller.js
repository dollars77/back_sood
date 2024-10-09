const db = require("../models");
const game = db.game;
const camp = db.camp;

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { Op } = require("sequelize");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    // if uploading resume
    if (file.fieldname === "imagegame") {
      cb(null, "./app/images/game");
    }
  },
  filename: (req, file, cb) => {
    // naming file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // if uploading resume
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"||
    file.mimetype === "image/webp"
  ) {
    // check file type to be pdf, doc, or docx
    cb(null, true);
  } else {
    cb(null, false); // else fails
  }
};

var upload_test = multer({
  storage: fileStorage,
  limits: {
    fileSize: "1048576",
  },
  fileFilter: fileFilter,
}).fields([

  {
    name: "imagegame",
    maxCount: 1,
  },

]);
exports.uploadimage = upload_test;

exports.createGame = async (req, res) => {

  if (req.body == null) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  game
    .findOne({ where: { gamename: req.body.gamename } })
    .then(async (user) => {
      if (user) {
        res.status(400).send({
          status: 400,
          message: "Failed! game is already in use!",
        });
        return;
      }
      var data_camp = {};
      const countgame = await game.count({ where: { campId: req.body.campId } });
      try {
        let sharpInstance = sharp(req.files.imagegame[0].path);

        if (path.extname(req.files.imagegame[0].originalname).toLowerCase() === '.webp') {
          sharpInstance = sharpInstance.webp();

        } else {
          sharpInstance = sharpInstance.png({ quality: 80 });
          await sharpInstance.toFile(
            path.resolve(
              req.files.imagegame[0].destination,
              "resized",
              req.files.imagegame[0].filename
            )
          );
          fs.unlinkSync(req.files.imagegame[0].path);
        }
      } catch (err) { }
      //************************************************************ */

      var imagegametxt = null;

      try {
        if (path.extname(req.files.imagegame[0].originalname).toLowerCase() === '.webp') {
          imagegametxt =
            "app\\images\\game\\" +
            req.files.imagegame[0].filename;
        } else {
          imagegametxt =
            "app\\images\\game\\resized\\" +
            req.files.imagegame[0].filename;
        }
      } catch (err) {
        imagegametxt = null;
      }

      try {
        data_camp = {
          imagegame: imagegametxt,
          gamename: req.body.gamename,
          status: req.body.status,
          cover: req.body.cover,
          order: countgame + 1,
          campId: req.body.campId,
          percent_rtp: req.body.rtp

        };
      } catch (err) { }

      return await game
        .create(data_camp)
        .then(async (data) => {
          res.status(200).send({ status: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            status: 500,
            message:
              err.message || "Some error occurred while creating the camp.",
          });
        });
    });
};

exports.getAllGame = async (req, res) => {

  game
    .findAll({ where: { campId: req.params.id }, order: [["order", "ASC"]], },


    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};
exports.getAllGameUser = async (req, res) => {
  try {
    const checkcount = await camp.count({ where: { id: req.params.id, status: 0 } })
    if (checkcount > 0) {
      res.send([]);
      return;
    }
  } catch (error) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving User.",
    });
  }





  game
    .findAll({ where: { campId: req.params.id }, order: [["order", "ASC"]], },


    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};

exports.updateGame = async (req, res) => {

  try {
    if (req.body.checkimagegame === "true") {
      try {
        // await sharp(req.files.imagegame[0].path)
        //   .jpeg({ quality: 50 })
        //   .toFile(
        //     path.resolve(
        //       req.files.imagegame[0].destination,
        //       "resized",
        //       req.files.imagegame[0].filename
        //     )
        //   );
        // fs.unlinkSync(req.files.imagegame[0].path);


        let sharpInstance = sharp(req.files.imagegame[0].path);

        if (path.extname(req.files.imagegame[0].originalname).toLowerCase() === '.webp') {
          sharpInstance = sharpInstance.webp();

        } else {
          sharpInstance = sharpInstance.png({ quality: 80 });
          await sharpInstance.toFile(
            path.resolve(
              req.files.imagegame[0].destination,
              "resized",
              req.files.imagegame[0].filename
            )
          );
          fs.unlinkSync(req.files.imagegame[0].path);
        }
      } catch (err) { }

      var imagegametxt = null;

      try {
        if (path.extname(req.files.imagegame[0].originalname).toLowerCase() === '.webp') {
          imagegametxt =
            "app\\images\\game\\" +
            req.files.imagegame[0].filename;
        } else {
          imagegametxt =
            "app\\images\\game\\resized\\" +
            req.files.imagegame[0].filename;
        }

      } catch (err) {
        imagegametxt = null;
      }
      await game.update({ imagegame: imagegametxt }, { where: { id: req.body.id } });
      //************************************************************ */
    }

    const data_game = {
      gamename: req.body.gamename,
      status: req.body.status,
      cover: req.body.cover,
      percent_rtp: req.body.rtp
    };

    await game.update(data_game, { where: { id: req.body.id } });


    res.status(200).send({
      message: "Game was updated successfully."
    });
  } catch (e) {
    res.status(500).send({
      message: "Error updating Game "
    });
  }
}

exports.deleteImgGame = async (req, res) => {
  const filePath = req.body.imagegameBackup;

  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    if (req.body.id !== null) {
      await game
        .update(
          { imagegame: null },
          {
            where: { id: req.body.id },
          }
        )
        .then((num) => {
          return res.send({
            message: "ImgGame was updated successfully.",
          });
        })
        .catch((err) => {
          return res.status(500).send({
            message: "Error updating ImgGame ",
          });
        });
    } else {
      res.status(200).send({ status: true });
    }

  });

  return;
};

exports.updateOrderGame = async (req, res) => {
  const game_data = req.body;
  try {
    await game_data.map(async (data) =>
      await game.update(
        { order: data.order },
        {
          where: { id: data.id },

        }
      )
    );
    res.status(200).send({ status: true });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving game_data",
    });
  }

};

exports.deleteGame = (req, res) => {
  const id = req.params.id;

  game
    .destroy({
      where: { id: id },
    })
    .then(() => {
      res.status(200).send({
        message: "game was deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete game",
      });
    });
};