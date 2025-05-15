'use client';

import { useAccount, useWalletClient } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hero } from '@/components/Hero';

import { AIRDROP_ADDRESS } from '../contracts/config';
import airdropAbi from '../contracts/local_zin_airdrop.json';

export default function ClaimPage() {
  const searchParams = useSearchParams();

  let codeHash = searchParams.get('code');
  codeHash = codeHash && codeHash.startsWith("0x") ? codeHash : `0x${codeHash}`;

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [claimable, setClaimable] = useState<boolean | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const [airdropContract, setAirdropContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!walletClient) return;
  
    (async () => {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AIRDROP_ADDRESS, airdropAbi, signer);
      setAirdropContract(contract);
    })();
  }, [walletClient]);

  useEffect(() => {
    if (!airdropContract || !codeHash) return;

    (async () => {
      try {
        const result = await airdropContract.canClaim(codeHash);
        setClaimable(result);
      } catch (err) {
        console.error('Failed to check claimable status:', err);
        setClaimable(false);
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
      setClaimable(false);
    } catch (err) {
      console.error('Claim failed:', err);
      setTxStatus('error');
    }
  };

  return (
    <main className="">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <Hero />
        <Separator className="w-full my-14 opacity-15" />
        <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
          {codeHash ? (
            <Card className="relative bg-blue-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start min-h-[360px]">
              <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
              <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
              <CardHeader>
                <CardTitle className="text-2xl">Claim Tokens</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full space-y-7">
                <div className="space-y-1">
                  {/* <h3 className="text-lg font-semibold">Your code hash:</h3> */}
                  {/* <p className="break-all">{codeHash}</p> */}
                </div>

                {isConnected ? (
                  <Button
                    className="bg-white text-black w-full text-lg py-6 mt-auto"
                    onClick={handleClaim}
                    disabled={!claimable || txStatus === 'pending'}
                  >
                    {txStatus === 'pending'
                      ? 'Claiming...'
                      : claimable
                      ? 'Claim'
                      : 'Claimed!'}
                  </Button>
                ) : (
                  <p className="text-sm text-center text-white opacity-80 mt-auto">
                    First connect your wallet
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-lg text-white text-center opacity-80">
              To claim tokens, you should have a valid code.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}