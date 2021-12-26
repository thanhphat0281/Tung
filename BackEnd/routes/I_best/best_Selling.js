const express = require('express');
const router = express.Router();
const order = require('../../models/E_payment/order');
const orderDetail = require('../../models/E_payment/orderDetail');
const cake = require('../../models/A_store/cake');
const acountSocial = require('../../models/C_permission/accountsocials');
const user = require('../../models/C_permission/user');
const customer = require('../../models/B_profile/customer');
const categoryModel = require('../../models/A_store/category');
const category = require('../../models/A_store/category');
const datasetRecommend = require('../../models/D_action/datasetRecommend')
async function getAllDataRecommendr(req, res) {
    try {
        const DataCake = await datasetRecommend.find({});
        return DataCake;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getAllCake(req, res) {
    try {
        const DataCake = await cake.find({});
        return DataCake;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getAllDataRecommendByUserID(req, res) {
    try {
        const DataCake = await datasetRecommend.find({ userID: req });
        return DataCake;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function CountDataBuy(DataCake, aData, cakeID) {
    let isExist1 = (DataCake2, aData2, cakeID2) => {
        for (var key in DataCake2) {
            if (DataCake2[key].cakeID == cakeID2) {
                DataCake2[key].count += aData2.buy;
                return DataCake2;
            }
        }
        var dataReturn = {}
        dataReturn = { "cakeID": cakeID2, "count": aData2.buy }
        DataCake2.push(dataReturn);
        return DataCake2;

    }

    return isExist1(DataCake, aData, cakeID);
}

async function getAllOrder(req, res) {
    try {
        const orderArray = await order.find({});
        return orderArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getOrderDetailByOrderID(req, res) {
    try {
        const orderDetailArray = await orderDetail.find({
            orderID: req
        });
        return orderDetailArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get cake by ID
async function getCakeByCakeID(req, res) {
    try {
        const aCake = await cake.findById(req);
        return aCake;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getCategoryByID(req, res) {
    try {
        const aCategory = await category.findById(req);

        return aCategory;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get cake by CategoryID
async function getCakeByCategoryID(req, res) {
    try {
        const aCake = await cake.find({ categoryID: req });
        return aCake;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//get userID by f ID
async function getUserIDByCusID(req, res) {
    try {
        const aUser = await customer.findById(req);
        return aUser;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//Đếm sp trong từng OrderDetail của User
async function CreateDataCakeCount(data, orderDetail, cake) {
    let isExist1 = (data2, orderDetailCheck, cakeCake) => {
        for (var key in data2) {

            if (data2[key].cakeID == cakeCake) {
                data2[key].count += orderDetailCheck.count;
                return data2;
            }

        }
        var dataReturn = {}
        dataReturn = { "cakeID": cakeCake, "count": orderDetailCheck.count }
        data2.push(dataReturn);
        return data2;
    }
    return isExist1(data, orderDetail, cake);
}
async function CreateDataCakeCountCategory(data) {

    var dataCategory = []

    for (var key in data) {
        let temp = 0;
        console.log("data: "+ data)
        console.log("data.cakeID: "+ data[key].cakeID)
        let aCake = await cake.findById(data[key].cakeID);
        console.log("aCake"+ aCake)
        for (var key2 in dataCategory) {
            if (dataCategory[key2].categoryID == aCake.categoryID) {
                dataCategory[key2].count += data[key].count
                temp = 1;
                break
            }
        }
        if (temp == 1) continue
        var dataReturn = {}
        dataReturn = { "categoryID": aCake.categoryID, "count": data[key].count }
        dataCategory.push(dataReturn);
    }
    console.log("datacategory:"+dataCategory)
    return dataCategory;

}
async function CreateDataCakeCountCategoryAndAuthor(data, res) {

    var dataCategory = []
    for (var key in data) {
        let temp = 0;

        let aCake = await cake.findById(data[key].cakeID);

        for (var key2 in dataCategory) {
            if (dataCategory[key2].categoryID == aCake.categoryID) {
                dataCategory[key2].count += data[key].count
                temp = temp +2;
                break
            }
        }
        if (temp == 3) continue
        if (temp == 1 || temp == 0) {
            var dataCategoryReturn = {}
            dataCategoryReturn = { "categoryID": aCake.categoryID, "count": data[key].count }
            dataCategory.push(dataCategoryReturn);
        }
    }

    //sort
    dataCategory.sort(function(a, b) {
        return b.count - a.count;
    });

    return ({ dataCategory});
}

async function CreateDataCategoryCount(data2, AData2, categoryID2, res) {
    for (var key in data2) {
        if (data2[key].categoryID == (categoryID2)) {
            data2[key].count += AData2.buy;
            return data2;
        }
    }
    var dataReturn = {}
    const aCategory = await getCategoryByID(categoryID2, res)
    dataReturn = { "categoryID": categoryID2, "categoryName": aCategory.nameCategory, "count": AData2.buy }
    data2.push(dataReturn);
    return data2;
}

async function getCategoryCakeByCakeID(req, res) {
    try {
        const aCake = await cake.findById(req);
        const category = await categoryModel.findById(aCake.categoryID);
        return category;
    } catch (err) {
        return res.status(501).json(err);
    }
}

async function CustomRateOnCake(AllCake) {
    var listData = []
    for (var key of AllCake) {
        var dataReturn = {}
        dataReturn = { "cakeID": key._id, "totalRate": key["rate"].average * key["rate"].count }
        listData.push(dataReturn);
    }
    listData.sort(function(a, b) {
        return b.totalRate - a.totalRate;
    });

    return listData;
}


//Show sách bán chạy nhất 2
router.get('/Cake', function(req, res) {
        async function run() {
            let CakeList = []
            let CategoryList = []
            let DataCake = []
            let DataCategory = []
            const Data = await getAllDataRecommendr(req, res);
            for (var index in Data) {
                DataCake = await CountDataBuy(DataCake, Data[index], Data[index].cakeID)
            }
            console.log("DataCake:"+ DataCake)
            console.log("DataCake.ID:"+ DataCake.cakeID )
            DataCategory = await CreateDataCakeCountCategory(DataCake)
            DataCake.sort(function(a, b) {
                return b.count - a.count;
            });
            DataCategory.sort(function(a, b) {
                return b.count - a.count;
            });
            //get cake by Datacake
            for (var index in DataCake) {
                if (index > 10) {
                    break;
                }
                // console.log(DataCake[index].cakeID)
                const acake = await getCakeByCakeID(DataCake[index].cakeID, res);
                // console.log(acake)
                CakeList.push(acake);
            }
            for (var index in DataCategory) {
                if (index > 2) {
                    break;
                }
                // console.log(DataCake[index].cakeID)
                const aCategory = await getCategoryByID(DataCategory[index].categoryID, res);
                // console.log(acake)
                CategoryList.push(aCategory);
            }


            // id user
            res.json([CategoryList, CakeList]);
        }
        run();
    })

router.get('/Top10', function(req, res) {
    async function run() {
        let CategoryList = []
        let DataCake = []
        let DataCategoryAndAuthor = []
        const Data = await getAllDataRecommendr(req, res);
        for (var index in Data) {
            DataCake = await CountDataBuy(DataCake, Data[index], Data[index].cakeID)
        }
        DataCategoryAndAuthor = await CreateDataCakeCountCategoryAndAuthor(DataCake, res)
            // id user
        for (var index in DataCategoryAndAuthor["dataCategory"]) {
            if (index >= 10) {
                break;
            }
            const aCategory = await getCategoryByID(DataCategoryAndAuthor["dataCategory"][index].categoryID, res);
            CategoryList.push(aCategory);
        }

     
        res.json( CategoryList );
        console.log("CategoryList:"+ CategoryList)
    }
    run();
})




router.get('/getSomeNewSomeBuySomeRateBest', function(req, res) {
    async function run() {
        let DataCakeBuyMost = []
        let CakeListBuyMost = []
        let CakeListNew = []
        let DataCakeRateMost = []
        let DataListRateMost = []
        const Data = await getAllDataRecommendr(req, res);
        const AllCake = await getAllCake(req, res);
        //1
        for (var index in Data) {
            DataCakeBuyMost = await CountDataBuy(DataCakeBuyMost, Data[index], Data[index].cakeID)
        }
        DataCakeBuyMost.sort(function(a, b) {
            return b.count - a.count;
        });
        for (var index in DataCakeBuyMost) {
            if (index >= 5) {
                break;
            }
            // console.log(DataCake[index].cakeID)
            const acake = await getCakeByCakeID(DataCakeBuyMost[index].cakeID, res);
            // console.log(acake)
            CakeListBuyMost.push(acake);
        }
        //2,3 //get all cake --> rate and new 
        for (let index of[AllCake.length - 1, AllCake.length - 2, AllCake.length - 3, AllCake.length - 4, AllCake.length - 5]) {
            // const acake = await getCakeByCakeID(AllCake[index].cakeID, res);
            console.log(index)
            CakeListNew.push(AllCake[index]);
        }
        //rate

        DataCakeRateMost = await CustomRateOnCake(AllCake)
        for (var index in DataCakeRateMost) {
            if (index >= 5) {
                break;
            }
            const acake = await getCakeByCakeID(DataCakeRateMost[index].cakeID, res);
            // console.log(acake)
            DataListRateMost.push(acake);
        }
        res.json({ CakeListNew, CakeListBuyMost, DataListRateMost })
        console.log("CakeListNew:"+CakeListNew)
    }
    run();
})


//show những sản phẩm người dùng mua nhiều nhất trong thể loại (theo userID --> phai dang nhap)
router.get('/CakeByCategory/:UserID', function(req, res) {
    async function run() {
        let CakeList = []
        let DataCake = []
        const dataUser = await getAllDataRecommendByUserID(req.params.UserID)
        for (var index in dataUser) {
            DataCake = await CreateDataCategoryCount(DataCake, dataUser[index], dataUser[index].categoryID, res)
        }
        // console.log(DataCake)
        DataCake.sort(function(a, b) {
            return b.count - a.count;
        });
        //get cake by Datacake
        for (var index in DataCake) {
            if (index > 1) {
                break;
            }
            const acake = await getCakeByCategoryID(DataCake[index].categoryID, res);
            //set key Object
            const categoryName = DataCake[index].categoryName;
            var obj = {};
            obj[categoryName] = acake;
            CakeList.push(obj);
            // số lượng category muon
        }
        // id user
        res.json(CakeList);
    }
    run();
})







 
module.exports = router;