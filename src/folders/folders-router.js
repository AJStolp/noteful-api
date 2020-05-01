const path = require('path');
const express = require('express');
const xss = require('xss');
const foldersService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
    id: folder.id,
    folder_title: folder.folder_title
});

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        foldersService.getAllFolders(knexInstance)
            .then(folder => {
                res.json(folder.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { folder_title } = req.body;
        const newFolder = { folder_title };

        for([key, value] of Object.entries(newFolder))
            if(folder_title == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request` }
                })
    })