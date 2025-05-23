import random
import yfinance as yf
import sqlite3
from datetime import datetime

class InvestmentData:
    def __init__(self, db_name='investment.db'):
        self.db_name = db_name
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS assets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    name TEXT NOT NULL,
                    ticket TEXT,
                    price REAL,
                    last_updated TIMESTAMP
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS goals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    amount REAL,
                    last_updatedd TIMESTAMP
                )
            ''')
            conn.commit()

    def fetch_tesouro_direto(self):
        titles = [
            ("Tesouro Selic", None),
            ("Tesouro IPCA+", None),
            ("Tesouro Prefixado", None),
            ("Tesouro IPCA+ 2026", None),
            ("Tesouro Prefixado 2029", None),
            ("Tesouro IPCA+ 2035", None),
            ("Tesouro Prefixado 2031", None),
            ("Tesouro IPCA+ 2045", None),
            ("Tesouro Prefixado 2033", None),
            ("Tesouro IPCA+ 2040", None)
        ]

        data = []

        for name, _ in titles:
            price = round(random.uniform(90, 110), 2)
            data.append(('td', name, None, price))

        self._save_assets(data)
        return data

    def fetch_stocks(self):
        tickers = [
            "PETR4.SA", "VALE3.SA", "ITUB4.SA", "B3SA3.SA",
            "ABEV3.SA", "LREN3.SA", "WEGE3.SA", "BBAS3.SA",
            "RENT3.SA", "CSAN3.SA"
        ]

        return self._fetch_yfinance_data(tickers, 'stock')

    def fetch_fiis(self):
        fii_tickers = [
            "KNRI11.SA", "HGLG11.SA", "MXRF11.SA", "XPML11.SA",
            "HSML11.SA", "RBRP11.SA", "HCTR11.SA", "RBRD11.SA"
        ]
        return self._fetch_yfinance_data(fii_tickers, 'fii')

    def _fetch_yfinance_data(self, tickers, asset_type):
        data = []
        for ticker in tickers:
            price = None
            try:
                hist = yf.Ticker(ticker).history(period='1d')
                if not hist.empty:
                    price = round(hist['Close'][-1], 2)
            except Exception:
                price = None
            data.append((asset_type, ticker, ticker, price))

        self._save_assets(data)
        return data

    def _save_assets(self, assets):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM assets')
            for asset_type, name, ticker, price in assets:
                cursor.execute('''
                    INSERT INTO assets (type, name, ticket, price, last_updated)
                    VALUES (?, ?, ?, ?, ?)
                ''', (asset_type, name, ticker, price, datetime.now()))
            conn.commit()

    def save_goals(self, goals):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM goals')

            for name, amount in goals.items():
                if amount.strip():
                    cursor.execute('''
                        INSERT INTO goals (name, amount, last_updatedd)
                        VALUES (?, ?, ?)
                    ''', (name, float(amount), datetime.now()))
            conn.commit()

    def get_assets(self):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT type, name, ticket, price FROM assets')
            return cursor.fetchall()

    def get_goals(self):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT name, amount FROM goals')
            return cursor.fetchall()
