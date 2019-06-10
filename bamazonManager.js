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
          viewProductsForSale();
          break;

        case "View Low Inventory":
          viewLowInv();
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

const viewProductsForSale = () => {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    console.log('=============================');
    console.log(`List of available products:`);
    console.log('===============================================================================================');
    res.forEach(r => {
      console.log(`ID: ${r.item_id} || Name:${r.product_name} || Category: ${r.department_name} || Price: ${r.price} || Quantity ${r.stock_quantity} `);
    })
    console.log('===============================================================================================');
    startSearch();
  });
  // startSearch();
}
  // * View Low Inventory
const viewLowInv = () =>{
  inquirer
    .prompt({
      name: "lowinv",
      type: "input",
      message: "Type inventory number, please",
      validate: value => {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    })
    .then(answer => {
      let query = `SELECT item_id, product_name, department_name, price, stock_quantity `;
      query += `FROM products WHERE item_id = ANY (SELECT item_id FROM products WHERE stock_quantity < ${answer.lowinv}) `;
      query += `ORDER BY stock_quantity ASC`;
      connection.query(query, function (err, res) {
        if(err) throw err;
        console.log('===============================================================================================');
        res.forEach(r => {
          console.log(`ID: ${r.item_id} || Name:${r.product_name} || Category: ${r.department_name} || Price: ${r.price} || Quantity ${r.stock_quantity} `)
          console.log(`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`)
        })
        console.log('===============================================================================================');
        startSearch();
      });
    });
}


  // * Add to Inventory

  // * Add New Product