const notesService = {
    getAllNotes(knex) {
        return knex.select('*').from('noteful_notes')
    },
    insertNotes(knex, newNote) {
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
    deleteNotes(knex, id) {
        return knex('noteful_notes')
            .where({id})
            .delete()
    },
    updateNotes(knex, id, newNoteFields){
        return knex('noteful_notes')
            .where({id})
            .update(newNoteFields)
    }
}


module.exports = notesService