// Index
// Implement a route /toys (in GET, by default) that returns a list of all toys.

// With the data that's inside the data.js file, you should get:

// $> curl http://127.0.0.1:3000/toys
// [
//     {"category_id":0,"description":"Famous video game platform","name":"Playstation 4","price":499},
//     {"category_id":null,"description":"Pink doll","name":"Barbie","price":29.99},
//     {"category_id":1,"description":"Board game $$$","name":"Monopoly","price":59.99},
//     {"category_id":2,"description":"A ball to play outside","name":"Football ball","price":25},
//     {"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}
// ]
// $>
// (I have added newlines for clarity, but everything will be on the same line in your own output.)

// Show
// Implement a route /toys/<toy_id> that returns the details of a given toy.

// If the toy doesn't exist, your API will return a 404 error.

// Example with the data provided in data.js:

// $> curl http://127.0.0.1:3000/toys/0
// {"category_id":0,"description":"Famous video game platform","name":"Playstation 4","price":499}
// $> curl http://127.0.0.1:3000/toys/2
// {"category_id":1,"description":"Board game $$$","name":"Monopoly","price":59.99}
// $> curl http://127.0.0.1:3000/toys/7
// Not Found


// Create
// Implement a route /toys in POST that creates a new toy (by adding it to the toys list) and returns this newly created toy.

// Because our data is "hard-coded" into our program, any change to the data is just temporary. If you restart the server, you lose all changes and go back to what was 
// initially in the toys variable. Your changes are not persistent across reboots.
// (And that is why we will use databases later on: to make the data persistent.)

// To create a toy, you need all its attributes. So you need to check that the data provided in POST has them all: name, description, price and category_id.

// If one of the attributes is missing, your API will return a 422 error.

// Example with the data provided in data.js:

// $> curl http://127.0.0.1:3000/toys/5
// Not Found
// $> curl -d "name=Minesweeper&description=Home computer classic&price=0&category_id=0" -X POST http://127.0.0.1:3000/toys
// {"category_id":0,"description":"Home computer classic","name":"Minesweeper","price":0}
// $> curl http://127.0.0.1:3000/toys/5
// {"category_id":0,"description":"Home computer classic","name":"Minesweeper","price":0}
// $> curl -d "name=Mario&description=Plumber Guy&price=100" -X POST http://127.0.0.1:3000/toys
// Unprocessable Entity
// $>

// Update
// Implement a route /toys/<toy_id> in PUT that updates a given toy and returns the details of the updated toy.

// If an attribute is not provided in the request data, it means you should keep the original value.

// Example with the data provided in data.js:

// $> curl http://127.0.0.1:3000/toys/4
// {"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}
// $> curl -d "name=Checkers" -X PUT http://127.0.0.1:3000/toys/4
// {"category_id":1,"description":"Board game for smart children","name":"Checkers","price":25}
// $> curl http://127.0.0.1:3000/toys/4
// {"category_id":1,"description":"Board game for smart children","name":"Checkers","price":25}
// $>

// Delete
// Implement a route /toys/<toy_id> in DELETE that deletes a given toy and returns the details of the deleted toy.

// Example:

// $> curl http://127.0.0.1:3000/toys/4
// {"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}
// $> curl -X DELETE http://127.0.0.1:3000/toys/4
// {"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}
// $> curl http://127.0.0.1:3000/toys/4
// Not Found
// $>
// Don't forget
// For all routes, remember to send your data as JSON with res.json, and to return a 404 error when a request asks for a resource that doesn't exist.

// Git instructions
// File name	app.js


const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const {toys, categories} = require("./data.js")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


// Toys CRUD operations

// get all toys
app.get("/toys", (req, res) => {
    res.send(toys)
})

// get toy by id
app.get("/toys/:toyId", checkValidId, (req, res) => {

    res.send(toys[req.params.toyId])
})

// post a new toy
app.post("/toys", checkToyAttributes, (req, res) => {
    toys.push(req.body);
    toys[toys.length - 1].category_id = parseInt(toys[toys.length - 1].category_id)              // parsed price and category_id into int values 
    toys[toys.length - 1].price = parseInt(toys[toys.length - 1].price)
    res.send(toys[toys.length - 1]);
}) 

// update a toy 
app.put("/toys/:toyId", checkValidId, (req, res) => {
   
    for(const key of Object.keys(toys[req.params.toyId])){
        if(req.body[key]){
            toys[req.params.toyId][key] = isNaN(parseInt(req.body[key])) ? req.body[key] : parseInt(req.body[key]);               // parsed price and category_id into int values
        }
    }

    res.send(toys[req.params.toyId])
})


// delete a toy
app.delete("/toys/:toyId", checkValidId, (req, res) => {
    
    const deletedToys = toys.splice(req.params.toyId, 1)
    res.send(deletedToys[0])
})


// Index
// Implement a route /categories that returns a list of all categories.

// get all categories
app.get("/categories", (req, res) => {
    res.send(categories)
})
// With the data that's inside the data.js file, you should get:
// $> curl http://127.0.0.1:3000/categories
// [{"name":"Videogames"},{"name":"Boardgames"},{"name":"Outdoor"}]
// $>

// Show
// Implement a route /categories/<category_id> that returns the details of a given category.

// If the category doesn't exist, your API will return a 404 error.

// get a category by id
app.get("/categories/:categoryId", checkValidId, (req, res) => {
    res.send(categories[req.params.categoryId])
})

// Example with the data provided in data.js:

// $> curl http://127.0.0.1:3000/categories/0
// {"name":"Videogames"}
// $>


// Create
// Implement a route /categories in POST that creates a new category (by adding it to the categories list) and returns this newly created category.

// To create a category, you need its name. So you need to check that the data provided in POST has it.

// If the attribute is missing, your API will return a 422 error.

// create a new category
app.post("/categories", checkCategoryAttributes, (req, res) => {
    categories.push(req.body);
    res.send(categories[categories.length - 1])
})

// Example with the data provided in data.js:

// $> curl -d "name=Water Games" -X POST  http://127.0.0.1:3000/categories
// {"name":"Water Games"}
// $> curl http://127.0.0.1:3000/categories
// [{"name":"Videogames"},{"name":"Boardgames"},{"name":"Outdoor"},{"name":"Water Games"}]
// $>


// Update
// Implement a route /categories/<category_id> in PUT that updates a given category and returns the details of the updated category.

// If the correct attribute is not provided in the request data, it means you should keep the original value.

// update a categry
app.put("/categories/:categoryId", checkValidId, (req, res) => {

    if(req.body.name){
        categories[req.params.categoryId].name = req.body.name
    }

    res.send(categories[req.params.categoryId])
})

// Example:

// $> curl -d "name=Old School Games" -X PUT http://127.0.0.1:3000/categories/1
// {"name":"Old School Games"}
// $> curl http://127.0.0.1:3000/categories
// [{"name":"Videogames"},{"name":"Old School Games"},{"name":"Outdoor"},{"name":"Water Games"}]
// $>

// Delete
// Implement a route /categories/<category_id> in DELETE that deletes a given category and returns the details of the deleted category.

// delete a category
app.delete("/categories/:categoryId", checkValidId, (req, res) => {
    const deletedCategory = categories.splice(req.params.categoryId, 1)
    res.send(deletedCategory[0])
})

// Example:

// $> curl -X DELETE http://127.0.0.1:3000/categories/3
// {"name":"Water Games"}
// $> curl http://127.0.0.1:3000/categories
// [{"name":"Videogames"},{"name":"Old School Games"},{"name":"Outdoor"}]
// $>


// Additional route
// Finally, you will add a route for /categories/<name>/toys that returns all the toys of a given category.

// return all toys of given category
app.get("/categories/:categoryName/toys", checkValidCategoryName, (req, res) => {
    let index = -1;
    const toysOfCategory = [];

    for(const category of categories) {
        if(category.name === req.params.categoryName){
            index = categories.indexOf(category)
            break;
        }
    }

    for(const toy of toys) {
        if(toy.category_id === index){
            toysOfCategory.push(toy)
        }
    }

    res.send(toysOfCategory)
})

// As usual, if the specified category doesn't exist, your API will return a 404.

// $> curl http://127.0.0.1:3000/categories/Boardgames/toys
// [{"category_id":1,"description":"Board game $$$","name":"Monopoly","price":59.99},{"category_id":1,"description":"Board game for smart children","name":"Chess","price":25}]
// $> curl http://127.0.0.1:3000/categories/Outdoor/toys
// [{"category_id":2,"description":"A ball to play outside","name":"Football ball","price":25}]
// $>
// Git instructions
// File name	app.js

// start the app on port 3000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})


//function to check if the category name is valid
function checkValidCategoryName(req, res, next){
    // console.log(req.params.categoryName, Object.values(categories))
    categories.forEach((obj) => {
        if(Object.values(obj).includes(req.params.categoryName)){
            next();
        }
    })
    res.sendStatus(404)
}

// middleware to check if all toy attributes are present for post action
function checkToyAttributes (req, res, next) {
    if(req.body.name != undefined && 
        req.body.description != undefined &&
        req.body.price != undefined &&
        req.body.category_id != undefined){

        next()

    } else{
        res.sendStatus(422)
    }   
}

// function to check if all category attributes are present for post action
function checkCategoryAttributes(req, res, next) {
    if(req.body.name){
        next()
    } else {
        res.sendStatus(422)
    }
} 

// function to check the id is valid for get action
function checkValidId(req, res, next) {
    const id = req.params.toyId ? req.params.toyId : req.params.categoryId
    const length = req.params.toyId ? toys.length : categories.length;
    if( 0 > id || id >= length){
        res.status(404).send("Not found")
    }
    next()
}

