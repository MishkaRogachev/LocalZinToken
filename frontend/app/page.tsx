'use client';

import { useAccount, useWalletClient, useChainId } from 'wagmi';
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hero } from '@/components/Hero';

import { AIRDROP_ADDRESS_DEVNET, AIRDROP_ADDRESS_MAINNET } from '../contracts/config';
import airdropAbi from '../contracts/local_zin_airdrop.json';
import WalletInstructions from '@/components/wallet_instructions';

import t from '../i18n/ru.json';

enum ClaimStatus {
  Unregistered = 0,
  Registered = 1,
  Claimed = 2,
}

export default function ClaimPage() {
  const searchParams = useSearchParams();

  let codeHash = searchParams.get('code');
  if (codeHash && !codeHash.startsWith("0x")) {
    codeHash = `0x${codeHash}`;
  }

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [claimStatus, setClaimStatus] = useState<ClaimStatus | null>(null);
  const [codeChecked, setCodeChecked] = useState(false);

  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const [airdropContract, setAirdropContract] = useState<ethers.Contract | null>(null);

  const chainId = useChainId();

  useEffect(() => {
    if (!walletClient) return;
  
    (async () => {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      let contract_address;

      if (chainId === arbitrumSepolia.id) {
        contract_address = AIRDROP_ADDRESS_DEVNET;
      } else if (chainId === arbitrum.id) {
        contract_address = AIRDROP_ADDRESS_MAINNET;
      } else {
        console.error("Unsupported chain ID:", chainId);
        return;
      }

      const contract = new ethers.Contract(contract_address, airdropAbi, signer);
      setAirdropContract(contract);
    })();
  }, [walletClient, chainId]);

  useEffect(() => {
    if (!airdropContract || !codeHash) return;

    (async () => {
      try {
        setCodeChecked(false);
        const result = await airdropContract.getClaimStatus(codeHash);
        console.log('Claim status:', result.toString());
        setClaimStatus(Number(result));
        setCodeChecked(true);
      } catch (err) {
        console.error('Failed to check claimable status:', err);
        setClaimStatus(null);
        setCodeChecked(true);
      }
    })();
  }, [airdropContract, codeHash]);

  const handleClaim = async () => {
    if (!airdropContract || !codeHash) return;
    setTxStatus('pending');

    try {
      const tx = await airdropContract.claim(codeHash);
      await tx.wait();
      setTxStatus('success');
      setTxHash(tx.hash);
      setClaimStatus(ClaimStatus.Claimed);
    } catch (err) {
      console.error("Claim failed:", err);
      setTxStatus('error');
    }
  };

  return (
    <main className="">

      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <Hero />
        <Separator className="w-full my-14 opacity-15" />
        {isConnected ? (
        <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
          {codeHash ? (
            <Card className="relative bg-blue-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start min-h-[360px]">
              <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
              <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
              <CardHeader>
                <CardTitle className="text-2xl">{t.intro}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full space-y-7">
                <div className="space-y-1">
                  {/* <h3 className="text-lg font-semibold">Your code hash:</h3> */}
                  {/* <p className="break-all">{codeHash}</p> */}
                </div>
                  <>
                    <Button
                      className="bg-white text-black font-bold w-full text-lg py-6 mt-auto hover:bg-blue-400 hover:text-white transition-colors"
                      onClick={handleClaim}
                      disabled={claimStatus !== ClaimStatus.Registered || txStatus === 'pending'}
                    >
                      {txStatus === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="loader w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                          {t.claiming}
                        </div>
                      ) : claimStatus === ClaimStatus.Registered ? (
                        t.claim
                      ) : claimStatus === ClaimStatus.Claimed ? (
                        txStatus === 'success' ? t.claimed : t.claimedAlready
                      ) : claimStatus === ClaimStatus.Unregistered ? (
                        t.invalidCode
                      ) : (
                        codeChecked ? t.somethingWentWrong : t.wait
                      )}
                    </Button>

                    {/* Explanation below the button */}
                    <p className="text-sm text-center text-white opacity-70 mt-4">
                      {claimStatus === ClaimStatus.Registered && txStatus !== 'pending' && t.readyToClaim}
                      {claimStatus === ClaimStatus.Claimed && txStatus !== 'success' && t.codeHasBeenUsed}
                      {claimStatus === ClaimStatus.Unregistered && t.codeNotFound}
                      {claimStatus === null && codeChecked && t.checkNetworkIfWaitingTooLong}
                      {txStatus === 'pending' && t.confirmTheTransaction}
                    </p>
                    <p className="text-sm text-center font-semibold text-red-300 mt-4">
                      {txStatus === 'error' && t.transactionFailed}
                    </p>
                    <p className="text-sm text-center font-semibold text-green-300 mt-4">
                      {txStatus === 'success' && (t.transactionSuccess + ": " + txHash)}
                    </p>
                  </>
              </CardContent>
            </Card>
          ) : (
            <p className="text-lg text-white text-center opacity-80">
              {t.noCode}
            </p>
          )}
        </section>
        ) : (
          <WalletInstructions />
        )}
      </div>
    </main>
  );
}