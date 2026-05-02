# B7systems Deployment Guide

## Prerequisites

1. **Install Rust** (for contract compilation)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```

2. **Install Node.js dependencies**
   ```bash
   cd web
   npm install
   cd ..
   ```

3. **Set environment variables**
   ```bash
   # Copy example and fill in your values
   cp .env.example .env
   # Edit .env with your Supabase and NEAR credentials
   ```

## 1. Build NEAR Smart Contract

```bash
cd contract
./build.sh  # Or: cargo build --target wasm32-unknown-unknown --release
cd ..
```

The compiled contract will be at:
- `contract/target/wasm32-unknown-unknown/release/reputation_oracle_contract.wasm`
- Copy to: `contract/res/reputation_oracle_contract.wasm`

## 2. Deploy NEAR Contract to Testnet

### Option A: Using Node.js script

```bash
# Set your private key
export NEAR_PRIVATE_KEY=ed25519:YOUR_PRIVATE_KEY_HERE

# Run deployment
node deploy_contract.mjs
```

### Option B: Using NEAR CLI

```bash
# Install near-cli
npm install -g near-cli

# Login
near login

# Create contract account (if doesn't exist)
near create-account reputation-oracle.testnet --masterAccount YOUR_ACCOUNT.testnet

# Deploy
near deploy --accountId reputation-oracle.testnet \
  --wasmFile contract/res/reputation_oracle_contract.wasm \
  --initFunction new \
  --initArgs '{}'
```

## 3. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect GitHub repo to Vercel for auto-deployment.

## 4. Configure Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://b7systems.vercel.app
```

## 5. Test the Deployment

1. **Check contract**: https://explorer.testnet.near.org/accounts/reputation-oracle.testnet
2. **Check frontend**: https://b7systems.vercel.app
3. **Test API**: https://b7systems.vercel.app/agents

## Troubleshooting

### Contract deployment fails
- Ensure account `reputation-oracle.testnet` exists
- Check you have enough NEAR tokens (0.5+ NEAR recommended)
- Verify private key format: `ed25519:...`

### Frontend shows old version
- Clear browser cache: `Ctrl+Shift+R`
- Check Vercel deployment logs
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### API errors
- Check Supabase credentials in environment variables
- Verify RLS policies are configured
- Check Vercel function logs

## Contract Methods

### View Methods
- `get_agent(agent_id: string)` - Get agent details
- `get_reputation(agent_id: string)` - Get agent reputation score
- `get_agent_reviews(agent_id: string)` - Get agent reviews
- `agent_exists(agent_id: string)` - Check if agent exists

### Change Methods
- `register_agent(agent_id: string, name: string)` - Register new agent
- `add_review(agent_id: string, score: u8, comment: string)` - Add review
- `verify_agent(agent_id: string)` - Verify agent (requires 0.1 NEAR)

## API Endpoints

See `/api` page on deployed site for full API documentation.
