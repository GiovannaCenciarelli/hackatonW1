import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import yfinance as yf
import pandas as pd

# Configuração da página
st.set_page_config(
    page_title="Simulador de Investimentos",
    layout="wide",
    page_icon="📈",
    initial_sidebar_state="expanded"
)

# Estilo personalizado
st.markdown("""
    <style>
        .main {
            background-color: #0f1117;
            color: #ffffff;
        }
        h1 {
            color: #4fc3f7;
            border-bottom: 2px solid #4fc3f7;
        }
        .st-bw {
            background-color: #1e2130;
            border-radius: 10px;
            padding: 20px;
        }
    </style>
""", unsafe_allow_html=True)

st.title("📈 Simulador de Investimentos Inteligente")

# Sidebar
with st.sidebar:
    st.header("⚙️ Configurações")
    timeframe = st.selectbox("Período de Análise", ["1D", "1W", "1M", "1Y", "5Y"], index=2)
    risk_profile = st.select_slider("Perfil de Risco", ["Conservador", "Moderado", "Agressivo"])
    st.markdown("---")
    st.info("ℹ️ Use os campos abaixo para simular diferentes cenários de investimento.")

# Dados de mercado
@st.cache_data
def get_market_data(ticker, period):
    if not ticker:
        return None
    data = yf.download(ticker, period=period, group_by="ticker")
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)
    data = data.loc[:, ~data.columns.duplicated()]
    return data

# Tipos de investimentos
investment_config = {
    "Renda Fixa": {
        "ticker": None,
        "color": "#00bfa5",
        "info": "Tesouro Direto, CDB, LCIs/LCAs",
        "fixed_return": 0.1089
    },
    "Ações": {
        "ticker": "^BVSP",
        "color": "#2979ff",
        "info": "Ações brasileiras (Ibovespa)"
    },
    "FIIs": {
        "ticker": "IFIX.SA",
        "color": "#ff9100",
        "info": "Fundos Imobiliários"
    },
    "ETFs": {
        "ticker": "BOVA11.SA",
        "color": "#e53935",
        "info": "ETFs de Índice"
    },
    "Previdência": {
        "ticker": None,
        "color": "#8e24aa",
        "info": "Fundos de Previdência",
        "fixed_return": 0.085
    },
    "Cripto": {
        "ticker": "BTC-USD",
        "color": "#fdd835",
        "info": "Criptomoedas"
    },
    "Internacional": {
        "ticker": "IVVB11.SA",
        "color": "#43a047",
        "info": "Mercado Internacional"
    }
}

# Entradas do usuário
st.header("💵 Alocação de Recursos")
cols = st.columns(4)
investment_values = {}

for i, (name, config) in enumerate(investment_config.items()):
    with cols[i % 4]:
        investment_values[name] = st.number_input(
            f"{name} (R$)",
            min_value=0.0,
            step=1000.0,
            key=name,
            help=config["info"]
        )

# Cálculo de retornos
def calculate_returns():
    period_map = {"1D": "1d", "1W": "5d", "1M": "1mo", "1Y": "1y", "5Y": "5y"}
    day_map = {"1D": 1, "1W": 7, "1M": 30, "1Y": 365, "5Y": 1825}
    results = {}

    for name, config in investment_config.items():
        value = investment_values[name]
        if value <= 0:
            results[name] = {"current": 0.0, "return": 0.0}
            continue

        if config["ticker"]:
            data = get_market_data(config["ticker"], period_map[timeframe])
            if data is not None and not data.empty and "Close" in data.columns:
                initial = data['Close'].iloc[0]
                current = data['Close'].iloc[-1]
                returns = (current - initial) / initial
            else:
                returns = 0.0
        else:
            returns = config.get("fixed_return", 0.0) * (day_map[timeframe] / 365)

        results[name] = {
            "current": value * (1 + returns),
            "return": float(returns)
        }

    return results

# Processamento
performance = calculate_returns()
total_invested = sum(investment_values.values())
total_current = sum(v["current"] for v in performance.values())

if total_invested > 0:
    st.header("📊 Distribuição da Carteira")
    view_mode = st.radio("Visualização:", ["Valor Investido", "Valor Atual"], horizontal=True)

    values = [
        investment_values[name] if view_mode == "Valor Investido"
        else performance[name]["current"]
        for name in investment_config
    ]

    pull = [0.02 if performance[name]["return"] < 0 else 0 for name in investment_config]

    fig = go.Figure(data=[go.Pie(
        labels=list(investment_config.keys()),
        values=values,
        hole=0.4,
        marker=dict(colors=[config["color"] for config in investment_config.values()]),
        textinfo="label+percent",
        hoverinfo="label+value+percent",
        pull=pull
    )])

    fig.update_layout(
        height=600,
        showlegend=False,
        margin=dict(t=40, b=20),
        font=dict(color="white")
    )
    st.plotly_chart(fig, use_container_width=True)

    st.header("📈 Desempenho dos Ativos")
    tabs = st.tabs(list(investment_config.keys()))

    for i, (name, config) in enumerate(investment_config.items()):
        with tabs[i]:
            if config["ticker"]:
                data = get_market_data(config["ticker"], "6mo")
                if data is not None and not data.empty:
                    if isinstance(data.columns, pd.MultiIndex):
                        data.columns = data.columns.get_level_values(0)
                    data = data.loc[:, ~data.columns.duplicated()]

                    if "Close" in data.columns:
                        fig = px.line(
                            data,
                            x=data.index,
                            y="Close",
                            title=f"Histórico de {name} ({config['ticker']})"
                        )
                        fig.update_layout(
                            yaxis_title="Preço (R$)",
                            xaxis_title="Data",
                            template="plotly_dark"
                        )
                        st.plotly_chart(fig, use_container_width=True)
                    else:
                        st.warning(f"Coluna 'Close' não encontrada para {name}.")
                else:
                    st.warning("Dados não disponíveis.")
            else:
                st.info("Este tipo de investimento utiliza projeções baseadas em médias históricas.")

    st.header("📋 Resumo da Carteira")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Investido", f"R$ {total_invested:,.2f}")
    with col2:
        st.metric("Valor Atual", f"R$ {total_current:,.2f}")
    with col3:
        change = ((total_current - total_invested) / total_invested * 100)
        st.metric(
            "Variação Total",
            f"{change:.2f}%",
            delta=f"{change:.2f}%",
            delta_color="inverse" if change < 0 else "normal"
        )

else:
    st.warning("⚠️ Adicione valores acima para simular seu investimento.")

# Explicações
with st.expander("ℹ️ Entenda os Tipos de Investimento"):
    for name, config in investment_config.items():
        st.markdown(f"**{name}**")
        st.markdown(f"- {config['info']}")
        st.markdown("---")
