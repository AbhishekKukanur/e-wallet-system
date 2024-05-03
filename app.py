import datetime
from flask import Flask, session, request, jsonify
from flask_cors import CORS, cross_origin
from models import db, User, Wallet, Transaction, TRANSACTION_TYPES, WALLET_TYPES

app = Flask(__name__)

app.config['SECRET_KEY'] = 'qwertyuiop-asdfghjkl'
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///wallet.db'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True

CORS(app, origins= "*", supports_credentials=True)
db.init_app(app)

with app.app_context():
    db.create_all()

# API Routes
@app.route("/signup", methods=["POST"])
def signup():
    phoneNumber = request.json["phoneNumber"]
    name = request.json["name"]
    password = request.json['password']

    user_exists = User.query.filter_by(phoneNumber=phoneNumber).first() is not None
    if user_exists:
        return jsonify({'error': "phoneNumber already exists"}), 409
    
    new_user = User(phoneNumber=phoneNumber,name=name,password=password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.phoneNumber

    return jsonify({
        "phoneNumber":new_user.phoneNumber,
        "name":new_user.name
    })


@app.route("/login", methods=["POST"])
def login():
    phoneNumber = request.json["phoneNumber"]
    password = request.json['password']

    user = User.query.filter_by(phoneNumber=phoneNumber).first()

    if user is None:
        return jsonify({"error":"phone number not found"}), 401
    
    if password != user.password:
        return jsonify({"error":"incorrect password"}), 401
    
    session["user_id"] = user.phoneNumber

    return jsonify({
        "phoneNumber":user.phoneNumber,
        "name":user.name
    })

@app.route("/create-wallet", methods=["POST"])
def createWallet():
    phoneNumber = request.json["phoneNumber"]
    walletType = request.json["walletType"]
    
    walletExists = Wallet.query.filter_by(phoneNumber=phoneNumber,type=walletType).first() is not None
    if walletExists:
        return jsonify({'error': "wallet already exists"}), 409
    
    new_wallet = Wallet(type=walletType, phoneNumber=phoneNumber)
    db.session.add(new_wallet)
    db.session.commit()
    session["user_id"] = new_wallet.phoneNumber

    return jsonify({
        "id":new_wallet.id,
        "phoneNumber":new_wallet.phoneNumber,
        "type":str(new_wallet.type),
        "balance":new_wallet.balance
    })

@app.route("/get-wallet", methods=["GET"])
def getWallet():
    phoneNumber = request.args.get("phoneNumber")
    walletType = request.args.getlist("walletType")

    if len(walletType) == 0:
        walletType = list(dict(WALLET_TYPES).values())

    wallets = Wallet.query.filter(Wallet.phoneNumber==phoneNumber,Wallet.type.in_(walletType)).all()
    if len(wallets) == 0:
        return jsonify({"error": "wallet not found"}), 409
    session["user_id"] = wallets[0].phoneNumber

    wallet_list = []
    for wallet in wallets:
        wallet_list.append({'id':wallet.id,'type':str(wallet.type),'balance':wallet.balance})
    return wallet_list

@app.route("/create-transaction", methods=["POST"])
def createTransaction():
    phoneNumber = request.json["phoneNumber"]
    walletType = request.json["walletType"]
    transactionType = request.json["transactionType"]
    amount = request.json["amount"]
    transactionDate = datetime.datetime.today()
    if amount:
        amount = int(amount)
    if walletType:
        walletType = dict(WALLET_TYPES)[walletType.replace("\"","")]
    if phoneNumber:
        phoneNumber=int(phoneNumber)
    if transactionType:
        transactionType = dict(TRANSACTION_TYPES)[transactionType.replace("\"","")]

    wallet = Wallet.query.filter_by(phoneNumber=phoneNumber,type=walletType).first()
    if wallet is None:
        return jsonify({'error': "wallet not found",
                        'phoneNumber':phoneNumber,
                        'wallet':walletType}), 409
    
    if transactionType == 'credit':
        new_balance = wallet.balance + amount
    else:
        if wallet.balance < amount:
            return jsonify({'error': "transaction Failed - Insufficient funds"}),401
        new_balance = wallet.balance - amount
    wallet.balance = new_balance
    db.session.commit()
    new_transaction = Transaction(type=transactionType, date=transactionDate, amount=amount, wallet=wallet.id)
    db.session.add(new_transaction)
    db.session.commit()
    session["user_id"] = new_transaction.id

    return jsonify({
        "id":new_transaction.id,
        "phoneNumber":new_transaction.amount,
        "type":str(new_transaction.type),
        "date":new_transaction.date
    })


@app.route("/get-transaction", methods=["GET"])
def getTransaction():
    phoneNumber = request.args.get("phoneNumber")
    walletType = request.args.get("walletType")
    transactionFromDate = request.args.get("fromDate")
    transactionToDate = request.args.get("toDate")

    if phoneNumber:
        phoneNumber = int(phoneNumber)
    if walletType:
        walletType = dict(WALLET_TYPES)[walletType.replace("\"","")]

    wallet = Wallet.query.filter_by(phoneNumber=phoneNumber,type=walletType).first()
    if wallet is None:
        return jsonify({'error': "wallet not found",
                        'phoneNumber':phoneNumber,
                        'walletType':walletType}), 409
    
    transactions = Transaction.query.filter(Transaction.wallet == wallet.id, Transaction.date >= transactionFromDate, Transaction.date <= transactionToDate).all()

    transactions_list = []
    for transaction in transactions:
        transactions_list.append({'id':transaction.id,'date':transaction.date,'type':str(transaction.type),'amount':transaction.amount,'wallet':transaction.wallet})
    return transactions_list

if __name__ == "__main__":
    app.run(debug=True)
