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
    }else if(file.fieldname === "iconcamp"){
      cb(null, "./app/images/camp_icon");
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
    file.mimetype === "image/jpeg" ||
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
    name: "imagecamp",
    maxCount: 1,
  },
  {
    name: "iconcamp",
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


        let sharpInstance = sharp(req.files.imagecamp[0].path);

        if (path.extname(req.files.imagecamp[0].originalname).toLowerCase() === '.webp') {
          sharpInstance = sharpInstance.webp();

        } else {
          sharpInstance = sharpInstance.png({ quality: 80 });
          await sharpInstance.toFile(
            path.resolve(
              req.files.imagecamp[0].destination,
              "resized",
              req.files.imagecamp[0].filename
            )
          );
          fs.unlinkSync(req.files.imagecamp[0].path);
        }
      } catch (err) { }
      //************************************************************ */

      var imagecamptxt = null;

      try {
        if (path.extname(req.files.imagecamp[0].originalname).toLowerCase() === '.webp') {
          imagecamptxt =
            "app\\images\\camp\\" +
            req.files.imagecamp[0].filename;
        } else {
          imagecamptxt =
            "app\\images\\camp\\resized\\" +
            req.files.imagecamp[0].filename;
        }

      } catch (err) {
        imagecamptxt = null;
      }
       //************************************************************ */
      try {


        let sharpInstance = sharp(req.files.iconcamp[0].path).resize(500, 500, {
          fit: 'fill',     // This will maintain aspect ratio and crop if necessary
          position: 'center'
        });

        if (path.extname(req.files.iconcamp[0].originalname).toLowerCase() === '.webp') {
          sharpInstance = sharpInstance.webp();

        } else {
          sharpInstance = sharpInstance.png({ quality: 50 });
          await sharpInstance.toFile(
            path.resolve(
              req.files.iconcamp[0].destination,
              "resized",
              req.files.iconcamp[0].filename
            )
          );
          fs.unlinkSync(req.files.iconcamp[0].path);
        }
      } catch (err) { }
      //************************************************************ */

      var iconcamptxt = null;

      try {
        if (path.extname(req.files.iconcamp[0].originalname).toLowerCase() === '.webp') {
          iconcamptxt =
            "app\\images\\camp_icon\\" +
            req.files.iconcamp[0].filename;
        } else {
          iconcamptxt =
            "app\\images\\camp_icon\\resized\\" +
            req.files.iconcamp[0].filename;
        }

      } catch (err) {
        iconcamptxt = null;
      }
       //************************************************************ */

      try {
        data_camp = {
          imagecamp: imagecamptxt,
          iconcamp:iconcamptxt,
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
        status: 500,
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
      status: 500,
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
        status: 500,
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
    if (req.body.id !== null) {
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
            status: 500,
            message: "Error updating ImgCamp ",
          });
        });
    }else {
      res.status(200).send({ status: true });
  }

  });
  return;
};
exports.deleteIconCamp = async (req, res) => {
  const filePath = req.body.iconcampBackup;

  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    if (req.body.id !== null) {
      await camp
        .update(
          { iconcamp: null },
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
            status: 500,
            message: "Error updating ImgCamp ",
          });
        });
    }else {
      res.status(200).send({ status: true });
  }

  });
  return;
};
exports.updateCamp = async (req, res) => {

  try {
    if (req.body.checkimagecamp === "true") {
      try {
        let sharpInstance = sharp(req.files.imagecamp[0].path);

        if (path.extname(req.files.imagecamp[0].originalname).toLowerCase() === '.webp') {
          sharpInstance = sharpInstance.webp();

        } else {
          sharpInstance = sharpInstance.png({ quality: 80 });
          await sharpInstance.toFile(
            path.resolve(
              req.files.imagecamp[0].destination,
              "resized",
              req.files.imagecamp[0].filename
            )
          );
          fs.unlinkSync(req.files.imagecamp[0].path);
        }
      } catch (err) { }

      var imagecamptxt = null;

      try {
        if (path.extname(req.files.imagecamp[0].originalname).toLowerCase() === '.webp') {
          imagecamptxt =
            "app\\images\\camp\\" +
            req.files.imagecamp[0].filename;
        } else {
          imagecamptxt =
            "app\\images\\camp\\resized\\" +
            req.files.imagecamp[0].filename;
        }

      } catch (err) {
        imagecamptxt = null;
      }
      await camp.update({ imagecamp: imagecamptxt }, { where: { id: req.body.id } });
    }
     //************************************************************ */
    if (req.body.checkiconcamp === "true") {
      try {
        let sharpInstance = sharp(req.files.iconcamp[0].path).resize(500, 500, {
          fit: 'fill',     // This will maintain aspect ratio and crop if necessary
          position: 'center'
        });

        if (path.extname(req.files.iconcamp[0].originalname).toLowerCase() === '.webp') {
          sharpInstance = sharpInstance.webp();

        } else {
          sharpInstance = sharpInstance.png({ quality: 50 });
          await sharpInstance.toFile(
            path.resolve(
              req.files.iconcamp[0].destination,
              "resized",
              req.files.iconcamp[0].filename
            )
          );
          fs.unlinkSync(req.files.iconcamp[0].path);
        }
      } catch (err) { }

      var iconcamptxt = null;

      try {
        if (path.extname(req.files.iconcamp[0].originalname).toLowerCase() === '.webp') {
          iconcamptxt =
            "app\\images\\camp_icon\\" +
            req.files.iconcamp[0].filename;
        } else {
          iconcamptxt =
            "app\\images\\camp_icon\\resized\\" +
            req.files.iconcamp[0].filename;
        }

      } catch (err) {
        iconcamptxt = null;
      }
      await camp.update({ iconcamp: iconcamptxt }, { where: { id: req.body.id } });
     
    }
 //************************************************************ */
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
      status: 500,
      message: "Error updating Camp "
    });
  }
}