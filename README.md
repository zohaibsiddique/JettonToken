# 🦖 JettonToken – Jetton Token on TON Blockchain

**JettonToken** is a custom Jetton token built on the [TON Blockchain](https://ton.org/), developed using [Tact](https://github.com/tact-lang/tact). This contract implements the TEP-74 Jetton standard and adds extended functionality including mint control, max supply, and public minting.


---

## 📦 Contracts Overview

This repository includes the following smart contracts:

### 🔹 `JettonToken.tact`
- **Jetton Minter contract**
- Compliant with `@interface("org.ton.jetton.master")`
- Implements:
  - `mint(to, amount, response_destination)` with `max_supply` check
  - `Mint` and `MintPublic` messages
  - Admin-only mint disabling (`Owner: MintClose`)
  - Burn handling via `TokenBurnNotification`
  - Off-chain getters for Jetton data and wallet address

### 🔹 `JettonDefaultWallet.tact`
- **Wallet contract** deployed for each holder
- Compliant with `@interface("org.ton.jetton.wallet")`
- Implements:
  - Receive/send Jettons
  - Burn Jettons
  - Notify owners upon receipt
  - Reserve TON for storage
  - Bounce handlers for failed transfers/burns
  - Getter for wallet data

---

## 🛠 Features

| Feature                        | Description |
|-------------------------------|-------------|
| ✅ TEP-74 Jetton Compliant     | Implements all required interfaces |
| 🎯 Max Supply Enforced         | Minting can't exceed total supply |
| 🧑‍💼 Owner Minting             | Only contract owner can mint tokens via `Mint` |
| 🌐 Public Minting              | Anyone can mint tokens via `MintPublic` (if enabled) |
| 🔒 Mint Locking                | Owner can permanently disable minting via `"Owner: MintClose"` |
| 🔥 Burning Supported           | Jetton holders can burn their tokens |
| 🔁 Excess Refunds              | Handles forwarding and cashback mechanisms |
| 📦 On-chain Metadata           | Jetton content (name, symbol, image) stored as Cell |

---

### Minting
```ts
message Mint {
  amount: Int;
  receiver: Address;
}

message MintPublic {
  amount: Int;
}

message TokenTransfer { ... }
message TokenBurn { ... }
message TokenBurnNotification { ... }
message TokenTransferInternal { ... }

