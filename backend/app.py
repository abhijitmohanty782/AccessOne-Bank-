# app.py
import os
from datetime import datetime, timedelta, UTC, time, timezone
from functools import wraps

from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_pymongo import PyMongo
import jwt
import secrets
import re
from brevo_python import ApiClient, Configuration, SendSmtpEmail
from brevo_python.api.transactional_emails_api import TransactionalEmailsApi


# Import your model (assumes models.py defines BankingModel)
from models import BankingModel

# Load .env
load_dotenv()

# ---------------------- CONFIG ----------------------
app = Flask(__name__)
CORS(app)

# SECRET for Flask sessions and JWT signing
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", os.getenv("SECRET_KEY", "change-this-in-prod"))

# MongoDB
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/bank_app")
mongo = PyMongo(app)

# Mail configuration — ensure these env vars are set in your .env
# app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
# app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", 587))
# app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
# app.config["MAIL_USE_SSL"] = os.getenv("MAIL_USE_SSL", "false").lower() == "true"
# app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")            # e.g. official.accessone@gmail.com
# app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")            # app password (DO NOT store real password in repo)
# app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER", app.config["MAIL_USERNAME"])

# mail = Mail(app)

BREVO_API_KEY = os.getenv("BREVO_API_KEY") 
BREVO_SENDER_EMAIL = os.getenv("MAIL_DEFAULT_SENDER", os.getenv("MAIL_USERNAME")) 

# Initialize model (BankingModel should accept the db object)
# Initialize Brevo Client
brevo_client: TransactionalEmailsApi | None = None

# Log configuration status
if BREVO_API_KEY:
    app.logger.info(f"BREVO_API_KEY found: {BREVO_API_KEY[:10]}..." if len(BREVO_API_KEY) > 10 else "BREVO_API_KEY found")
else:
    app.logger.warning("WARNING: BREVO_API_KEY not found in environment variables. Email sending will fail.")

if BREVO_SENDER_EMAIL:
    app.logger.info(f"BREVO_SENDER_EMAIL: {BREVO_SENDER_EMAIL}")
else:
    app.logger.warning("WARNING: BREVO_SENDER_EMAIL (MAIL_DEFAULT_SENDER) not found. Email sending will fail.")

if BREVO_API_KEY:
    try:
        configuration = Configuration()
        configuration.api_key['api-key'] = BREVO_API_KEY
        # Initialize the API Client with the configured key
        api_client = ApiClient(configuration)
        brevo_client = TransactionalEmailsApi(api_client)
        app.logger.info("✅ Brevo API client initialized successfully.")
    except Exception as e:
        app.logger.error(f"❌ Failed to initialize Brevo client: {type(e).__name__}: {e}")
        brevo_client = None
else:
    app.logger.warning("WARNING: BREVO_API_KEY not found. Email sending will fail.")

bank_model = BankingModel(mongo.db)

# JWT settings
JWT_SECRET = app.config["SECRET_KEY"]
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_HOURS = int(os.getenv("JWT_EXP_HOURS", 168))  # default 7 days


# ---------------------- HELPERS ----------------------
def _generate_numeric_otp(length: int = 6) -> str:
    digits = "0123456789"
    return "".join(secrets.choice(digits) for _ in range(length))


def _send_otp_email(to_email: str, subject: str, body: str):
    """
    Sends email using the Brevo Transactional Email API (HTTPS).
    """
    if not brevo_client:
        error_msg = "Brevo API client not configured. Check BREVO_API_KEY and SENDER_EMAIL."
        app.logger.error(error_msg)
        raise RuntimeError(error_msg)
    
    if not BREVO_SENDER_EMAIL:
        error_msg = "Sender email (MAIL_DEFAULT_SENDER) not configured."
        app.logger.error(error_msg)
        raise RuntimeError(error_msg)

    try:
        # Extract OTP code from body for HTML content (more robust extraction)
        # Body format: "Your verification code is 123456. It expires in 10 minutes."
        otp_match = re.search(r'\b\d{6}\b', body)
        otp_code = otp_match.group(0) if otp_match else body.split()[-1].strip('.')
        
        # Create the email payload
        send_smtp_email = SendSmtpEmail(
            sender={"email": BREVO_SENDER_EMAIL, "name": "Banking App"},
            to=[{"email": to_email}],
            subject=subject,
            text_content=body,  # Use textContent for plain text OTP
            # Provide HTML content for better formatting in email clients
            html_content=f"""<html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Verification Code</h2>
                        <p>Hello,</p>
                        <p>Your verification code is:</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; border-radius: 5px;">
                            {otp_code}
                        </div>
                        <p>Please use this code to complete your action. This code expires in 10 minutes.</p>
                        <p>If you didn't request this code, please ignore this email.</p>
                        <p>Thank you,<br>Banking App Team</p>
                    </div>
                </body>
            </html>"""
        )
        
        # Send the email via API and capture response
        app.logger.info(f"Attempting to send OTP email to {to_email} via Brevo...")
        response = brevo_client.send_transac_email(send_smtp_email)
        
        # Log successful response
        app.logger.info(f"Brevo API response: {response}")
        app.logger.info(f"OTP email sent successfully to {to_email}")
        
        return response

    except Exception as e:
        # Log detailed error information
        error_detail = str(e)
        app.logger.error(f"Brevo API failed to send email to {to_email}")
        app.logger.error(f"Error type: {type(e).__name__}")
        app.logger.error(f"Error message: {error_detail}")
        
        # Check for specific Brevo API errors
        if "api-key" in error_detail.lower() or "unauthorized" in error_detail.lower():
            raise RuntimeError("Invalid Brevo API key. Please check BREVO_API_KEY in your environment variables.")
        elif "sender" in error_detail.lower() or "from" in error_detail.lower():
            raise RuntimeError(f"Invalid sender email. Please verify {BREVO_SENDER_EMAIL} is verified in your Brevo account.")
        elif "quota" in error_detail.lower() or "limit" in error_detail.lower():
            raise RuntimeError("Brevo email quota exceeded. Please check your Brevo account limits.")
        else:
            raise RuntimeError(f"Failed to send OTP email via Brevo API: {error_detail}")



def _store_otp(email: str, purpose: str, metadata: dict = None, ttl_minutes: int = 10):
    """
    Store an OTP document in mongo.otps collection.
    Returns the inserted record (including ObjectId _id).
    """
    code = _generate_numeric_otp(6)
    record = {
        "email": email,
        "purpose": purpose,
        "code": code,
        "metadata": metadata or {},
        "expires_at": datetime.now(UTC) + timedelta(minutes=ttl_minutes),
        "attempts": 0,
        "created_at": datetime.now(UTC),
    }
    res = mongo.db.otps.insert_one(record)
    record["_id"] = res.inserted_id  # keep as ObjectId
    return record


from datetime import datetime, UTC

def _verify_and_consume_otp(email: str, purpose: str, code: str):
    """
    Find the most recent OTP for (email, purpose). Verify and consume (delete) on success.
    Returns (True, record) on success, or (False, reason) on failure.
    """
    record = mongo.db.otps.find_one(
        {"email": email, "purpose": purpose},
        sort=[("created_at", -1)]
    )
    if not record:
        return False, "OTP not found"

    # --- Check expiry safely ---
    expires_at = record.get("expires_at")
    if not expires_at:
        return False, "Invalid OTP record (no expiry date)"

    # Normalize timezone handling
    now_utc = datetime.now(UTC)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)

    if now_utc > expires_at:
        # Delete expired record
        mongo.db.otps.delete_one({"_id": record["_id"]})
        return False, "OTP expired"

    # --- Check attempt limits ---
    if record.get("attempts", 0) >= 5:
        mongo.db.otps.delete_one({"_id": record["_id"]})
        return False, "Too many attempts"

    # --- Check code ---
    if record.get("code") != code:
        mongo.db.otps.update_one({"_id": record["_id"]}, {"$inc": {"attempts": 1}})
        return False, "Invalid OTP"

    # --- Success: consume OTP ---
    mongo.db.otps.delete_one({"_id": record["_id"]})
    return True, record



def _user_doc_to_public(user_doc: dict) -> dict:
    """
    Convert Mongo user document to public-safe dict (string _id, no password)
    """
    if not user_doc:
        return {}
    doc = dict(user_doc)
    _id = doc.get("_id")
    if isinstance(_id, ObjectId):
        doc["_id"] = str(_id)
    # Remove sensitive fields if present
    doc.pop("password", None)
    doc.pop("hashed_password", None)
    return doc


def create_jwt_for_user(user_id: str) -> str:
    exp = datetime.now(UTC) + timedelta(hours=JWT_EXP_DELTA_HOURS)
    payload = {"user_id": user_id, "exp": exp}
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    # jwt.encode returns bytes in some pyjwt versions; ensure str
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, "Token expired"
    except jwt.InvalidTokenError:
        return False, "Invalid token"


# ---------------------- AUTH DECORATOR ----------------------
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header required"}), 401
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid Authorization header"}), 401
        token = parts[1]
        ok, result = decode_jwt(token)
        if not ok:
            return jsonify({"error": result}), 401
        user_id = result.get("user_id")
        if not user_id:
            return jsonify({"error": "Invalid token payload"}), 401

        # Fetch user from model (assumes BankingModel.get_user_by_id returns (user, status))
        try:
            user, status = bank_model.get_user_by_id(user_id)
        except Exception:
            return jsonify({"error": "Failed to fetch user"}), 500
        if status != 200 or not user:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Attach to request context
        request.current_user = _user_doc_to_public(user)
        return f(*args, **kwargs)
    return decorated_function


# ---------------------- HEALTH CHECK ----------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify Brevo configuration"""
    health_status = {
        "status": "ok",
        "brevo_configured": brevo_client is not None,
        "brevo_api_key_set": bool(BREVO_API_KEY),
        "sender_email_set": bool(BREVO_SENDER_EMAIL),
        "sender_email": BREVO_SENDER_EMAIL if BREVO_SENDER_EMAIL else None
    }
    if not health_status["brevo_configured"]:
        health_status["status"] = "warning"
        health_status["message"] = "Brevo email service not configured. OTP emails will fail."
    return jsonify(health_status), 200

# ---------------------- BASE ROUTE ----------------------
@app.route("/")
def index():
    return jsonify({
        "message": "Welcome to the Banking API",
        "version": "3.0.0",
        "endpoints": {
            "auth": {
                "register": "POST /api/auth/register",
                "register_initiate": "POST /api/auth/register/initiate",
                "register_verify": "POST /api/auth/register/verify",
                "login": "POST /api/auth/login",
                "change_password": "POST /api/auth/change_password"
            },
            "user": {
                "profile": "GET /api/user/profile",
                "balance": "GET /api/user/balance",
                "accounts": {
                    "list": "GET /api/user/accounts",
                    "create": "POST /api/user/accounts"
                }
            },
            "beneficiaries": {
                "add": "POST /api/beneficiaries",
                "list": "GET /api/beneficiaries"
            },
            "transfer": "POST /api/transfer",
            "transfer_initiate": "POST /api/transfer/initiate",
            "transfer_verify": "POST /api/transfer/verify",
            "transactions": "GET /api/transactions"
        }
    })


# ---------------------- AUTH ROUTES ----------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json() or {}
        required = ["name", "email", "password", "address", "date_of_birth"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        user, status = bank_model.create_user(data)
        if status == 201:
            return jsonify(_user_doc_to_public(user)), 201
        return jsonify(user), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- REGISTRATION WITH OTP ----------------------
@app.route("/api/auth/register/initiate", methods=["POST"])
def register_initiate():
    try:
        data = request.get_json() or {}
        required = ["name", "email", "password", "address", "date_of_birth"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        # block duplicate
        existing = mongo.db.users.find_one({"email": data["email"]})
        if existing:
            return jsonify({"error": "Email already registered"}), 400

        otp_record = _store_otp(
            email=data["email"],
            purpose="register",
            metadata={"pending_user": data},
            ttl_minutes=10
        )

        try:
            _send_otp_email(
                to_email=data["email"],
                subject="Your Registration OTP",
                body=f"Your verification code is {otp_record['code']}. It expires in 10 minutes."
            )
        except RuntimeError as e:
            # remove OTP if email sending failed
            mongo.db.otps.delete_one({"_id": otp_record["_id"]})
            error_message = str(e)
            app.logger.error(f"Failed to send OTP email to {data['email']}: {error_message}")
            return jsonify({"error": error_message, "detail": "Please check your email configuration and Brevo API settings."}), 500
        except Exception as e:
            # remove OTP if email sending failed
            mongo.db.otps.delete_one({"_id": otp_record["_id"]})
            error_message = f"Failed to send OTP email: {str(e)}"
            app.logger.error(f"Unexpected error sending OTP to {data['email']}: {error_message}")
            return jsonify({"error": error_message}), 500

        return jsonify({"message": "OTP sent to email"}), 200
    except Exception as e:
        error_message = str(e)
        error_type = type(e).__name__
        app.logger.error(f"Error in register_initiate: {error_type}: {error_message}")
        app.logger.exception(e)  # Log full traceback
        return jsonify({"error": error_message, "type": error_type}), 500


@app.route("/api/auth/register/verify", methods=["POST"])
def register_verify():
    try:
        data = request.get_json() or {}
        email = data.get("email")
        code = data.get("otp")
        if not email or not code:
            return jsonify({"error": "email and otp are required"}), 400

        ok, result = _verify_and_consume_otp(email=email, purpose="register", code=code)
        if not ok:
            return jsonify({"error": result}), 400

        pending = result.get("metadata", {}).get("pending_user")
        if not pending:
            return jsonify({"error": "No pending registration found"}), 400

        user, status = bank_model.create_user(pending)
        if status == 201:
            return jsonify(_user_doc_to_public(user)), 201
        return jsonify(user), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400

        user, status = bank_model.authenticate_user(data["email"], data["password"])
        if status != 200:
            return jsonify(user), status

        # create JWT token
        user_public = _user_doc_to_public(user)
        token = create_jwt_for_user(user_public["_id"])

        response = {"user": user_public, "token": token}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/change_password", methods=["POST"])
@require_auth
def change_password():
    try:
        data = request.get_json() or {}
        old_password = data.get("old_password")
        new_password = data.get("new_password")
        if not old_password or not new_password:
            return jsonify({"error": "Both old_password and new_password required"}), 400

        result, status = bank_model.change_password(
            request.current_user["_id"],
            old_password,
            new_password
        )
        return jsonify(result), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- USER ROUTES ----------------------
@app.route("/api/user/profile", methods=["GET"])
@require_auth
def get_profile():
    return jsonify(request.current_user), 200


@app.route("/api/user/balance", methods=["GET"])
@require_auth
def get_balance():
    result, status = bank_model.get_user_balance(request.current_user["_id"])
    return jsonify(result), status


@app.route("/api/user/accounts", methods=["GET"])
@require_auth
def list_user_accounts():
    result, status = bank_model.get_user_accounts(request.current_user["_id"])
    return jsonify(result), status


@app.route("/api/user/accounts", methods=["POST"])
@require_auth
def create_user_account():
    try:
        data = request.get_json() or {}
        if not data.get("account_type"):
            return jsonify({"error": "account_type is required"}), 400
        result, status = bank_model.create_user_account(
            user_id=request.current_user["_id"],
            account_type=data.get("account_type"),
            initial_deposit=float(data.get("initial_deposit", 0)),
            purpose=data.get("purpose"),
            business_name=data.get("business_name"),
            business_type=data.get("business_type"),
            gst_number=data.get("gst_number"),
            pan_number=data.get("pan_number")
        )
        return jsonify(result), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- BENEFICIARIES ----------------------
@app.route("/api/beneficiaries", methods=["POST"])
@require_auth
def add_beneficiary():
    try:
        data = request.get_json() or {}
        required = ["name", "account_number", "ifsc", "email", "bank_name"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        user_id = request.current_user["_id"]

        # 1. Check if this beneficiary already exists for the current user
        existing = mongo.db.beneficiaries.find_one({
            "account_number": data["account_number"],
            "user_id": user_id
        })
        if existing:
            return jsonify({"error": "Beneficiary already exists"}), 400

        # 2. Check if the account number exists in accounts collection
        account_doc = mongo.db.accounts.find_one({"account_number": data["account_number"]})

        if account_doc:
            # Account exists, mark verified and link to user
            verified = True
            linked_user_id = account_doc["user_id"]
        else:
            verified = False
            linked_user_id = None

        # 3. Create new beneficiary document
        new_beneficiary = {
            "user_id": user_id,
            "name": data["name"],
            "account_number": data["account_number"],
            "ifsc": data["ifsc"],
            "email": data["email"],
            "bank_name": data["bank_name"],
            "verified": verified,
            "linked_user_id": linked_user_id
        }

        result = mongo.db.beneficiaries.insert_one(new_beneficiary)
        beneficiary_id = str(result.inserted_id)

        # 4. Link beneficiary to the current user's beneficiaries array
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"beneficiaries": beneficiary_id}}
        )

        return jsonify({
            "message": "Beneficiary added successfully",
            "beneficiary_id": beneficiary_id,
            "verified": verified
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/beneficiaries", methods=["GET"])
@require_auth
def get_beneficiaries():
    try:
        user_id = request.current_user["_id"]

        # 1. User's own beneficiaries (pending + verified)
        user_beneficiaries = list(mongo.db.beneficiaries.find(
            {"user_id": user_id},
            {"_id": 1, "name": 1, "account_number": 1, "verified": 1, "bank_name": 1}
        ))

        # 2. Other users' verified beneficiaries
        other_verified = list(mongo.db.beneficiaries.find(
            {"user_id": {"$ne": user_id}, "verified": True},
            {"_id": 1, "name": 1, "account_number": 1, "verified": 1, "bank_name": 1}
        ))

        # Merge, avoiding duplicates (by account_number)
        merged = {b["account_number"]: b for b in user_beneficiaries}
        for b in other_verified:
            merged[b["account_number"]] = b

        # Convert _id to string
        response = []
        for b in merged.values():
            response.append({
                "_id": str(b["_id"]),
                "name": b["name"],
                "account_number": b["account_number"],
                "bank_name": b.get("bank_name"),
                "verified": b.get("verified", False)
            })

        return jsonify({"beneficiaries": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- TRANSFERS (with OTP) ----------------------
@app.route("/api/transfer/initiate", methods=["POST"])
@require_auth
def transfer_initiate():
    try:
        data = request.get_json() or {}
        required = ["beneficiary_id", "amount", "transfer_mode", "from_acc_number"]
        for field in required:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        user = request.current_user
        user_id = user["_id"]
        amount = float(data["amount"])
        if amount <= 0:
            return jsonify({"error": "Amount must be greater than zero"}), 400

        beneficiary = mongo.db.beneficiaries.find_one({
            "_id": ObjectId(data["beneficiary_id"]),
            "user_id": user_id
        })
        if not beneficiary:
            return jsonify({"error": "Beneficiary not found"}), 400
        if not beneficiary.get("verified", False):
            return jsonify({"error": "Cannot transfer to unverified beneficiary"}), 400

        from_acc = mongo.db.accounts.find_one({
            "user_id": ObjectId(user_id),
            "account_number": data["from_acc_number"]
        })
        if not from_acc:
            return jsonify({"error": "Source account not found"}), 400
        if float(from_acc.get("balance", 0)) < amount:
            return jsonify({"error": "Insufficient balance"}), 400

        # Create pending transfer
        pending = {
            "user_id": user_id,
            "beneficiary_id": str(beneficiary["_id"]),
            "from_acc_number": data["from_acc_number"],
            "amount": amount,
            "transfer_mode": data["transfer_mode"],
            "created_at": datetime.now(UTC)
        }
        res = mongo.db.pending_transfers.insert_one(pending)
        pending_id = str(res.inserted_id)

        # Send OTP
        otp_record = _store_otp(
            email=user["email"],
            purpose="transfer",
            metadata={"pending_transfer_id": pending_id, "user_id": user_id},
            ttl_minutes=10
        )
        try:
            _send_otp_email(
                to_email=user["email"],
                subject="Your Transfer OTP",
                body=f"Your transfer OTP is {otp_record['code']}. It expires in 10 minutes."
            )
        except Exception as e:
            mongo.db.pending_transfers.delete_one({"_id": res.inserted_id})
            mongo.db.otps.delete_one({"_id": otp_record["_id"]})
            return jsonify({"error": "Failed to send OTP email", "detail": str(e)}), 500

        return jsonify({"message": "OTP sent to email", "pending_transfer_id": pending_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/transfer/verify", methods=["POST"])
@require_auth
def transfer_verify():
    try:
        data = request.get_json() or {}
        pending_id = data.get("pending_transfer_id")
        code = data.get("otp")
        if not pending_id or not code:
            return jsonify({"error": "pending_transfer_id and otp are required"}), 400

        user = request.current_user
        ok, result = _verify_and_consume_otp(email=user["email"], purpose="transfer", code=code)
        if not ok:
            return jsonify({"error": result}), 400

        pending = mongo.db.pending_transfers.find_one({"_id": ObjectId(pending_id), "user_id": user["_id"]})
        if not pending:
            return jsonify({"error": "Pending transfer not found"}), 404

        # Perform transfer
        amount = float(pending["amount"])
        from_acc = mongo.db.accounts.find_one({
            "user_id": ObjectId(user["_id"]),
            "account_number": pending["from_acc_number"]
        })
        if not from_acc:
            return jsonify({"error": "Source account not found"}), 400
        if float(from_acc.get("balance", 0)) < amount:
            mongo.db.pending_transfers.delete_one({"_id": ObjectId(pending_id)})
            return jsonify({"error": "Insufficient balance"}), 400

        beneficiary = mongo.db.beneficiaries.find_one({"_id": ObjectId(pending["beneficiary_id"])})
        if not beneficiary:
            mongo.db.pending_transfers.delete_one({"_id": ObjectId(pending_id)})
            return jsonify({"error": "Beneficiary not found"}), 400

        # debit from source
        mongo.db.accounts.update_one({"_id": from_acc["_id"]}, {"$inc": {"balance": -amount}})

        # credit to beneficiary account if it exists in accounts collection
        ben_acc = mongo.db.accounts.find_one({"account_number": beneficiary["account_number"]})
        if ben_acc:
            mongo.db.accounts.update_one({"_id": ben_acc["_id"]}, {"$inc": {"balance": amount}})

        # insert transaction record
        mongo.db.transactions.insert_one({
            "user_account_id": ObjectId(from_acc["_id"]),
            "beneficiary_account_id": ObjectId(beneficiary["_id"]),
            "amount": amount,
            "transfer_mode": pending["transfer_mode"],
            "created_at": datetime.now(UTC)
        })

        mongo.db.pending_transfers.delete_one({"_id": ObjectId(pending_id)})
        return jsonify({"message": "Transfer completed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- TRANSACTIONS ----------------------
@app.route("/api/transactions", methods=["GET"])
@require_auth
def transactions():
    limit = request.args.get("limit", 50, type=int)
    result, status = bank_model.get_transactions(request.current_user["_id"], limit)
    return jsonify(result), status


@app.route("/api/transactions/filter", methods=["GET"])
@require_auth
def transactions_filter():
    try:
        print("\n================= /api/transactions/filter CALLED =================")

        user = request.current_user
        print(f"🔐 Authenticated User: {user}")

        user_id_str = str(user["_id"])
        user_id_obj = ObjectId(user_id_str) if ObjectId.is_valid(user_id_str) else user_id_str
        print(f"🆔 User ObjectId: {user_id_obj}")

        account_number = request.args.get("account_number")
        ttype = request.args.get("type", "all")  # all, debit, credit
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")

        print(f"📥 Incoming Query Params → account_number={account_number}, type={ttype}, start={start_date}, end={end_date}")

        # Step 1: Find user's account(s)
        account_query = {"user_id": {"$in": [user_id_str, user_id_obj]}}
        if account_number:
            account_query["account_number"] = account_number

        print(f"🔍 Account Query: {account_query}")

        accounts = list(mongo.db.accounts.find(account_query))
        print(f"🏦 Accounts Found: {len(accounts)} → {[str(a['_id']) for a in accounts]}")

        if not accounts:
            print("⚠️ No accounts found for this user.")
            return jsonify({"transactions": [], "message": "No account found"}), 200

        account_ids = [a["_id"] for a in accounts]

        # Step 2: Build transaction query
        q = {
            "$or": [
                {"user_account_id": {"$in": account_ids}},
                {"beneficiary_account_id": {"$in": account_ids}},
            ]
        }
        print(f"🔎 Base Transaction Query: {q}")

        # Step 3: Date filter
        if start_date and end_date:
            try:
                sdate = datetime.strptime(start_date, "%Y-%m-%d").date()
                edate = datetime.strptime(end_date, "%Y-%m-%d").date()
                start_dt = datetime.combine(sdate, time.min, tzinfo=timezone.utc)
                end_dt = datetime.combine(edate, time.max, tzinfo=timezone.utc)
                q["timestamp"] = {"$gte": start_dt, "$lte": end_dt}
                print(f"📅 Applied Date Range Filter: {start_dt} → {end_dt}")
            except Exception as e:
                print(f"⚠️ Invalid date filter: {e}")

        print(f"📝 FINAL Mongo Transaction Query: {q}")

        # Step 4: Fetch transactions
        txs = list(mongo.db.transactions.find(q).sort("timestamp", -1))
        print(f"📊 Transactions Fetched: {len(txs)}")

        formatted = []
        for t in txs:
            print(f"\n🔹 Raw Transaction: {t}")

            t["_id"] = str(t["_id"])
            if isinstance(t.get("user_account_id"), ObjectId):
                t["user_account_id"] = str(t["user_account_id"])
            if isinstance(t.get("beneficiary_account_id"), ObjectId):
                t["beneficiary_account_id"] = str(t["beneficiary_account_id"])

            # Determine type
            is_credit = ObjectId(t.get("beneficiary_account_id")) in account_ids
            ttype_calc = "credit" if is_credit else "debit"
            t["type"] = ttype_calc
            print(f"📌 Determined Type: {ttype_calc}")

            if isinstance(t.get("timestamp"), datetime):
                t["timestamp"] = t["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

            src_acc = next((a for a in accounts if str(a["_id"]) == t.get("user_account_id")), None)
            ben_acc = next((a for a in accounts if str(a["_id"]) == t.get("beneficiary_account_id")), None)
            t["account_number"] = src_acc["account_number"] if src_acc else (ben_acc["account_number"] if ben_acc else "-")

            print(f"🏷️ Final Transaction Item: {t}")
            formatted.append(t)

        # Step 5: Type filter
        if ttype in ["credit", "debit"]:
            print(f"🔽 Filtering Only {ttype.upper()} transactions")
            formatted = [t for t in formatted if t["type"] == ttype]

        print(f"✅ Final Returned Transactions: {len(formatted)}")

        return jsonify({"transactions": formatted}), 200

    except Exception as e:
        print("❌ Error in /api/transactions/filter:", e)
        return jsonify({"error": str(e)}), 500




# ---------------------- CHAT NAVIGATION HELPER ----------------------
@app.route("/api/chat", methods=["POST"])
def chat_navigate():
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get("query") or data.get("message") or "").strip()
        navigate_path = None

        # 1) Full URL like http(s)://localhost:3000/... → extract the path
        m = re.search(r"https?://localhost:3000(?P<path>/[\w\-./?=&%]*)?", text)
        if m:
            navigate_path = m.group("path") or "/"
        # 2) Bare SPA path starting with '/' → accept directly
        elif text.startswith("/"):
            navigate_path = text

        # If nothing matched, simply echo back
        if navigate_path:
            return jsonify({
                "answer": f"Navigating to {navigate_path}",
                "navigate_path": navigate_path
            }), 200
        else:
            return jsonify({
                "answer": "I did not detect a route. Paste a link like http://localhost:3000/payments/transfer or a path like /payments/transfer."
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ---------------------- START SERVER ----------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG", "true").lower() == "true")
