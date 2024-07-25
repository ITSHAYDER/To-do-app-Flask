from flask_restful import Resource
from flask import request
from .models import db, SaveTodos
import uuid



class ToDos(Resource):
    def get(self):
        todos = SaveTodos.query.all()
        return [todo.as_dict() for todo in todos]
    def get_next_id(self):
        last_entry = SaveTodos.query.order_by(SaveTodos.id.desc()).first()
        if last_entry:
            return last_entry.id + 1
        return 1

    def post(self):
        data_json = request.get_json()
        data = data_json["data"]
        uid = self.get_next_id()
        added_data = SaveTodos(todos=data, id=uid)
        db.session.add(added_data)
        db.session.commit()

        return {"message":"data added successfully"},201
    def delete(self):
        data_json = request.get_json()
        data = data_json.get("data")
        if not data:
            return {"message": "No data provided"}, 400
        
        todo_to_delete = SaveTodos.query.filter_by(todos=data).first()
        if todo_to_delete:
            db.session.delete(todo_to_delete)
            db.session.commit()
            return {"message": "data deleted successfully"}, 200
        else:
            return {"message": "data not found"}, 404