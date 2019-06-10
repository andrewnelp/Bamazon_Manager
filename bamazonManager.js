let mysql = require("mysql");
let inquirer = require("inquirer");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "Andreyroot@#",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  // run the start function after the connection is made to prompt the user
  startSearch();
});

const startSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do, manager?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Products for Sale":
          // viewProductsForSale();
          break;

        case "View Low Inventory":
          // viewLowInv();
          break;

        case "Add to Inventory":
          // addToInv();
          break;

        case "Add New Product":
          // addNewProduct();
          break;
      }
    });
}

//  * View Products for Sale

  // * View Low Inventory

  // * Add to Inventory

  // * Add New Product