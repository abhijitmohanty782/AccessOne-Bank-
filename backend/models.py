from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime
import random

class BankingModel:
    def __init__(self, db):
        self.db = db

    # ---------------------- USER ----------------------
    def create_user(self, data):
        if self.db.users.find_one({"email": data["email"]}):
            return {"error": "Email already registered"}, 400
        user = {
            "name": data["name"],
            "email": data["email"],
            "password": generate_password_hash(data["password"]),
            "address": data["address"],
            "date_of_birth": data["date_of_birth"],
            "accounts": [],
            "beneficiaries": [],
            "created_at": datetime.utcnow()
        }
        result = self.db.users.insert_one(user)
        user["_id"] = str(result.inserted_id)
        del user["password"]
        return user, 201

    def authenticate_user(self, email, password):
        user = self.db.users.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return {"error": "Invalid credentials"}, 401
        user["_id"] = str(user["_id"])
        del user["password"]
        return user, 200

    def get_user_by_id(self, user_id):
        user = self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"error": "User not found"}, 404
        user["_id"] = str(user["_id"])
        del user["password"]
        return user, 200

    def change_password(self, user_id, old_password, new_password):
        user = self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"error": "User not found"}, 404
        if not check_password_hash(user["password"], old_password):
            return {"error": "Old password is incorrect"}, 400
        self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": generate_password_hash(new_password)}}
        )
        return {"message": "Password updated successfully"}, 200

    # ---------------------- ACCOUNT ----------------------
    def create_user_account(self, user_id, account_type, initial_deposit=0,
                            purpose=None, business_name=None, business_type=None,
                            gst_number=None, pan_number=None):
        account = {
            "user_id": ObjectId(user_id),
            "account_type": account_type.lower(),
            "balance": initial_deposit,
            "status": "active",
            "verified": account_type.lower() == "savings",
            "account_number": self._generate_account_number(),
            "created_at": datetime.utcnow(),
            "purpose": purpose,
            "business_name": business_name,
            "business_type": business_type,
            "gst_number": gst_number,
            "pan_number": pan_number
        }
        result = self.db.accounts.insert_one(account)
        account["_id"] = str(result.inserted_id)
        account["user_id"] = str(account["user_id"])

        # link account to user
        self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"accounts": account["_id"]}}
        )
        return {"message": f"{account_type.capitalize()} account created successfully", "account": account}, 201

    def _generate_account_number(self):
        return str(random.randint(1000000000, 9999999999))

    def get_user_accounts(self, user_id):
        accounts = list(self.db.accounts.find({"user_id": ObjectId(user_id)}))
        for acc in accounts:
            acc["_id"] = str(acc["_id"])
            acc["user_id"] = str(acc["user_id"])
        return {"accounts": accounts}, 200

    def get_user_balance(self, user_id):
        accounts = list(self.db.accounts.find({"user_id": ObjectId(user_id)}))
        balances = {acc["account_number"]: acc["balance"] for acc in accounts}
        return {"balances": balances}, 200

    # ---------------------- BENEFICIARY ----------------------
    def add_beneficiary(self, user_id, data):
        beneficiary = {
            "user_id": ObjectId(user_id),
            "name": data["name"],
            "account_number": data["account_number"],
            "ifsc": data["ifsc"],
            "email": data["email"],
            "bank_name": data["bank_name"],
            "verified": False,
            "created_at": datetime.utcnow()
        }
        result = self.db.beneficiaries.insert_one(beneficiary)
        beneficiary["_id"] = str(result.inserted_id)
        beneficiary["user_id"] = str(beneficiary["user_id"])

        # link beneficiary to user
        self.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"beneficiaries": beneficiary["_id"]}}
        )
        return {"message": "Beneficiary added successfully", "beneficiary": beneficiary}, 201

    def get_beneficiaries(self, user_id):
        beneficiaries = list(self.db.beneficiaries.find({"user_id": ObjectId(user_id)}))
        for b in beneficiaries:
            b["_id"] = str(b["_id"])
            b["user_id"] = str(b["user_id"])
        return {"beneficiaries": beneficiaries}, 200

    # ---------------------- TRANSFER ----------------------
    def transfer_money(self, sender_id, beneficiary_id, amount, transfer_mode):
        sender_account = self.db.accounts.find_one({"user_id": ObjectId(sender_id), "status": "active"})
        if not sender_account:
            return {"error": "Sender account not found"}, 404
        if sender_account["balance"] < amount:
            return {"error": "Insufficient funds"}, 400

        beneficiary = self.db.beneficiaries.find_one({"_id": ObjectId(beneficiary_id), "user_id": ObjectId(sender_id)})
        if not beneficiary:
            return {"error": "Beneficiary not found"}, 404

        # Deduct amount from sender
        self.db.accounts.update_one({"_id": sender_account["_id"]}, {"$inc": {"balance": -amount}})

        # Credit receiver if internal
        receiver_account = self.db.accounts.find_one({"account_number": beneficiary["account_number"]})
        if receiver_account:
            self.db.accounts.update_one({"_id": receiver_account["_id"]}, {"$inc": {"balance": amount}})

        # Record transaction
        self.db.transactions.insert_one({
            "user_id": ObjectId(sender_id),
            "account_number": sender_account["account_number"],
            "beneficiary_id": ObjectId(beneficiary_id),
            "amount": amount,
            "transfer_mode": transfer_mode,
            "type": "debit",
            "timestamp": datetime.utcnow()
        })
        if receiver_account:
            self.db.transactions.insert_one({
                "user_id": receiver_account["user_id"],
                "account_number": receiver_account["account_number"],
                "beneficiary_id": ObjectId(beneficiary_id),
                "amount": amount,
                "transfer_mode": transfer_mode,
                "type": "credit",
                "timestamp": datetime.utcnow()
            })

        return {"message": "Transfer successful"}, 200

    # ---------------------- TRANSACTIONS ----------------------
    def get_transactions(self, user_id, limit=50):
        transactions = list(self.db.transactions.find({"user_id": ObjectId(user_id)}).sort("timestamp", -1).limit(limit))
        for t in transactions:
            t["_id"] = str(t["_id"])
            t["user_id"] = str(t["user_id"])
            t["beneficiary_id"] = str(t.get("beneficiary_id"))
        return {"transactions": transactions}, 200
