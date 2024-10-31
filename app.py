from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import cv2
import numpy as np
import base64
import io

app = Flask(__name__)
CORS(app)

# Configuration de la base de données et JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///crococroc.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'votre-secret-key'  # Changez ceci en production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Modèle Utilisateur
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    analyses = db.relationship('Analysis', backref='user', lazy=True)

# Modèle Analyse
class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    initial_grade = db.Column(db.Float, nullable=False)
    final_grade = db.Column(db.Float, nullable=False)
    difference_grade = db.Column(db.Float, nullable=False)

# Votre échelle ISO existante
ISO_GRAY_SCALE = {
    5: 255,    # Pas de changement
    4.5: 238,  # 4-5
    4: 221,    # 4
    3.5: 204,  # 3-4
    3: 187,    # 3
    2.5: 170,  # 2-3
    2: 153,    # 2
    1.5: 136,  # 1-2
    1: 119     # 1 (changement le plus important)
}

# Vos fonctions existantes
def convert_to_grayscale(image):
    """Convertit une image en niveaux de gris."""
    return np.dot(image[...,:3], [0.299, 0.587, 0.114])

def compare_to_iso_scale(gray_value):
    """Compare une valeur de gris à l'échelle ISO 105-A02."""
    differences = {grade: abs(gray_value - value) for grade, value in ISO_GRAY_SCALE.items()}
    return min(differences, key=differences.get)

def process_single_image(file):
    # Votre code existant pour process_single_image
    return {
        'gray_image': gray_image,
        'gray_image_str': gray_img_str,
        'iso_grade': iso_grade,
        'average_gray': average_gray,
        'resolution': f"{resolution/1000000:.2f} MP"
    }

def compare_images(gray_image1, gray_image2):
    # Votre code existant pour compare_images
    return compare_to_iso_scale(avg_diff)

# Routes d'authentification
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('email', 'password', 'name')):
        return jsonify({'error': 'Données manquantes'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email déjà utilisé'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        email=data['email'],
        name=data['name'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Inscription réussie'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Données manquantes'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name
        }
    })

@app.route('/api/auth/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name
    })

# Votre route d'analyse existante, maintenant protégée
@app.route('/api/analyze', methods=['POST'])
@jwt_required()
def analyze_images():
    try:
        current_user_id = get_jwt_identity()
        
        if 'file1' not in request.files or 'file2' not in request.files:
            return jsonify({'error': 'Two image files are required'}), 400
        
        file1 = request.files['file1']
        file2 = request.files['file2']
        
        if file1.filename == '' or file2.filename == '':
            return jsonify({'error': 'Both files must be selected'}), 400
        
        # Traitement des images (votre code existant)
        image1 = process_single_image(file1)
        image2 = process_single_image(file2)
        diff_grade = compare_images(image1['gray_image'], image2['gray_image'])
        
        # Supprimer les objets ndarray
        del image1['gray_image']
        del image2['gray_image']
        
        # Sauvegarder l'analyse en base de données
        new_analysis = Analysis(
            user_id=current_user_id,
            date=datetime.utcnow(),
            initial_grade=float(image1['iso_grade']),
            final_grade=float(image2['iso_grade']),
            difference_grade=float(diff_grade)
        )
        db.session.add(new_analysis)
        db.session.commit()
        
        response = {
            'image1': image1,
            'image2': image2,
            'difference_grade': float(diff_grade)
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error in analyze_images: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Initialisation de la base de données
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

#Nouveaux modèles
class Material(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    image_data = db.Column(db.Text, nullable=False)  # Base64 encoded image
    analyses = db.relationship('Analysis', backref='material', lazy=True)

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey('material.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    test_image_data = db.Column(db.Text, nullable=False)  # Base64 encoded image
    initial_grade = db.Column(db.Float, nullable=False)
    test_grade = db.Column(db.Float, nullable=False)
    difference_grade = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text)