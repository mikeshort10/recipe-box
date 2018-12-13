const recipes 			= require('./recipes');
const users				= require('/users');

module.exports = (router) => {
	recipes(router);
	users(router);
}