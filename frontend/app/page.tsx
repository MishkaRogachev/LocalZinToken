'use client';

import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hero } from "@/components/Hero";

export default function ClaimPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const { isConnected } = useAccount();

  return (
    <main className="">
      <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
        <Hero />

        <Separator className="w-full my-14 opacity-15" />

        <section className="flex flex-col items-center md:flex-row gap-10 w-full justify-center max-w-5xl">
          {code ? (
            <Card className="relative bg-blue-500 bg-opacity-35 rounded-tr-sm rounded-bl-sm text-white border-none h-full w-full max-w-xl self-start min-h-[360px]">
              <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute right-0 bottom-0"></div>
              <div className="bg-blue-500 bg-opacity-20 h-[104%] w-[103%] md:h-[103%] md:w-[102%] rounded-xl -z-20 absolute top-0 left-0"></div>
              <CardHeader>
                <CardTitle className="text-2xl">Claim Tokens</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-full space-y-7">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Your code: {code}</h3>
                  <p className="break-all">Code can be used only once!</p>
                </div>

                {isConnected ? (
                  <Button className="bg-white text-black w-full text-lg py-6 mt-auto">
                    Claim
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