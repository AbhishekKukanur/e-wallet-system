from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import ChoiceType
from uuid import uuid4

WALLET_TYPES = [
    ("e-wallet","e-wallet"),
    ("mobile-wallet","mobile-wallet"),
    ("shopping-wallet","shopping-wallet"),
]

TRANSACTION_TYPES = [
    ("credit", "credit"),
    ("debit","debit")
]

db =SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    phoneNumber = db.Column(db.String(15), primary_key=True, unique=True)
    name = db.Column(db.String(150), nullable=False)
    password = db.Column(db.Text, nullable=False)
    wallet = db.relationship('Wallet', backref='users')

class Wallet(db.Model):
    __tablename__ = "wallet"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(ChoiceType(WALLET_TYPES), default='e-wallet')
    balance = db.Column(db.Integer, default=0.0)
    phoneNumber = db.Column(db.String(15), db.ForeignKey("users.phoneNumber"))

class Transaction(db.Model):
    __tablename__ = "transaction"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime)
    type = db.Column(ChoiceType(TRANSACTION_TYPES))
    amount = db.Column(db.Integer)
    wallet = db.Column(db.Integer, db.ForeignKey("wallet.id"))
