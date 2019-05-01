var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Imaderep123!",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    displayAll();
  });

  function displayAll(){
      connection.query("Select * from products",function(err,res){
          if(err) throw err;
          console.table(res);
          placeOrder();
      })
  }

  function placeOrder(){
      inquirer.prompt([{
          name: "id",
          message: "Enter id?",
          type: "number"
      },{
          name: "qty",
          message: "units to order?",
          type: "number"
      }]).then(function(prompt){
          connection.query("select stock_quantity from products where ?",{
              item_id: prompt.id
          },function(err, res){
              if(err) throw err;
              if(res[0].stock_quantity > prompt.qty){
                  connection.query("update products set? where?",[{
                      stock_quantity: res[0].stock_quantity - prompt.qty
                  },{
                      item_id: prompt.id
                  }], function(err){
                      if(err) throw err;
                      console.log("order placed");
                      connection.end();
                  });
              }
              else{
                  console.log("out of stock");
                  connection.end()
              }
          });
      });
  }