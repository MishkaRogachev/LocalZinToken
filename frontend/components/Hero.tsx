"use client";

import Image from "next/image";
import { useAccount } from "wagmi";

import t from '../i18n/ru.json';

export const Hero = () => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return (
      <section className="relative mx-auto mt-28">
        <h1 className="text-7xl text-zinc-100 font-bold">{t.welcome}</h1>
        <p className="text-white opacity-70 text-center text-lg">
        </p>
        <Image
          src="/arrow.svg"
          alt="Arrow pointing to the connect wallet button"
          className="absolute scale-y-[-1] hidden md:block md:bottom-[-65px] md:right-[-95px]"
          width={130}
          height={130}
        />
      </section>
    );
  }

  return (
    <section className="relative mx-auto mt-28">
      <h1 className="text-7xl text-zinc-100 font-bold">{t.welcome}</h1>
      <p className="text-white opacity-70 text-center text-lg">
        <br /> {t.welcomeMessageNoWallet}
      </p>
      <Image
        src="/arrow.svg"
        alt="Arrow pointing to the connect wallet button"
        className="absolute hidden md:block md:bottom-5 md:-right-48"
        width={150}
        height={150}
      />
    </section>
  );
};
