CREATE TABLE noteful_notes (
    id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    note_title TEXT NOT NULL,
    note_content TEXT NOT NULL,
    date_published TIMESTAMPTZ DEFAULT now() NOT NULL
)