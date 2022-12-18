var express = require('express'),
    bodyParser = require('body-parser')

    var app = express();
    var port = 4500;


    let data = {
        employees:[
           { key: 1, name: "Vijay", title: "CEO", titleId: "CEO", topLevel: true },
    {
      key: 2,
      name: "Arsath",
      title: "Vice President",
      titleId: "VP",
      parent: 1,
    },
    { key: 3, name: "Nandini", title: "Senior Manager", parent: 2 },
    { key: 4, name: "Aswinth", title: "Senior Manager", parent: 2 },
    { key: 5, name: "Chandhu", title: "Assitant Manager", parent: 3 },
    { key: 6, name: "Janani", title: "Assitant Manager", parent: 4 },
    { key: 7, name: "Vinay", title: "Team Lead", parent: 5 },
    { key: 8, name: "stephan", title: "Team Lead", parent: 6 },
    { key: 9, name: "Ragul", title: "Software Developer", parent: 7 },
    { key: 10, name: "Jana", title: "Software Developer", parent: 7 },
    { key: 11, name: "Mohamed", title: "Software Developer", parent: 7 },
    { key: 12, name: "Mariya", title: "Software Developer", parent: 7 },
    { key: 13, name: "Arun", title: "Software Developer", parent: 8 },
    { key: 14, name: "Sumathi", title: "Software Developer", parent: 8 },
    { key: 15, name: "Rajan", title: "Software Developer", parent: 8 },
    { key: 16, name: "Vikram", title: "Software Developer", parent: 8 },
          ]
    }

 
    app.use(function (req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    app.use(bodyParser.json());

    app.get('/getEmployees',(req,res)=>{
        
        res.status(200).json(data)
    })


    app.post('/updateEmployee',(req,res)=>{
        console.log('')
        let ChangedObj = req.body

        let tmpEmployeedata = []

        data.employees.forEach((item)=>{

      let tmpItem = item

      if(ChangedObj.key==item.key){
        tmpItem.name = ChangedObj.name
        if(ChangedObj.bossKey!=="" && ChangedObj.bossKey!==undefined){
          tmpItem.parent = ChangedObj.bossKey
        }       
        tmpItem.title = ChangedObj.title

      }
      tmpEmployeedata.push(tmpItem)
    })

    data.employees = tmpEmployeedata

        
        res.status(200).json(data)
    })


    app.post('/', (req, res) => res.json(data))

    
    
app.listen(port, function() {console.log('Server started at http://localhost:'+port+'/');});