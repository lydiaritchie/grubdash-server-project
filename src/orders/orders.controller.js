const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

//check that the orderId exists
function orderExists(req, res, next) {
  const { orderId } = req.params;
  //NEED to find the dish here!
  const foundOrder = orders.find((order) => order.id == orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  return next({
    status: 404,
    message: `The order ${orderId} does not exist.`,
  });
}

function bodyHasData(propertyName) {
  return function (req, res, next) {
    const isFound = req.body.data[propertyName];
    if (isFound) {
      return next();
    }
    next({
      status: 400,
      message: `Request needs to include ${propertyName}`,
    });
  };
}

//check the dishes property is valid
function dishesPropertyIsValid(req, res, next){
    const dishesProperty = req.body.data["dishes"];
    if(Array.isArray(dishesProperty) && dishesProperty.length > 0){
        return next();
    }
    return next({
        status: 400,
        message: `Dishes property must be an array with dish values inside.`
    })
}

//Checks that status is valid -> pending, preparing, out-for-delivery, delivered
function statusPropertyIsValid(req, res, next){
    const statusProperty = req.body.data["status"];
    const statusOptions = [ "pending", "preparing", "out-for-delivery", "delivered"];
    if(statusOptions.includes(statusProperty)){
        return next();
    }
    next({
        status: 400,
        message: `Order must have a status of pending, preparing, out-for-delivery, delivered.`
    })
}

//check the array of dishes inside "dishes"
function dishesArrayisValid(req, res, next){
    const dishes = req.body.data["dishes"];
    //loop through dishes
    dishes.forEach((dish, index) => {
        const quantity = dish.quantity;
        if (quantity === undefined || typeof quantity !== 'number' || quantity === 0 ){
            next({
                status: 400,
                message: `dish ${index} must have a quantity that is an integer greater than 0`
            })
        } 
    });
    return next();
}

//Checks that the :orderId matches with data.id
//If the data.id is missing from the the request body, empty, null, or undefined, it will still be updated
function idMatch(req, res, next){
    const { data } = req.body;
    const { orderId } = req.params;
    //if the orderId exsits, then it should do this: 
        if(data.id && data.id !== orderId){
            next({
                status: 400,
                message: `Order id does not match route id. Order:${data.id}, Route: ${orderId}`
                });
        }
        return next();
    
}

//POST "/orders"
function create(req, res, next) {
  const { deliverTo, mobileNumber, status, dishes } = req.body.data;
  const newOrder = { id: nextId(), deliverTo, mobileNumber, status, dishes };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//GET "/orders/:orderId"
function read(req, res, next) {
  res.status(200).json({ data: res.locals.order });
}

//PUT "/orders/:orderId"
function update(req, res, next){
  const { orderId } = req.params;
  const { deliverTo, mobileNumber, status, dishes } = req.body.data;
  const newOrder = { id: orderId, deliverTo, mobileNumber, status, dishes };

  orders.push(newOrder);
  res.status(200).json({ data: newOrder });
}

//DELETE "/orders/:orderId"
function destroy(req, res, next){
    const order = res.locals.order;

    if(order.status !== "pending"){
        return next({
            status: 400,
            message: `Cannot deleted if the status is not pending.`
        });
    }
    const index = orders.findIndex((currentOrder) => currentOrder.id === order.id);
    console.log("index: " + index);
    orders.splice(index, 1);
    res.sendStatus(204);
}

//GET "/orders"
function list(req, res, next) {
  res.status(200).json({ data: orders });
}

module.exports = {
  list,
  read: [orderExists, read],
  create: [
    bodyHasData("deliverTo"),
    bodyHasData("mobileNumber"),
    bodyHasData("dishes"),
    dishesPropertyIsValid,
    dishesArrayisValid,
    create,
  ],
  update: [
    orderExists,
    idMatch,
    bodyHasData("deliverTo"),
    bodyHasData("mobileNumber"),
    bodyHasData("dishes"),
    bodyHasData("status"),
    dishesPropertyIsValid,
    dishesArrayisValid,
    statusPropertyIsValid,
    update
  ],
  delete: [
    orderExists,
    destroy
  ]
};
