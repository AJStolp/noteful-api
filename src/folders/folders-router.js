const path = require('path');
const express = require('express');
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
            if(value == null)
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
            .catch(next)
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
        res.json(serializeFolder(res.folder))
    })

    .patch(jsonParser, (req ,res, next) => {
        const { folder_title } = req.body;
        const updatedFolder = { folder_title };

        const numberOfValuesTitle = Object.values(updatedFolder).length
        if(numberOfValuesTitle === 0 ) {
            return res.status(400).json({
                error: { message: `The new folder title needs text` }
            });
        }

        foldersService.updateFolders(
            req.app.get('db'),
            updatedFolder
        )
        .then(folderEffected => {
            res.status(200).end()
        })
        .catch(next)
    })

    .delete((req, res, next) => {
        foldersService.deleteFolders(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(folderEffected => {
            res.status(200).end()
        })
        .catch(next)
    })
module.exports = foldersRouter