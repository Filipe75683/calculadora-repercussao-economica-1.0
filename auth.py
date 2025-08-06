from flask import Blueprint, request, jsonify
from src.models.auth import db, User, ActiveSession
from datetime import datetime, timedelta
import secrets

auth_bp = Blueprint('auth', __name__)

def require_auth():
    """Verifica se o usuário está autenticado"""
    session_token = request.headers.get('Authorization')
    if not session_token:
        return None
    
    # Remove "Bearer " se presente
    if session_token.startswith('Bearer '):
        session_token = session_token[7:]
    
    active_session = ActiveSession.query.filter_by(session_token=session_token).first()
    if not active_session or active_session.expires_at < datetime.utcnow():
        return None
    
    return active_session.user

def require_admin():
    """Verifica se o usuário é administrador"""
    user = require_auth()
    if not user or not user.is_admin:
        return None
    return user

@auth_bp.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "Calculadora de Repercussão Econômica - Backend API", "status": "running"})

@auth_bp.route("/setup", methods=["POST"])
def setup():
    """Cria o primeiro usuário administrador se não existir nenhum usuário"""
    if User.query.count() > 0:
        return jsonify({"message": "Setup already completed"}), 400
    
    data = request.get_json()
    username = data.get("username", "admin")
    password = data.get("password", "admin123")
    
    admin_user = User(username=username, is_admin=True)
    admin_user.set_password(password)
    
    db.session.add(admin_user)
    db.session.commit()
    
    return jsonify({"message": "Admin user created successfully", "username": username}), 201

@auth_bp.route("/register", methods=["POST"])
def register():
    admin = require_admin()
    if not admin:
        return jsonify({"message": "Admin access required"}), 403
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    is_admin = data.get("is_admin", False)

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 409

    new_user = User(username=username, is_admin=is_admin)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "username": username}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Criar sessão ativa
    session_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=24)  # Sessão válida por 24 horas
    
    active_session = ActiveSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=expires_at
    )
    
    # Atualizar último login
    user.last_login = datetime.utcnow()
    
    db.session.add(active_session)
    db.session.commit()

    return jsonify({
        "message": "Login successful",
        "token": session_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_admin
        }
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    user = require_auth()
    if not user:
        return jsonify({"message": "Not authenticated"}), 401
    
    session_token = request.headers.get('Authorization')
    if session_token.startswith('Bearer '):
        session_token = session_token[7:]
    
    # Remover sessão ativa
    ActiveSession.query.filter_by(session_token=session_token).delete()
    db.session.commit()
    
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route("/auth/check", methods=["GET"])
def check_auth():
    user = require_auth()
    if not user:
        return jsonify({"authenticated": False}), 401
    
    return jsonify({
        "authenticated": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_admin
        }
    }), 200

@auth_bp.route("/users", methods=["GET"])
def list_users():
    admin = require_admin()
    if not admin:
        return jsonify({"message": "Admin access required"}), 403
    
    users = User.query.all()
    output = []
    for user in users:
        # Verificar se o usuário tem sessões ativas
        active_sessions = ActiveSession.query.filter_by(user_id=user.id).filter(
            ActiveSession.expires_at > datetime.utcnow()
        ).count()
        
        output.append({
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "last_login": user.last_login.isoformat() if user.last_login else None,
            "is_online": active_sessions > 0
        })
    
    return jsonify({"users": output}), 200

@auth_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    admin = require_admin()
    if not admin:
        return jsonify({"message": "Admin access required"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Não permitir que o admin delete a si mesmo
    if user.id == admin.id:
        return jsonify({"message": "Cannot delete your own account"}), 400
    
    # Remover todas as sessões ativas do usuário
    ActiveSession.query.filter_by(user_id=user.id).delete()
    
    # Deletar usuário
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "User deleted successfully"}), 200

@auth_bp.route("/users/<int:user_id>/password", methods=["PUT"])
def change_user_password(user_id):
    admin = require_admin()
    if not admin:
        return jsonify({"message": "Admin access required"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    data = request.get_json()
    new_password = data.get("password")
    
    if not new_password:
        return jsonify({"message": "Password is required"}), 400
    
    if len(new_password) < 6:
        return jsonify({"message": "Password must be at least 6 characters long"}), 400
    
    # Alterar senha
    user.set_password(new_password)
    
    # Remover todas as sessões ativas do usuário (forçar novo login)
    ActiveSession.query.filter_by(user_id=user.id).delete()
    
    db.session.commit()
    
    return jsonify({
        "message": f"Password changed successfully for user {user.username}",
        "sessions_removed": True
    }), 200

@auth_bp.route("/users/<int:user_id>/logout", methods=["POST"])
def force_logout(user_id):
    admin = require_admin()
    if not admin:
        return jsonify({"message": "Admin access required"}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Remover todas as sessões ativas do usuário
    sessions_removed = ActiveSession.query.filter_by(user_id=user.id).delete()
    db.session.commit()
    
    return jsonify({
        "message": f"User {user.username} logged out successfully",
        "sessions_removed": sessions_removed
    }), 200

@auth_bp.route("/admin/cleanup", methods=["POST"])
def cleanup_sessions():
    admin = require_admin()
    if not admin:
        return jsonify({"message": "Admin access required"}), 403
    
    expired_sessions = ActiveSession.query.filter(
        ActiveSession.expires_at < datetime.utcnow()
    ).delete()
    
    db.session.commit()
    
    return jsonify({
        "message": "Cleanup completed",
        "expired_sessions_removed": expired_sessions
    }), 200

