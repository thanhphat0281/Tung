const express = require('express');
const router = express.Router();
const rating = require('../../models/D_action/rating');
const userAccount = require('../../models/C_permission/user');
const accountsocials = require('../../models/C_permission/accountsocials');
const cake = require('../../models/A_store/cake');
//rating
//get all
router.get('/', function(req, res) {
    console.log('get request for all ratings');
    rating.find({})
        .exec(function(err, ratings) {
            if (err) {
                console.log("err req ratings");
            } else {
                res.json(ratings);
            }
        });
});

// get a person
router.get('/:ratingID', function(req, res) {
    rating.findById(req.params.ratingID)
        .exec(function(err, ratings) {
            if (err) console.log("Error retrieving rating");
            else res.json(ratings);
        });
})

//post
router.post('/', function(req, res) {
    async function run() {
        const add = await addRate(req)
        const updateRateCake = await UpdateRatingAverageCake(req.body.cakeID)
        res.json(add);

    }
    run()
});
async function addRate(req) {
    var newrating = new rating();
    newrating.cakeID = req.body.cakeID;
    newrating.userID = req.body.userID;
    newrating.star = req.body.star;
    newrating.review = req.body.review;
    newrating.save()
    return newrating;
}


//update
router.put('/:id', function(req, res) {
        async function run() {
            const update = await putRate(req.params.id, req, res)

            res.json(update);
        }
        run();
    })
    //delete
router.delete('/:id', function(req, res) {
    rating.findByIdAndRemove(req.params.id, function(err, deleterating) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
//find all rating by cakeID
router.get('/findcake/:cake_id', function(req, res) {
    rating.find({
            cakeID: req.params.cake_id
        })
        .exec(function(err, ratings) {
            if (err) console.log("Error retrieving rating");
            else
                res.json(ratings);
        });
})

router.post('/RatingCakeByUserID', function(req, res) {
    async function run() {
        const rateFind = await findRatingByUserIDAndCakeID(req, res);

        if (rateFind.length == 0) {
            res.json([{
                _id: "000000000",
                cakeID: req.body.userID,
                userID: req.body.cakeID,
                star: '0',
                review: ''
            }]);
        } else
            res.json(rateFind);
    }
    run();
})
async function findRatingByUserIDAndCakeID(req, res) {

    try {
        const rate = await rating.find({
            userID: req.body.userID,
            cakeID: req.body.cakeID
        });
        // console.log(customerArray)
        return rate;
    } catch (err) {
        return res.status(501).json(err);
    }
};
async function putRate(idRate, req, res) {
    try {

        const rateUpdate = await rating.findByIdAndUpdate(idRate, {
            $set: {
                cakeID: req.body.cakeID,
                userID: req.body.userID,
                star: req.body.star,
                review: req.body.review
            }
        }, {
            new: true
        });
        const updateRateCake = await UpdateRatingAverageCake(req.body.cakeID)
        return rateUpdate;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//update rating by UserID
router.post('/UpdateRating', function(req, res) {
    async function run() {
        const rateFind = await findRatingByUserIDAndCakeID(req, res);
        const update = await putRate(rateFind[0]._id, req, res)

        res.json(update)

    }
    run();
})

//Average Rating By cakeID
router.get('/averageRating/:cake_id', function(req, res) {
    async function run() {
        const listRate = await getRateByCakeID(req, res)
        let total = parseFloat(0)
        for (let index in listRate) {
            total = total + parseFloat(listRate[index].star)
        }
        let average = Math.round(2 * (total / listRate.length)) / 2;
        res.json({ average: average, count: listRate.length })
    }
    run()
})

// async function getRateByCakeID(req, res) {
//     try {
//         console.log(req.params.cake_id)
//         console.log("------------------------")
//         const listRate = await rating.find({
//             cakeID: req.params.cake_id
//         })
//         return listRate
//     } catch (error) {
//         return res.status(501).json(err);
//     }
// }


// lấy các bình luận đánh giá theo cakeID
async function getSosialAccountByOrUserAccountID(req) {
    try {
        const accountUser = await userAccount.findById(req)
        const accountSosial = await accountsocials.findById(req)
        if (accountUser != null) {
            return accountUser
        }
        return accountSosial
    } catch (error) {

    }
}
router.get('/getListRatingAccount/:cake_id', function(req, res) {
    async function run() {

        const listRate = await getRateByCakeID(req.params.cake_id, res);
        // console.log(listRate)
        const listAccountRate = []
        for (var index in listRate) {
            const user = await getSosialAccountByOrUserAccountID(listRate[index].userID)
            listAccountRate.push({ username: user.username, imageUrl: user.imageUrl, star: listRate[index].star, review: listRate[index].review })
        }
        // console.log(listAccountRate)

        res.json(listAccountRate)
    }
    run();
})




//#region //get average Rating
async function UpdateRatingAverageCake(req) {
    try {
        console.log("!@3")
        const testUpdate = await averageRating(req)
        console.log(testUpdate)
        const update = await cake.findByIdAndUpdate(req, {
            $set: {
                rate: testUpdate
            }
        }, {
            new: true
        })
        return update
    } catch (error) {
        console.log(error)
    }
}

async function getRateByCakeID(req) {
    try {
        const listRate = await rating.find({
            cakeID: req
        })
        return listRate
    } catch (error) {

    }
}
async function averageRating(req) {
    const listRate = await getRateByCakeID(req)

    let total = parseFloat(0)
    for (let index in listRate) {
        total = total + parseFloat(listRate[index].star)
    }
    let average = Math.round(2 * (total / listRate.length)) / 2;
    if (listRate.length == 0)
        return { average: 0, count: 0 }
    else
        return { average: average, count: listRate.length }
}

//#endregion
module.exports = router;