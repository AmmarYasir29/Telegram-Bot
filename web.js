let express = require('express');
const bodyParser = require('body-parser');
let packageInfo = require('./package.json');

let app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

let server = app.listen(process.env.PORT, "0.0.0.0", () =>{

  let host = server.address().address;
  let port = server.address().port;

  console.log('Web server started at http://%s:%s', host, port);
});

module.exports = (bot) => {
  app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
