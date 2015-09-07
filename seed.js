// requires

var MongoClient = require('mongodb').MongoClient,
    _ = require('underscore'),
    moment = require('moment'),
    faker = require('faker');

// Seed arrays
var drinkNames = ['Casino', 'French', 'Gibson', 'Gimlet', 'Gin Fizz', 'Gin buck (a Buck variant)', 'Gin and tonic', 'Gin pahit', 'Old Fashioned', 'Negroni', "Ginger's Lost Island", 'Boulevardier', 'Last Word', 'Sazerac', 'Dark and Stormy'],

    names = ['The Betty', 'The Dawson', "Maude's Liquor Bar", 'Violet Hour', 'The Aviary', 'CH Distillery', 'The Barrelhouse Flat', 'Analogue', 'The Drifter', 'The Drumbar', "Coq D'or", 'Scofflaw', 'Point', 'Old Fifth', 'Momotaro'],

    glasses = ['Old Fashioned', 'Cocktail', 'Coupe', 'Highball', 'Collins', 'Margarita', 'Champaigne Flute', 'Brandy Snifter'];

// generating now
var now = new moment;

// needed functions
function generateLong() {
    var decimal = _.random(5987133, 9073214),
        integer = -87;
    return (integer + '.' + decimal) * 1
}

function generateLat() {
    var decimal = _.random(7886079, 9741625),
        integer = 41
    return (integer + '.' + decimal) * 1

}

function sampleAndDelete(array) {
    var sample = _.sample(array);
    var index = array.indexOf(sample);
    array.splice(index, 1);
    return sample;
}

function generateRandomArray(times, destinationArray, sourceArray) {
    for (x = 0; x < times; x++) {
        element = sampleAndDelete(sourceArray);
        destinationArray.push(element);
    }
}

// Seeding the moments collection
MongoClient.connect('mongodb://localhost:27017/sazerac', function(err, db) {
    if (err) throw err;

    var coll = db.collection('moments');

    coll.drop();

    for (i = 0; i < 1000; i++) {

        var tastes = ['smokey', 'sweet', 'smooth', 'bitter', 'fruity', 'dark', 'light', 'woody', 'bittersweet', 'earthy', 'harsh', 'minty', 'robust', 'tart', 'dry', 'full-bodied', 'sour', 'coffee', 'heavy', 'clean', 'creamy', 'nutty', 'oaky', 'fizzy'],

            ingredients = ['Ketel One Vodka', 'Captain Morgan Spiced Rum', "Tito's Handmade Vodka", "Maker's Mark Bourbon", "Remy Martin VSOP Cognac", "Glenlivet 12 Year Old", 'Aperol Orange Aperitif', 'Bulleit Bourbon', 'Bulleit Rye', 'Basil Hayden Bourbon', 'St Germain Elderflower Liqueur', 'Cointreau Liqueur', 'Glenrothes Select Reserve', 'Admiral Nelson Spiced Rum', 'Amaretto Di Saronno', 'Laphroaig 10 Year Old Islay Malt', 'House of Stuart Scotch', 'Amaretto Di Saronno'],

            users = _.range(1, 100),


            ingredientCollection = [],
            tasteDescriptions = [],
            clinkies = [];

        generateRandomArray(_.random(1, 6), tasteDescriptions, tastes);
        generateRandomArray(_.random(2, 5), ingredientCollection, ingredients);

        for (x = 0; x < _.random(0, 10); x++) {
            var userObj = {},
                key = 'user',
                value = sampleAndDelete(users);
            userObj[key] = value;
            clinkies.push(userObj);
        }

        coll.insert({
            "cocktail": _.sample(drinkNames),
            "location": {
                "name": _.sample(names),
                "lat": generateLat(),
                "long": generateLong()
            },
            "tastes": tasteDescriptions,
            "user": _.sample(users),
            "ingredients": ingredientCollection,
            "picture": faker.image.imageUrl(),
            "glass": _.sample(glasses),
            "date": now.subtract(_.random(1, 30), 'days').format(),
            "notes": faker.lorem.sentence(),
            "drinkAgain": _.random(0, 3),
            // model clinkies as an object
            "clinkies": clinkies
        });

    }
    return db.close();
});