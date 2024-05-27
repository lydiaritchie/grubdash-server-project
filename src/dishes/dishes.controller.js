const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//POST validations
function bodyDataHas(propertyName){
    return function (req, res, next) {
        const { data = {} } = req.body;
        if(data[propertyName] || data[propertyName]===0){
            return next();
        }
        next({
            status: 400,
            message: `Must include a ${propertyName}`
        });
    };
}

function pricePropertyIsValid(req, res, next){
    const { data: {price} } = req.body;
    if(Number.isInteger(price) && price > 0){
        return next();
    }
    next({
        status: 400,
        message: `price must have an integer greater than 0`
    });
}
 
function dishExists(req, res, next){
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id == dishId);
    if(foundDish){
        res.locals.dish = foundDish;
        next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}, ${foundDish}`
    });
}

function idMatchesRoute(req, res, next){
    const { dishId } = req.params;
    const { data: id } = req.body;
    if(id && dishId !== id){
        return next({
            status: 404,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        });
    }
    next();
}

//POST "/dishes"
function create(req, res, next){
    const { data: {name, description, price, image_url}} = req.body;
    const newDish = {
        "id": nextId(),
        name,
        description,
        price,
        image_url
    };
    dishes.push(newDish);
    res.status(201).json({data: newDish});
}

//GET "/dishes" list function
function list(req, res){
    res.json({data: dishes});
}

//GET "/dishes/:dishId" read function
function read(req, res, next){
    res.json({data: res.locals.dish});
}

//PUT "/dishes/:dishId"

module.exports = {
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        pricePropertyIsValid,
        create
    ],
    list,
    read: [
        idMatchesRoute,
        dishExists,
        read
    ]
}
