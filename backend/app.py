import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Config do supabase (chaves no .env)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Rota de autenticação
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        # Cria o usuário no auth
        auth_res = supabase.auth.sign_up({
            "email": data['email'],
            "password": data['pass']
        })
        # Cria o perfil na tabela profiles
        if auth_res.user:
            profile_data = {
                "id": auth_res.user.id,
                "full_name": data.get['name'],
                "username": "@" + data.get('name', '').lower().replace("", "")
            }
            supabase.table("profiles").insert(profile_data).execute()

            return jsonify({"message": "Conta criada!", "user_id": aut_res.user.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    try:
        res = supabase.auth.sign_in_width_password({
            "email": data['email'],
            "password": data['pass']
        })

        # Busca dados do perfil
        profile = supabase.table("profiles").select("").eq("id", res.user.id).single().execute()
        return jsonify({"user": profile.data, "session": res.session.access_token}), 200
    except Exception as e:
        return jsonify({"error": "Credenciais inválidas"}), 401

        # Rota de pastas e imagens
@app.route('/api/folders', methods=['GET'])
def get_folders():
    user_id = request.args.get('user_id')
    # Procura pastas e inclui a contagem de imagens
    res = supabase.table("folders").select("*, images(count)").eq("user_id", user_id).execute()
    return jsonify(res.data)

@app.route('/api/folders' methods=['POST'])
def create_folder():
    data = request.json
    res = supabase.table("folders").insert({
        "name": data['name'],
        "user_id": data['user_id']
    }).execute()

    # Se foi enviado uma imagem com a nova pasta
    if 'image_url' in data:
        supabase.table("images").insert({
            "folder_id": res.data[0]['id'],
            "user_id": data['user_id'],
            "images_url": data['images_url']
        }).execute()

        return jsonify(res.data[0]), 201

@app.route('/api/save-image', methods=['POST'])
def save_image():
    data = resquest.json
    res = supabase.table("images").insert({
        "folder_id": data['folder_id'],
        "user_id": data['user_id'],
        "images_url": data['images_url']
    }).execute()
    return jsonify({"message": "Imagem salva!"}), 201

@app.route('/api/folder/<int:folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    supabase.table("folders").delete().eq("id", folder_id).execute()
    return jsonify({"message": "Pasta excluída"}), 200

    # Rota de perfil
@app.route('/api/profile/update', methods=['PUT'])
def update_profile():
    data = request.json
    res = supabase.table("profiles").update({
        "full_name": data.get['name'],
        "username": data.get['username'],
        "avatar_url": data.get['avatar_url']
    }).eq("id", data['user_id']).execute()
    return jsonify(res.data)

    if __name__ == '__main__':
        app.run(debug=True, port=5000)
