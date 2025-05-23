from flask import Flask, jsonify
from investmentData import InvestmentData
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db = InvestmentData()

@app.route('/api/assets', methods=['GET'])
def get_assets():
    assets = db.get_assets()
    return jsonify({
        'tesouro': [a for a in assets if a[0] == 'td'],
        'stocks': [a for a in assets if a[0] == 'stock'],
        'fiis': [a for a in assets if a[0] == 'fii']
    })

@app.route('/api/goals', methods=['GET'])
def get_goals():
    goals = db.get_goals()
    return jsonify(goals)

@app.route('/api/refresh', methods=['POST'])
def refresh_data():
    db.fetch_tesouro_direto()
    db.fetch_stocks()
    db.fetch_fiis()
    return jsonify({'status': 'data refreshed'})

if __name__ == '__main__':
    app.run(debug=True)
