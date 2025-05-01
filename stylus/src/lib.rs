#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use stylus_sdk::{alloy_primitives::B256, prelude::*};

sol_storage! {
    #[entrypoint]
    pub struct Airdrop {
        /// Mapping from claim code hash to claimed status
        mapping(B256 => bool) claims;
    }
}

#[public]
impl Airdrop {
    /// Claim a QR code using its keccak256 hash
    pub fn claim(&mut self, code_hash: B256) -> Result<(), Vec<u8>> {
        if self.claims.get(code_hash) {
            return Err(b"Code already used".to_vec());
        }

        self.claims.setter(code_hash).set(true);
        Ok(())
    }

    /// Check whether a QR code hash was claimed
    pub fn is_claimed(&self, code_hash: B256) -> bool {
        self.claims.get(code_hash)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use alloy_primitives::B256;
    use hex::FromHex;
    use stylus_sdk::testing::*;

    #[test]
    fn test_qr_claim() {
        let vm = TestVM::default();
        let mut contract = Airdrop::from(&vm);

        // Convert hex string to B256
        let code_hash_str = "9c7f0bb206d627b443c6297dc2b547a80c92b7ff9e2c9065dfdbb7aa01ab8f3e";
        let code_hash = B256::from_hex(code_hash_str).expect("Invalid hex string");

        // Should initially be not claimed
        assert_eq!(contract.is_claimed(code_hash), false);

        // Claim it
        let result = contract.claim(code_hash);
        assert!(result.is_ok());

        // Should now be claimed
        assert_eq!(contract.is_claimed(code_hash), true);

        // Second claim should fail
        let result = contract.claim(code_hash);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), b"Code already used".to_vec());
    }
}
