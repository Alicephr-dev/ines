import os
from flask import Flask, render_template
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask (__name__,
    template_folder='../frontend', static_folder='../frontend/static')

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.route('/')
def home():
    return "Site da Inês em construção!"

if __name__ == '__main__':
    app.run(debug=True)
