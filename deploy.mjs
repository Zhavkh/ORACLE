import { Account, JsonRpcProvider, teraToGas } from 'near-api-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTRACT_PATH = path.join(__dirname, 'contract/target/wasm32-unknown-unknown/release/reputation_oracle_contract.wasm');
const ACCOUNT_ID = 'reputation-oracle.testnet';
const PRIVATE_KEY = 'ed25519:8ypB5Z9YtdbkoLPi1UDHC5JECSrxhfChrB3sCpYhKHgS';
const RPC_URL = 'https://rpc.testnet.fastnear.com';

async function deploy() {
    try {
        // Read WASM file
        const wasmBytes = fs.readFileSync(CONTRACT_PATH);
        console.log(`WASM size: ${wasmBytes.length} bytes`);

        // Create provider
        const provider = new JsonRpcProvider({ url: RPC_URL });
        console.log('Provider created');

        // Create account with private key
        const account = new Account(ACCOUNT_ID, provider, PRIVATE_KEY);
        console.log('Account created');
        
        console.log('Deploying contract...');
        
        // Deploy contract
        const result = await account.deployContract(wasmBytes);
        console.log('Contract deployed!');
        console.log('Result:', result);

        // Initialize the contract
        console.log('Initializing contract...');
        const initResult = await account.callFunction({
            contractId: ACCOUNT_ID,
            methodName: 'new',
            args: {},
            gas: teraToGas('30'),
            deposit: '0'
        });
        console.log('Contract initialized!');
        console.log('Init result:', initResult);

        console.log('\n✅ Deploy successful!');
        console.log(`Contract: ${ACCOUNT_ID}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deploy();
