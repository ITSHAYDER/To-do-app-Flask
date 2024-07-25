from flask_sqlalchemy import SQLAlchemy



db = SQLAlchemy()


class SaveTodos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    todos = db.Column(db.String)


    def as_dict(self):
        return {
            'id': self.id,
            'todos': self.todos
        }


