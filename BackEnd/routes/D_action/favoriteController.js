const express = require('express');
const router = express.Router();
const favorite = require('../../models/D_action/favorite');
const cake = require('../../models/A_store/cake')
    //favorite
    //get all
router.get('/', function(req, res) {
    console.log('get request for all favorites');
    favorite.find({})
        .exec(function(err, favorites) {
            if (err) {
                console.log("err req favorites");
            } else {
                res.json(favorites);
            }
        });
});
// get a person
router.get('/:favoriteID', function(req, res) {
    favorite.findById(req.params.favoriteID)
        .exec(function(err, favorites) {
            if (err) console.log("Error retrieving favorite");
            else res.json(favorites);
        });
})



//update
router.put('/:id', function(req, res) {
        favorite.findByIdAndUpdate(req.params.id, {
                $set: {
                    cakeID: req.body.cakeID,
                    userID: req.body.userID,

                }
            }, {
                new: true
            },
            function(err, updatedfavorite) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedfavorite);
                }
            })
    })
    //delete
router.get('/getAllByUserID/:id', function(req, res) {
    async function run() {
        const listFavorite = await getAllFavoriteByUserID(req.params.id)
        res.json(listFavorite)
    }
    run()
});

async function getCakeByListID(req) {
    try {
        var listCake = []
        for (let index in req) {

            const aCake = await cake.findById(req[index].cakeID)
            listCake.push(aCake)
        }

        return listCake
    } catch (error) {

    }
}
router.get('/getAllCakeByUserID/:id', function(req, res) {
    async function run() {
        const listFavorite = await getAllFavoriteByUserID(req.params.id)
        const listCakeFavorite = await getCakeByListID(listFavorite)
        res.json(listCakeFavorite)
    }
    run()
});




//add-or-delete favorite by userID and CakeID
//post
router.post('/', function(req, res) {
    async function run() {

        const aFavorite = await findFavoriteByCakeIDUserID(req, res)

        if (aFavorite.length == 0) {
            //post
            const newFavorite = await postFavorite(req, res)
            const setUpFavorite = await getAllFavoriteByUserID(req.body.userID)
            res.json(setUpFavorite)
        }
        //delete
        else {
            const delFavorite = await deleteFavorite(aFavorite[0]._id)
            const setUpFavorite = await getAllFavoriteByUserID(req.body.userID)
            res.json(setUpFavorite)
        }

    }
    run()
});

async function findFavoriteByCakeIDUserID(req, res) {
    try {
        const aFavorite = await favorite.find({
            userID: req.body.userID,
            cakeID: req.body.cakeID
        })
        return aFavorite
    } catch (error) {

    }
}
async function postFavorite(req, res) {
    try {
        var newfavorite = new favorite();
        newfavorite.cakeID = req.body.cakeID;
        newfavorite.userID = req.body.userID;

        const aFavorite = await newfavorite.save()
        return aFavorite
    } catch (error) {

    }
}
async function deleteFavorite(id, res) {
    try {

        const deleteFavorite = await favorite.findByIdAndRemove(id)
        return deleteFavorite
    } catch (error) {

    }
}
async function getAllFavoriteByUserID(id, res) {
    try {
        const listFavorite = await favorite.find({
            userID: id
        })
        return listFavorite
    } catch (error) {

    }
}

module.exports = router;