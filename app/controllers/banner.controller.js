const db = require("../models");
const banner = db.banner;


const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { Op } = require("sequelize");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // setting destination of uploading files
        // if uploading resume
        if (file.fieldname === "imagebanner") {
            cb(null, "./app/images/banner");
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
        name: "imagebanner",
        maxCount: 1,
    },

]);
exports.uploadimage = upload_test;

exports.createBannerheader = async (req, res) => {
    let data_banner = {};
    // const countBanner = await banner.count({ where: { type: 1,language: req.body.language} });
    const countBanner = await banner.count();
    try {
        let sharpInstance = sharp(req.files.imagebanner[0].path);

        if (path.extname(req.files.imagebanner[0].originalname).toLowerCase() === '.webp') {
            sharpInstance = sharpInstance.webp();

        } else {
            sharpInstance = sharpInstance.png({ quality: 50 });
            await sharpInstance.toFile(
                path.resolve(
                    req.files.imagebanner[0].destination,
                    "resized",
                    req.files.imagebanner[0].filename
                )
            );
            fs.unlinkSync(req.files.imagebanner[0].path);
        }



    } catch (err) { }
    //************************************************************ */

    var imagebannertxt = null;

    try {
        if (path.extname(req.files.imagebanner[0].originalname).toLowerCase() === '.webp') {
            imagebannertxt =
            "app\\images\\banner\\" +
            req.files.imagebanner[0].filename;
        } else {
            imagebannertxt =
                "app\\images\\banner\\resized\\" +
                req.files.imagebanner[0].filename;
        }

    } catch (err) {
        imagebannertxt = null;
    }

    try {
        data_banner = {
            imagebanner: imagebannertxt,
            type: req.body.type,
            language: req.body.language,
            order: countBanner + 1,


        };
    } catch (err) { }

    return await banner
        .create(data_banner)
        .then(async (data) => {
            res.status(200).send({ status: true, id: data.id });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                status: 500,
                message:
                    err.message || "Some error occurred while creating the Banner.",
            });
        });

};

exports.getAllBannerByType = async (req, res) => {
    banner
        .findAll({ where: { type: req.params.type }, order: [["order", "ASC"]], },
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
exports.getAllBanner = async (req, res) => {
    banner
        .findAll({ order: [["type", "ASC"], ["order", "ASC"]], },
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

exports.deleteImgBanner = async (req, res) => {
    const filePath = req.body.imagebannerBackup;

    fs.unlink(filePath, async (err) => {
        if (err) {
            res.status(400).send({
                message: "Content can not be empty!",
            });
            return;
        }
        if (req.body.id !== null) {
            await banner
                .update(
                    { imagebanner: null },
                    {
                        where: { id: req.body.id },
                    }
                )
                .then((num) => {
                    return res.send({
                        message: "Imgbanner was updated successfully.",
                    });
                })
                .catch((err) => {
                    return res.status(500).send({
                        message: "Error updating Imgbanner ",
                    });
                });
        } else {
            res.status(200).send({ status: true });
        }

    });

    return;
};

exports.deleteBanner = (req, res) => {
    const id = req.params.id;

    banner
        .destroy({
            where: { id: id },
        })
        .then(() => {
            res.status(200).send({
                message: "banner was deleted successfully!",
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete banner",
            });
        });
};
exports.updateOrderBanner = async (req, res) => {
    const banner_data = req.body;
    try {
        await banner_data.map(async (data) =>
            await banner.update(
                { order: data.order },
                {
                    where: { id: data.id },

                }
            )
        );
        res.status(200).send({ status: true });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving banner_data.",
        });
    }

};

exports.getAllBannerByTypeAndLanguage = async (req, res) => {
    banner
        .findAll({ where: { type: req.params.type, language: req.params.language }, order: [["order", "ASC"]], },
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

