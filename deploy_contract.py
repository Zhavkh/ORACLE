#!/usr/bin/env python3
"""
Деплой контракта через NEAR RPC напрямую
Обходит проблемы с CLI и UI
"""

import json
import base64
import hashlib
import urllib.request
import urllib.error
import ed25519  # pip install ed25519

# Конфигурация
ACCOUNT_ID = "mynearnest777.testnet"
CONTRACT_PATH = "./contract/target/wasm32-unknown-unknown/release/reputation_oracle_contract.wasm"
RPC_URL = "https://rpc.testnet.fastnear.com"

# Нужен private key от аккаунта (получить можно из MyNearWallet → Export)
# Или используем ключ, сохранённый near-cli (если есть)

def read_wasm():
    with open(CONTRACT_PATH, "rb") as f:
        return f.read()

def deploy_via_api():
    """Деплой через прямой вызов RPC"""
    wasm_bytes = read_wasm()
    print(f"WASM size: {len(wasm_bytes)} bytes")
    
    # Кодировать в base64
    wasm_base64 = base64.b64encode(wasm_bytes).decode()
    
    # Аргументы для new()
    init_args = json.dumps({})
    
    # Создать action для deploy + init
    # Это сложная процедура требующая ключей...
    
    print("Для автоматического деплоя нужен private key.")
    print(f"Альтернатива: используй сайт https://wasm-runner.vercel.app/")
    print(f"Или: near-cli с параметром --force")
    
    # Пробуем через near-cli с force
    import subprocess
    cmd = [
        "near", "deploy", ACCOUNT_ID, CONTRACT_PATH,
        "--initFunction", "new",
        "--initArgs", "'{}'",
        "--force"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    print(result.stderr)

if __name__ == "__main__":
    deploy_via_api()
