var dog;
var sadDog;
var happyDog;

var database;

var foodS;
var foodStock;
var addFood;
var foodObj;

var feed;
var lastFed;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  lastFed = database.ref('feedTime');
  lastFed.on("value", function(data){
    feed = data.val();
  })
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  feedTheDog = createButton("Feed The Dog");
  feedTheDog.position(675, 95);
  feedTheDog.mousePressed(feedDog);

}

function draw() {
  background(46,139,87);

  foodObj.display();

  drawSprites();

  fill("black");
  text("Last Fed : "+hour(), 50, 50);
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  var food_stock_val = foodObj.getFoodStock();

  if(food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val * 0);
  }
  else{
    foodObj.updateFoodStock(food_stock_val - 1);
  }

  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    feedTime : hour()
  })

  if(lastFed >= 12){
    text(hour()-12 + "PM", 100, 50);
  }

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}
