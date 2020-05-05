const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controller = require("./controller/weather.controller");

//set up middleware
app.use(express.static('../cli/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/weather', function (req, res) {
//   weather.findAll(req, res);
// });

// app.get('/weather/:id', function (req, res) {
//   weather.find(req, res);
// });




app.post('/weather', async function (req, res) {
  // let up;

  // await controller.update(req)
  //   .then((result) => {
  //     up = result;
  //     console.log("Ok UPDATE");
  //     // res.json(result);
  //   })
  //   .catch((err) => {
  //     // res.json(err);
  //     console.log(err);
  //   });

  // if (!up) {
  //   controller.insert(req)
  //     .then((result) => {
  //       // res.json(result);
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       // res.json(err);
  //       console.log(err);
  //     });
  // }
  controller.getWeathersURL().then((result) => {
    res.json(result);
    console.log(result);
  });
});

app.listen(4000, () => {
  console.log("Connected to the port 4000");
});