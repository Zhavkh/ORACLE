const nearAPI = require('near-api-js');
const fs = require('fs');
const path = require('path');

const CONTRACT_PATH = path.join(__dirname, 'contract/target/wasm32-unknown-unknown/release/reputation_oracle_contract.wasm');
const ACCOUNT_ID = 'reputation-oracle.testnet';
const PRIVATE_KEY = 'ed25519:8ypB5Z9YtdbkoLPi1UDHC5JECSrxhfChrB3sCpYhKHgS';
const RPC_URL = 'https://rpc.testnet.fastnear.com';

async function deploy() {
    try {
        // Read WASM file
        const wasmBytes = fs.readFileSync(CONTRACT_PATH);
        console.log(`WASM size: ${wasmBytes.length} bytes`);

        // Setup connection
        const keyPair = nearAPI.utils.KeyPairEd25519.fromString(PRIVATE_KEY.replace('ed25519:', ''));
        const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
        await keyStore.setKey('testnet', ACCOUNT_ID, keyPair);

        const near = await nearAPI.connect({
            networkId: 'testnet',
            keyStore: keyStore,
            nodeUrl: RPC_URL,
            walletUrl: 'https://testnet.mynearwallet.com',
            helperUrl: 'https://helper.testnet.near.org',
            explorerUrl: 'https://testnet.nearblocks.io'
        });

        const account = await near.account(ACCOUNT_ID);
        
        console.log('Deploying contract...');
        
        // Deploy contract with initialization
        const result = await account.deployContract(wasmBytes);
        console.log('Contract deployed!');
        console.log('Result:', result);

        // Initialize the contract
        console.log('Initializing contract...');
        const initResult = await account.functionCall({
            contractId: ACCOUNT_ID,
            methodName: 'new',
            args: {},
            gas: '300000000000000', // 300 Tgas
            attachedDeposit: '0'
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
