const express 		= require('express');
const app 			= express();
const helmet 		= require('helmet');
const bodyparser 	= require('body-parser');
const cors			= require('cors');

const routes		= require('routes.js')

app.use(express.static('public'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log("Node listening on port " + port);
})