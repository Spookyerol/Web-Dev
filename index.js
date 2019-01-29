// JavaScript source code
const app = require('./app');
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);