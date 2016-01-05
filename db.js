/**
 * Created by tuananh on 12/29/15.
 */
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://tuananh:15061993@localhost:5432/techmasterv3');

module.exports = db;
