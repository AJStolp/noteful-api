const path = require('path');
const express = require('express');
const notesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
    id: note.id,
    folder_id: note.folder_id,
    note_title: note.note_title,
    note_content: note.note_content,
    date_published: note.date_published
})

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        notesService.getAllNotes(knexInstance)
            .then(note => {
                res.json(note.map(serializeNote))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { note_title, note_content, folder_id, date_published } = req.body;
        const newNote = { note_title, note_content, folder_id };

        for(const [key, value] of Object.entries(newNote))
            if(value === null) {
                return res.status(400).json({
                    error: { message: `Sorry but '${key}' is needed` }
                })
            }
        notesService.insertNotes(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            res
                .status(200)
                .location(path.posix.join(req.originalUrl, `${folder_id}`))
        })
      
        .catch(next)
    })

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        notesService.getById(
            req.app.get('db'),
            req.params.note_id
        )
        .then(note => {
            if(!note) {
                return res.status(400).json({
                    error: { message: `Sorry but note does not exist` }
                })
            }
            res.note = note;
            next()
        })
        .catch(next)
    })

    .get((req, res, next) => {
        res.json(serializeNote(res.note))
    })

    .delete((req, res, next) => {
        notesService.deleteNotes(
            req.app.get('db'),
            req.params.note_id
        )
        .then(noteEffected => {
            res.status(204).end()
        })
        .catch(next)
    })

    .patch(jsonParser, (req, res, next) => {
        const { note_title, note_content } = req.body;
        const updatedNote = { note_title, note_content };

        const noteValues = Object.values(updatedNote).length;
        if(noteValues === null) {
            return res.status(400).json({
                error: { message: `Request must contain note_title and note_value` }
            })
        }
        notesService.updateNotes(
            req.app.get('db'),
            req.params.note_id,
            updatedNote
        )
        .then(notesEffected => {
            return res.status(200).end()
        })
        .catch(next)
    })



module.exports = notesRouter