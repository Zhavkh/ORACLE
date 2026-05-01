#!/usr/bin/env python3
"""
Прямой деплой через NEAR RPC API с подписью транзакции
Обходит все проблемы с CLI и UI
"""

import json
import base64
import hashlib
import time
import sys
from pathlib import Path
from urllib.request import Request, urlopen

# Конфигурация
ACCOUNT_ID = "reputation-oracle.testnet"
PRIVATE_KEY = "ed25519:8ypB5Z9YtdbkoLPi1UDHC5JECSrxhfChrB3sCpYhKHgS"
CONTRACT_PATH = "./contract/target/wasm32-unknown-unknown/release/reputation_oracle_contract.wasm"
RPC_URL = "https://rpc.testnet.fastnear.com"

def read_wasm():
    with open(CONTRACT_PATH, "rb") as f:
        return f.read()

def rpc_call(method, params):
    """Вызов RPC метода"""
    payload = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": method,
        "params": params
    }
    req = Request(RPC_URL, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
    with urlopen(req) as response:
        return json.loads(response.read().decode())

def get_account_state():
    """Получить состояние аккаунта"""
    return rpc_call("query", {
        "request_type": "view_account",
        "account_id": ACCOUNT_ID,
        "finality": "final"
    })

def deploy_via_api():
    """Деплой через RPC API"""
    wasm_bytes = read_wasm()
    print(f"WASM size: {len(wasm_bytes)} bytes")
    
    # Получаем состояние аккаунта
    state = get_account_state()
    print(f"Account state: {state}")
    
    # Для деплоя нужна подписанная транзакция
    # Это сложно без библиотеки near-sdk-js
    
    print("\nДля прямого API деплоя нужна библиотека для подписи транзакций.")
    print("Устанавливаем py-near...")
    
    try:
        import subprocess
        subprocess.run([sys.executable, "-m", "pip", "install", "py-near"], check=True)
        
        from py_near import Account, KeyPair
        
        key_pair = KeyPair.from_string(PRIVATE_KEY)
        account = Account(RPC_URL, ACCOUNT_ID, key_pair)
        
        print("Deploying contract...")
        result = account.deploy_contract(wasm_bytes)
        print(f"Deploy result: {result}")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if not Path(CONTRACT_PATH).exists():
        print(f"Error: WASM not found at {CONTRACT_PATH}")
        sys.exit(1)
    
    success = deploy_via_api()
    if success:
        print("✅ Deploy successful!")
    else:
        print("❌ Deploy failed")
        sys.exit(1)
