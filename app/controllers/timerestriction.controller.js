const db = require("../models");
const timerestriction = db.timerestriction;
const creditadmin = db.creditadmin;
const people = db.people;

const dayjs = require("dayjs");

exports.createTimebyCamp = async (req, res) => {
    let endSend = dayjs().add(30, 'second');
    try {
        let checkcount = await timerestriction.count({ where: { peopleId: req.body.peopleId, campId: req.body.campId } })
        if (checkcount > 0) {

            let timedata = await timerestriction.findOne({
                attributes: ["id", "endTime", "status"],
                where: { peopleId: req.body.peopleId, campId: req.body.campId },
            });
            timedata = JSON.stringify(timedata);
            timedata = JSON.parse(timedata);

            const now = dayjs();
            const end = dayjs(timedata.endTime);
            const diff = end.diff(now, 'second');

            if (diff <= 0 && timedata.status === 0) {
                await timerestriction.update({
                    status: 1
                }, { where: { id: timedata.id } });
                return res.status(402).json({ status: 402, access: false, useCredit: false }); // หมดเวลาแล้ว
            } else if (diff <= 0 && timedata.status === 1) {
                let peopledata = await people.findOne({
                    attributes: ["id", "credit"],
                    where: { id: req.body.peopleId },
                });
                peopledata = JSON.stringify(peopledata);
                peopledata = JSON.parse(peopledata);
                if (peopledata.credit <= 0) {
                    return res.status(401).json({ status: 401, access: false, useCredit: false }); // เครดิตไม่พอ
                } else {
                    await creditadmin.create({
                        credittype: 2,
                        amount: 1,
                        note: `เข้าค่ายเกม ${req.body.campname} `,
                        preamount: peopledata.credit,
                        peopleId: peopledata.id,
                        userId: 1,
                    });
                    await people.increment("credit", {
                        by: -1,
                        where: { id: req.body.peopleId },
                    });

                    await timerestriction.update({
                        startTime: dayjs(),
                        endTime: dayjs().add(10, 'minute'),// second , minute , day
                        status: 0
                    }, { where: { id: timedata.id } });
                    const Timedata = await timerestriction.findByPk(timedata.id );
                    
                    return res.status(200).json({ access: true, endTime: Timedata.endTime, useCredit: true });
                }
            } else {
                let Timedata = await timerestriction.findOne({
                    attributes: ["id", "endTime"],
                    where: { peopleId: req.body.peopleId, campId: req.body.campId },
                });
                Timedata = JSON.stringify(Timedata);
                Timedata = JSON.parse(Timedata);
                return res.status(200).json({ access: true, endTime: Timedata.endTime, useCredit: false });
            }

        } else {
            let peopledata = await people.findOne({
                attributes: ["id", "credit"],
                where: { id: req.body.peopleId },
            });
            peopledata = JSON.stringify(peopledata);
            peopledata = JSON.parse(peopledata);
            if (peopledata.credit <= 0) {
                return res.status(401).json({ status: 401, access: false, useCredit: false }); // เครดิตไม่พอ
            } else {
                await creditadmin.create({
                    credittype: 2,
                    amount: 1,
                    note: `เข้าค่ายเกม ${req.body.campname} `,
                    preamount: peopledata.credit,
                    peopleId: peopledata.id,
                    userId: 1,
                });
                await people.increment("credit", {
                    by: -1,
                    where: { id: req.body.peopleId },
                });

                const newTime = await timerestriction.create({
                    startTime: dayjs(),
                    endTime: dayjs().add(30, 'second'),// second , minute , day
                    peopleId: req.body.peopleId,
                    campId: req.body.campId,
                });

                return res.status(200).json({ access: true, endTime: newTime.endTime, useCredit: true });
            }
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "Some error occurred while retrieving Exams.",
        });
    }




};