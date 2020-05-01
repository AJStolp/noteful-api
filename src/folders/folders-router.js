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

        foldersService.insertFolders(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeFolder(folder))
            })
    })

foldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        foldersService.getById(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(folder => {
            if(!folder) {
                return res.status(404).json({
                    error: { message: `Folder does not exist` }
                })
            }
            res.folder = folder;
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        
    })