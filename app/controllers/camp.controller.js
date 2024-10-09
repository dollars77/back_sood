const db = require("../models");
const camp = db.camp;
const game = db.game;

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { Op } = require("sequelize");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    // if uploading resume
    if (file.fieldname === "imagecamp") {
      cb(null, "./app/images/camp");
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
    file.mimetype === "image/jpeg"
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
    name: "imagecamp",
    maxCount: 1,
  },

]);
exports.uploadimage = upload_test;


exports.createCamp = async (req, res) => {

  if (req.body == null) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  camp
    .findOne({ where: { campname: req.body.campname } })
    .then(async (user) => {
      if (user) {
        res.status(400).send({
          status: 400,
          message: "Failed! campname is already in use!",
        });
        return;
      }
      var data_camp = {};
      const countcamp = await camp.count();
      try {
        await sharp(req.files.imagecamp[0].path)
          // .resize(400, 400)
          .webp({ quality: 100 })
          .toFile(
            path.resolve(
              req.files.imagecamp[0].destination,
              "resized",
              req.files.imagecamp[0].filename
            )
          );
        fs.unlinkSync(req.files.imagecamp[0].path);
      } catch (err) { }
      //************************************************************ */

      var imagecamptxt = null;

      try {
        imagecamptxt =
          "app\\images\\camp\\resized\\" +
          req.files.imagecamp[0].filename;
      } catch (err) {
        imagecamptxt = null;
      }

      try {
        data_camp = {
          imagecamp: imagecamptxt,
          campname: req.body.campname,
          status: req.body.status,
          order: countcamp + 1,


        };
      } catch (err) { }

      return await camp
        .create(data_camp)
        .then(async (data) => {
          res.status(200).send({ status: true, id: data.id });
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

exports.getAllCamp = async (req, res) => {

  camp
    .findAll({
      include: [
        {
          model: game,
          as: "games",
          attributes: ["order"],
        },
      ],
      order: [["order", "ASC"]],
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
exports.getOneCamp = async (req, res) => {

  camp
    .findOne(
      { where: { id: req.params.id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};
exports.updateOrderCamp = async (req, res) => {
  const camp_data = req.body;
  try {
    await camp_data.map(async (data) =>
      await camp.update(
        { order: data.order },
        {
          where: { id: data.id },

        }
      )
    );
    res.status(200).send({ status: true });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving camp_data.",
    });
  }

};

exports.deleteCamp = (req, res) => {
  const id = req.params.id;

  camp
    .destroy({
      where: { id: id },
    })
    .then(() => {
      res.status(200).send({
        message: "Camp was deleted successfully!",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Camp",
      });
    });
};
exports.deleteImgCamp = async (req, res) => {
  const filePath = req.body.imagecampBackup;

  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    if(req.body.id!==null){
      await camp
      .update(
        { imagecamp: null },
        {
          where: { id: req.body.id },
        }
      )
      .then((num) => {
        return res.send({
          message: "ImgCamp was updated successfully.",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error updating ImgCamp ",
        });
      });
    }
    return res.send({
      message: "ImgCamp was updated successfully.",
    });
  });

  return;
};
exports.updateCamp = async (req, res) => {

  try {
    if (req.body.checkimagecamp === "true") {
      try {
        await sharp(req.files.imagecamp[0].path)
          .jpeg({ quality: 50 })
          .toFile(
            path.resolve(
              req.files.imagecamp[0].destination,
              "resized",
              req.files.imagecamp[0].filename
            )
          );
        fs.unlinkSync(req.files.imagecamp[0].path);
      } catch (err) { }

      var imagecamptxt = null;

      try {
        imagecamptxt =
          "app\\images\\camp\\resized\\" +
          req.files.imagecamp[0].filename;
      } catch (err) {
        imagecamptxt = null;
      }
      await camp.update({ imagecamp: imagecamptxt }, { where: { id: req.body.id } });
      //************************************************************ */
    }

    const data_camp = {
      campname: req.body.campname,
      status: req.body.status,
    };

    await camp.update(data_camp, { where: { id: req.body.id } });


    res.status(200).send({
      message: "Camp was updated successfully."
    });
  } catch (e) {
    res.status(500).send({
      message: "Error updating Camp "
    });
  }
}