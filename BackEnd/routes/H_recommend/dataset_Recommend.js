const express = require('express');
const router = express.Router();
const datasetRecommend = require('../../models/D_action/datasetRecommend');
const cake = require('../../models/A_store/cake')
    //datasetRecommend
    //get all
router.get('/', function(req, res) {
    console.log('get request for all datasetRecommends');
    datasetRecommend.find({})
        .exec(function(err, datasetRecommends) {
            if (err) {
                console.log("err req datasetRecommends");
            } else {
                res.json(datasetRecommends);
            }
        });
});

//get by userID && cakeID
async function getDatasetByUserIDAndCakeID(req, res) {
    try {
        const getData = await datasetRecommend.find({
            cakeID: req.body.cakeID,
            userID: req.body.userID
        })
        return getData;
    } catch (error) {
        return res.status(501).json(err);
    }
}
//thêm hoặc update 
async function postDataset(req, res) {
    try {
        var newdataset = new datasetRecommend();
        newdataset.cakeID = req.body.cakeID;
        newdataset.userID = req.body.userID;
        newdataset.rate = req.body.rate;
        newdataset.buy = req.body.buy;
        newdataset.click = req.body.click;

        newdataset.categoryID = req.body.categoryID;
        newdataset.priceCake = req.body.priceCake;
        newdataset.sale = req.body.sale;
        const newdata = await newdataset.save();
        return newdata;
    } catch (error) {
        return res.status(501).json(err);
    }
}
async function putDataset(req, res, id) {
    try {
        console.log(req.body)
        var updateDataset = await datasetRecommend.findByIdAndUpdate(id, {
            $set: {
                cakeID: req.body.cakeID,
                userID: req.body.userID,
                rate: req.body.rate,
                buy: req.body.buy,
                click: req.body.click,
            }
        }, {
            new: true
        })
        return updateDataset;
    } catch (error) {
        return res.status(501).json(err);
    }
}
async function getCakeByID(req, res) {
    try {
        const aCake = await cake.findById(req.body.cakeID)
        return aCake
    } catch (error) {

    }
}
//post
router.post('/', function(req, res) {
    async function run() {

        const CheckData = await getDatasetByUserIDAndCakeID(req, res)
        if (CheckData.length == 0) {
            const aCake = await getCakeByID(req, res)
            console.log((aCake.priceCake))
            req.body.categoryID = aCake.categoryID
            req.body.priceCake = aCake.priceCake
            req.body.sale = aCake.sale
            console.log(req.body)
            const newData = await postDataset(req, res)
            res.json(newData)
        } else {

            //Cộng dồn các thuộc tính
            req.body.click = parseInt(CheckData[0].click) + parseInt(req.body.click)
            req.body.buy = parseInt(CheckData[0].buy) + parseInt(req.body.buy)
                //riêng rate chỉ update không cộng dồn
            if (req.body.rate == 0) { req.body.rate = parseFloat(CheckData[0].rate) }


            const updateData = await putDataset(req, res, CheckData[0]._id)
            res.json(updateData)
        }

    }
    run()
});

module.exports = router;