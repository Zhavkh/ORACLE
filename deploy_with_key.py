#!/usr/bin/env python3
"""
Деплой контракта с private key через NEAR RPC
"""

import json
import base64
import hashlib
import time
import sys
from pathlib import Path

# Конфигурация
ACCOUNT_ID = "reputation-oracle.testnet"
PRIVATE_KEY = "ed25519:8ypB5Z9YtdbkoLPi1UDHC5JECSrxhfChrB3sCpYhKHgS"
CONTRACT_PATH = "./contract/target/wasm32-unknown-unknown/release/reputation_oracle_contract.wasm"
RPC_URL = "https://rpc.testnet.fastnear.com"

def read_wasm():
    with open(CONTRACT_PATH, "rb") as f:
        return f.read()

def deploy_via_cli():
    """Деплой через near-cli с ключом"""
    import subprocess
    
    # Сохраняем ключ в файл для near-cli
    import os
    home = os.path.expanduser("~")
    creds_dir = os.path.join(home, ".near-credentials", "testnet")
    os.makedirs(creds_dir, exist_ok=True)
    
    key_file = os.path.join(creds_dir, f"{ACCOUNT_ID}.json")
    with open(key_file, "w") as f:
        json.dump({"account_id": ACCOUNT_ID, "private_key": PRIVATE_KEY}, f)
    
    print(f"Key saved to {key_file}")
    
    # Деплой
    cmd = [
        "near", "deploy", ACCOUNT_ID, CONTRACT_PATH,
        "--initFunction", "new",
        "--initArgs", "{}"
    ]
    
    print("Running deploy command...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    
    return result.returncode == 0

if __name__ == "__main__":
    # Проверяем что WASM существует
    if not Path(CONTRACT_PATH).exists():
        print(f"Error: WASM not found at {CONTRACT_PATH}")
        print("Run: cd contract && cargo build --target wasm32-unknown-unknown --release")
        sys.exit(1)
    
    success = deploy_via_cli()
    if success:
        print("✅ Deploy successful!")
    else:
        print("❌ Deploy failed")
        sys.exit(1)
