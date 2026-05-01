#!/usr/bin/env python3
"""
Прямой деплой через NEAR RPC с private key
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

def deploy_via_near_cli_with_env():
    """Деплой через near-cli с переменной окружения"""
    import subprocess
    import os
    
    # Устанавливаем переменную окружения для RPC
    env = os.environ.copy()
    env["NEAR_CLI_TESTNET_RPC_SERVER_URL"] = RPC_URL
    
    cmd = [
        "near", "deploy", ACCOUNT_ID, CONTRACT_PATH,
        "--initFunction", "new",
        "--initArgs", "{}"
    ]
    
    print("Running deploy with custom RPC...")
    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
    
    return result.returncode == 0

if __name__ == "__main__":
    if not Path(CONTRACT_PATH).exists():
        print(f"Error: WASM not found at {CONTRACT_PATH}")
        sys.exit(1)
    
    success = deploy_via_near_cli_with_env()
    if success:
        print("✅ Deploy successful!")
    else:
        print("❌ Deploy failed")
        sys.exit(1)
