#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use stylus_sdk::{alloy_primitives::B256, prelude::*, storage::StorageAddress};

sol_storage! {
    #[entrypoint]
    pub struct Airdrop {
        /// Mapping from claim code hash to bool status
        /// • false → unregistered or claimed
        /// • true → registered and not yet claimed
        mapping(B256 => bool) claim_codes;

        /// Owner of the contract
        StorageAddress owner;
    }
}

#[public]
impl Airdrop {
    /// Initialize the contract
    pub fn init(&mut self) -> Result<(), Vec<u8>> {
        let sender = self.vm().msg_sender();
        self.owner.set(sender);
        Ok(())
    }

    /// Register a new code (only owner)
    pub fn register_code(&mut self, code_hash: B256) -> Result<(), Vec<u8>> {
        self.ensure_owner()?;

        self.claim_codes.setter(code_hash).set(true);
        Ok(())
    }

    /// Claim a code (only if unclaimed)
    pub fn claim(&mut self, code_hash: B256) -> Result<(), Vec<u8>> {
        if self.claim_codes.get(code_hash) {
            // TODO: do the airdprop here
            self.claim_codes.setter(code_hash).set(false);
            return Ok(());
        }

        return Err(b"Code not registered or alredy claimed".to_vec());
    }

    /// Check if a code can be claimed
    pub fn can_claim(&self, code_hash: B256) -> bool {
        self.claim_codes.get(code_hash)
    }

    fn ensure_owner(&self) -> Result<(), Vec<u8>> {
        if self.owner.get() != self.vm().msg_sender() {
            Err(b"Only owner".to_vec())
        } else {
            Ok(())
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
        let vm = TestVM::default();
        let mut contract = Airdrop::from(&vm);

        // Contract must be initialized
        assert!(contract.init().is_ok());

        // Define a code hash
        let code_hash =
            hex_to_b256("9c7f0bb206d627b443c6297dc2b547a80c92b7ff9e2c9065dfdbb7aa01ab8f3e");

        // Initially not registered
        assert!(!contract.can_claim(code_hash));

        // Register by owner
        assert!(contract.register_code(code_hash).is_ok());
        assert!(contract.can_claim(code_hash));

        // Claim it successfully
        assert!(contract.claim(code_hash).is_ok());
        assert!(!contract.can_claim(code_hash));

        // Reclaim should fail
        let err = contract.claim(code_hash).unwrap_err();
        assert_eq!(err, b"Code not registered or alredy claimed".to_vec());
    }
}
