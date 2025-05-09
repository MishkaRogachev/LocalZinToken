#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, B256, U256},
    prelude::*,
    storage::StorageAddress,
};

// Amount of tokens to airdrop
const TOKENS_TO_AIRDROP: u128 = 1_000_000_000_000_000_000_000; // 1000 * 10^18
const MAX_CODES_TO_REGISTER: usize = 500;

sol_interface! {
    interface ILocalZinToken {
        function mint(address to, uint256 amount) external;
    }
}

sol_storage! {
    #[entrypoint]
    pub struct LocalZinAirdrop {
        /// Mapping from claim code hash to bool status
        /// • false → unregistered or claimed
        /// • true → registered and not yet claimed
        mapping(B256 => bool) claim_codes;

        /// Owner of the contract
        StorageAddress owner;

        /// Address of the ERC-20 token contract to call `mint`
        StorageAddress token;
    }
}

#[public]
impl LocalZinAirdrop {
    /// Initialize the contract
    pub fn init(&mut self) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        self.owner.set(sender);
        Ok(())
    }

    /// Get the owner of the contract
    pub fn get_owner(&self) -> Address {
        self.owner.get()
    }

    /// Set the address of LocalZinToken mint contract (only owner)
    pub fn set_token_address(&mut self, token: Address) -> Result<(), Vec<u8>> {
        self.ensure_owner()?;
        self.token.set(token);
        Ok(())
    }

    /// Register a new code (only owner)
    pub fn register_code(&mut self, code_hash: B256) -> Result<(), Vec<u8>> {
        self.ensure_owner()?;

        self.claim_codes.setter(code_hash).set(true);
        Ok(())
    }

    /// Register multiple code hashes at once (only owner)
    pub fn register_codes(&mut self, code_hashes: Vec<B256>) -> Result<(), Vec<u8>> {
        if code_hashes.len() > MAX_CODES_TO_REGISTER {
            return Err(b"Too many codes at once".to_vec());
        }

        self.ensure_owner()?;

        for code_hash in code_hashes {
            self.claim_codes.setter(code_hash).set(true);
        }

        Ok(())
    }

    /// Claim a code (only if unclaimed)
    pub fn claim(&mut self, code_hash: B256) -> Result<(), Vec<u8>> {
        if !self.claim_codes.get(code_hash) {
            return Err(b"Code not registered or already claimed".to_vec());
        }

        self.airdrop(U256::from(TOKENS_TO_AIRDROP), self.vm().msg_sender())?;
        self.claim_codes.setter(code_hash).set(false);

        Ok(())
    }

    /// Check if a code can be claimed
    pub fn can_claim(&self, code_hash: B256) -> bool {
        self.claim_codes.get(code_hash)
    }
}

impl LocalZinAirdrop {
    fn ensure_owner(&self) -> Result<(), Vec<u8>> {
        if self.owner.get() != self.vm().msg_sender() {
            Err(b"Only owner".to_vec())
        } else {
            Ok(())
        }
    }

    fn airdrop(&mut self, amount: U256, recipient: Address) -> Result<(), Vec<u8>> {
        let token_address = self.token.get();

        if token_address == Address::ZERO {
            return Err(b"Token address not set".to_vec());
        }

        let token_contract = ILocalZinToken::new(token_address);
        let config = stylus_sdk::call::Call::new().gas(self.vm().evm_gas_left() / 2);

        match token_contract.mint(config, recipient, amount) {
            Ok(_) => Ok(()),
            Err(e) => Err(e.into()),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use alloy_primitives::B256;
    use hex::FromHex;
    use stylus_sdk::testing::*;

    fn hex_to_b256(s: &str) -> B256 {
        B256::from_hex(s).expect("Invalid hex string")
    }

    #[test]
    fn test_qr_airdrop_logic() {
        let vm: TestVM = TestVMBuilder::new()
            // Set the transaction sender address (msg.sender in Solidity)
            .sender(alloy_primitives::address!(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
            ))
            // Set the address where our contract is deployed
            .contract_address(alloy_primitives::address!(
                "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            ))
            // Set the ETH value sent with the transaction (msg.value in Solidity)
            .value(U256::from(1))
            .build();
        vm.set_block_number(12345678);

        let mut contract = LocalZinAirdrop::from(&vm);

        // Contract must be initialized
        assert!(contract.init().is_ok());

        // Define a code hash
        let code_hash =
            hex_to_b256("9c7f0bb206d627b443c6297dc2b547a80c92b7ff9e2c9065dfdbb7aa01ab8f3e");

        // Initially not registered
        assert!(!contract.can_claim(code_hash));

        // Register hash by owner
        assert!(contract.register_code(code_hash).is_ok());
        assert!(contract.can_claim(code_hash));

        // Set the token address in contract storage
        let token_address =
            alloy_primitives::address!("0x1234567890123456789012345678901234567890");
        assert!(contract.set_token_address(token_address).is_ok());

        // Mint selector to match mint(address,uint256)
        let selector = &alloy_primitives::keccak256("mint(address,uint256)")[..4];
        assert_eq!(selector, &[0x40, 0xc1, 0x0f, 0x19]);

        // NOTE: for current stylus version mock calls are not supported for sol_interface
        // Setup the mock to return success for mint calls
        // vm.mock_call(token_address, selector.into(), Ok(vec![]));

        // // Claim it successfully
        // assert!(contract.claim(code_hash).is_ok());
        // assert!(!contract.can_claim(code_hash));

        // // Reclaim should fail
        // let err = contract.claim(code_hash).unwrap_err();
        // assert_eq!(err, b"Code not registered or already claimed".to_vec());
    }
}
