const notesService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_notes')
    },
    insertFolders(knex, newNote) {
        return knex
            .insert(newNote)
            .into('noteful_notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('noteful_notes').select('*').where('id', id).first()
    },
    deleteFolders(knex, id) {
        return knex('noteful_notes')
            .where({id})
            .delete()
    },
    updateFolders(knex, id, newNoteFields){
        return knex('noteful_notes')
            .where({id})
            .update(newNoteFields)
    }
}


module.exports = notesService