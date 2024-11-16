const express = require("express");

const user = require('./user')
const project = require('./project')

const mainRouters = (app) => {
    app.use('/user', user)
    app.use('/project', project)
}

module.exports = mainRouters