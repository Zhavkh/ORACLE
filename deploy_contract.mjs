#!/usr/bin/env node
/**
 * Deploy NEAR Reputation Oracle Contract to testnet
 * Usage: node deploy_contract.mjs
 */

import * as nearAPI from 'near-api-js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// NEAR Testnet Configuration
const NETWORK = 'testnet';
const CONTRACT_NAME = 'reputation-oracle.testnet'; // Change if needed
const MASTER_ACCOUNT = 'reputation-oracle.testnet'; // Your testnet account

// Load private key from environment
const PRIVATE_KEY = process.env.NEAR_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ Set NEAR_PRIVATE_KEY environment variable');
  console.error('   Example: export NEAR_PRIVATE_KEY=ed25519:...');
  process.exit(1);
}

async function deployContract() {
  console.log('🚀 Deploying NEAR Contract...\n');

  try {
    // Setup connection
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
    const keyPair = nearAPI.KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey(NETWORK, MASTER_ACCOUNT, keyPair);

    const near = await nearAPI.connect({
      networkId: NETWORK,
      keyStore,
      nodeUrl: `https://rpc.${NETWORK}.near.org`,
      walletUrl: `https://wallet.${NETWORK}.near.org`,
      helperUrl: `https://helper.${NETWORK}.near.org`,
    });

    const account = await near.account(MASTER_ACCOUNT);

    // Read WASM file
    const wasmPath = join(__dirname, 'contract', 'res', 'reputation_oracle_contract.wasm');
    const wasmBytes = readFileSync(wasmPath);

    console.log(`📦 Contract size: ${(wasmBytes.length / 1024).toFixed(2)} KB`);
    console.log(`🎯 Deploying to: ${CONTRACT_NAME}`);

    // Deploy contract
    const result = await account.deployContract(wasmBytes);
    
    console.log('\n✅ Contract deployed successfully!');
    console.log(`   Transaction: ${result.transaction.hash}`);

    // Initialize contract
    console.log('\n🔧 Initializing contract...');
    
    const contract = new nearAPI.Contract(account, CONTRACT_NAME, {
      viewMethods: ['get_agent', 'get_reputation', 'get_agent_reviews', 'agent_exists'],
      changeMethods: ['new', 'register_agent', 'add_review', 'verify_agent'],
    });

    // Call new() to initialize
    await account.functionCall({
      contractId: CONTRACT_NAME,
      methodName: 'new',
      args: {},
    });

    console.log('✅ Contract initialized!');

    // Test: Register a test agent
    console.log('\n🧪 Testing contract...');
    
    await account.functionCall({
      contractId: CONTRACT_NAME,
      methodName: 'register_agent',
      args: {
        agent_id: 'test_agent_v1',
        name: 'Test Trading Bot',
      },
      gas: '300000000000000',
    });

    console.log('✅ Test agent registered!');

    console.log('\n📋 Contract Summary:');
    console.log(`   Account: ${CONTRACT_NAME}`);
    console.log(`   Network: ${NETWORK}`);
    console.log(`   Explorer: https://explorer.${NETWORK}.near.org/accounts/${CONTRACT_NAME}`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.message.includes('Account does not exist')) {
      console.error(`\n   Create account first: near create-account ${CONTRACT_NAME} --masterAccount YOUR_ACCOUNT.testnet`);
    }
    if (error.message.includes('Key')) {
      console.error('\n   Check your NEAR_PRIVATE_KEY is correct');
    }
    process.exit(1);
  }
}

deployContract();
