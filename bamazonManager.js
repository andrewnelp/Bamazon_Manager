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
        "Update Inventory",
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

        case "Update Inventory":
          updateInv();
          break;

        case "Add New Product":
          addNewProduct();
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
const viewLowInv = () => {
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
        if (err) throw err;
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
const updateInv = () => {
  inquirer
    .prompt([
      {
        name: "invid",
        type: "input",
        message: "What item id inventory would you like to update?",
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "newinv",
        type: "input",
        message: "How many items would the inventory should be now?",
        validate: value => {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(answer => {
      // let query = `UPDATE products SET stock_quantity = ${answer.newinv} WHERE (item_id = ${answer.invid}) `;
      let query = "UPDATE products SET ? WHERE (item_id = ?) ";

      connection.query(query,
       [{stock_quantity: answer.newinv}, answer.invid],
        //  [answer.newinv, answer.invid ],
          (err, res, fields) => {
        if (err) throw err;
        console.log('===============================================================================================');
            console.log(res.affectedRows + " stock updated!\n");
        // console.log(`ID: ${res.item_id} || Name:${res.product_name} || Category: ${res.department_name} || Price: ${res.price} || New Quantity ${res.stock_quantity} `)
        // console.log(res.product_name);

        console.log('===============================================================================================');
            startSearch();
      });
    });
}

  // * Add New Product

const addNewProduct = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What product name would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What is department?",
      },
      {
        name: "price",
        type: "input",
        message: "What is the price?"
      },
      {
        name: "stock",
        type: "input",
        message: "What is the stock quantity?"
      },
      {
        name: "sales",
        type: "input",
        message: "What are the sales?"
      }
    ])

 .then(answer => {
  //  let query = `INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) `;
  //  query += ` VALUES ("${answer.name}", "${answer.department}", ${answer.price}, ${answer.stock}, ${answer.sales})`;
   let query = "INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) ";
   query += "VALUES (?, ?, ?, ?, ?)" ;
   connection.query(query,
     [answer.name, answer.department, answer.price, answer.stock, answer.sales ],
    (err, res) => {
     if (err) throw err;
     console.log('===============================================================================================');
     console.log(res.affectedRows + " product added!\n");
     console.log('===============================================================================================');
     startSearch();
   });
 })
}