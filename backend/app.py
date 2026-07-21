from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes so your frontend can communicate with it

# Ensure DB is created in the same directory as app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, 'CodeVerse.db')

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Create a table for storing user data
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            points INTEGER DEFAULT 0,
            coins INTEGER DEFAULT 0,
            diamonds INTEGER DEFAULT 0,
            health INTEGER DEFAULT 100
        )
    ''')
    
    # Create leaderboard table
    c.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            score INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create achievements table
    c.execute('''
        CREATE TABLE IF NOT EXISTS achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            achievement_name TEXT NOT NULL,
            UNIQUE(username, achievement_name)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize the database when the script is run
if not os.path.exists(DB_NAME):
    init_db()
    print(f"Database {DB_NAME} initialized.")

import logging

# Ensure werkzeug logs are visible
log = logging.getLogger('werkzeug')
log.setLevel(logging.INFO)

@app.before_request
def log_request_info():
    # This will explicitly print every request to the terminal
    print(f"[API REQUEST] {request.method} {request.path}")

@app.route('/')
def home():
    return jsonify({"message": "Welcome to CodeVerse API!"})

@app.route('/api/save_progress', methods=['POST'])
def save_progress():
    data = request.json
    username = data.get('username')
    
    if not username:
        return jsonify({"error": "Username is required!"}), 400
        
    score = int(data.get('score', 0))
    coins = int(data.get('coins', 0))
    diamonds = int(data.get('diamonds', 0))
    health = int(data.get('health', 100))
    achievements = data.get('completedAchievements', [])
        
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # 1. Update users table
    c.execute("SELECT id FROM users WHERE username=?", (username,))
    if c.fetchone():
        c.execute("UPDATE users SET points=?, coins=?, diamonds=?, health=? WHERE username=?", 
                  (score, coins, diamonds, health, username))
    else:
        c.execute("INSERT INTO users (username, points, coins, diamonds, health) VALUES (?, ?, ?, ?, ?)", 
                  (username, score, coins, diamonds, health))
                  
    # 2. Update leaderboard table
    c.execute("SELECT id FROM leaderboard WHERE username=?", (username,))
    if c.fetchone():
        c.execute("UPDATE leaderboard SET score=?, last_updated=CURRENT_TIMESTAMP WHERE username=?", (score, username))
    else:
        c.execute("INSERT INTO leaderboard (username, score) VALUES (?, ?)", (username, score))
        
    # 3. Update achievements table
    for ach in achievements:
        c.execute("INSERT OR IGNORE INTO achievements (username, achievement_name) VALUES (?, ?)", (username, ach))
        
    conn.commit()
    conn.close()
    
    return jsonify({"message": f"Progress saved successfully for {username}!"}), 200

@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Get top 10 players ordered by highest score from leaderboard table
    c.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    rows = c.fetchall()
    conn.close()
    
    leaderboard_data = [{"username": row[0], "points": row[1]} for row in rows]
    return jsonify({"leaderboard": leaderboard_data}), 200

@app.route('/api/get_progress/<username>', methods=['GET'])
def get_progress(username):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Get basic stats
    c.execute("SELECT points, coins, diamonds, health FROM users WHERE username=?", (username,))
    user_row = c.fetchone()
    
    if not user_row:
        conn.close()
        return jsonify({"message": "User not found"}), 404
        
    points, coins, diamonds, health = user_row
    
    # Get achievements
    c.execute("SELECT achievement_name FROM achievements WHERE username=?", (username,))
    ach_rows = c.fetchall()
    achievements = [row[0] for row in ach_rows]
    
    conn.close()
    
    return jsonify({
        "username": username,
        "score": points,
        "coins": coins,
        "diamonds": diamonds,
        "health": health,
        "completedAchievements": achievements
    }), 200

if __name__ == '__main__':
    # Use Flask's built-in development server so you can see logs
    print("Starting Flask server...")
    app.run(debug=True, host='127.0.0.1', port=5000)
