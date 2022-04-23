from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from app import db

class Game(db.Model):
    __tablename__='4inrow'
    game_id = db.Column(db.Integer, primary_key = True)
    #winner = db.Column(db.String)
    next = db.Column(db.Integer, default=1)
    board = db.Column(db.String)
    online = db.Column(db.String, default='{}')
    
    def __repr__(self):
        return f"Game('{self.game_id}' , {self.board})"
