const express = require('express');
const router = express.Router();
const cartCake = require('../../models/D_action/cartCake');
const cake = require('../../models/A_store/cake');
//cartCake
//get all
router.get('/', function(req, res) {
    console.log('get request for all ');
    cartCake.find({})
        .exec(function(err, cartCakes) {
            if (err) {
                console.log("err req cartCakes");
            } else {
                res.json(cartCakes);
            }
        });
});

// get a person
router.get('/:cartCakeID', function(req, res) {
    cartCake.findById(req.params.cartCakeID)
        .exec(function(err, cartCakes) {
            if (err) console.log("Error retrieving cartCake");
            else res.json(cartCakes);
        });
})

//post
router.post('/', function(req, res) {
    var newcartCake = new cartCake();
    newcartCake.userID = req.body.userID;
    newcartCake.cakeID = req.body.cakeID;
    newcartCake.count = req.body.count;
    newcartCake.save(function(err, insertedcartCake) {
        if (err) {
            console.log('Err Saving cartCake');
        } else {
            res.json(insertedcartCake);
        }
    });
});




//delete all by userID
router.delete('/deleteByUserID/:userID', function(req, res) {
    var myquery = { userID: req.params.userID };
    cartCake.deleteMany(myquery, function(err, deletecartCake) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }

    });
});


//Update CartCake
router.post('/updateCartCake', function(req, res) {
    async function run() {
        const CartCake = await getCartCakeByUserIDCakeID(req, res);
        cartCake.findByIdAndUpdate(CartCake[0]._id, {
                $set: {
                    count: req.body.count
                }
            }, {
                new: true
            },
            function(err, updatedcartCake) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedcartCake);
                }
            })
    }
    run();
})

//delete one 
router.post('/deleteOneCartCake', function(req, res) {
    async function run() {
        const CartCake = await getCartCakeByUserIDCakeID(req, res);
        cartCake.findByIdAndRemove(CartCake[0]._id, function(err, deletecartCake) {
            if (err) {
                res.send('err Delete');
            } else {
                res.json({ message: 'Successfully deleted' });
            }
        });
    }
    run();
});
async function getCartCakeByUserIDCakeID(req, res) {
    try {
        const cartCakeArray = await cartCake.find({
            userID: req.body.userID,
            cakeID: req.body.cakeID
        });
        return cartCakeArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
// get all cartcake by userID
router.get('/getAllCartCakeByUserID/:userID', function(req, res) {
    async function run() {

        const CartCake = await getAllCartCakeByUserID(req.params.userID, res);

        let cartCakeArray = []
        for (let index = 0; index < CartCake.length; index++) {
            const cake = await getCakeByBooID(CartCake[index].cakeID, res);
            //console.log(cartCakeArray);
            // cake["count"] = CartCake[index].count;    
            var cake_add = {
                _id: cake._id,
                nameCake: cake.nameCake,
                categoryID: cake.categoryID,
                priceCake: cake.priceCake,
                detailCake: cake.detailCake,
                imgCake: cake.imgCake,
                sale: cake.sale,
                count: CartCake[index].count,
                quantity: cake.quantity,
                rate: cake.rate
            };
            cartCakeArray.push(cake_add);
        }
        res.json(cartCakeArray);
        //console.log(cartCakeArray);
    }
    run();
})
async function getAllCartCakeByUserID(req, res) {
    try {
        const cartCakeArray = await cartCake.find({
            userID: req
        });
        return cartCakeArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getCakeByBooID(req, res) {
    try {
        const cakeArray = await cake.findById(req);
        return cakeArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}

module.exports = router;