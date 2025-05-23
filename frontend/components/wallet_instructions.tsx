'use client';

import Image from 'next/image';
import t from '../i18n/ru.json';

export default function WalletInstructions() {
  return (
    <div className="w-full text-white mt-4 text-m space-y-6 px-2">
      <h2 className="text-lg font-semibold">{t.setupTitle}</h2>

      <p className="leading-relaxed">{t.setupIntro}</p>

      {/* <ol className="list-decimal list-inside space-y-6 mt-4"> */}
        <p>{t.step1}</p>
        <a
          href="https://support.metamask.io/ru/start/getting-started-with-metamask/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-300 underline block mt-2"
        >
          {t.metamaskGuide}
        </a>
        <Image
          src="/metamask-extension-location.png"
          alt=""
          width={600}
          height={250}
          className="rounded mt-3"
        />
        <p className="mt-2 text-white/80 text-sm">{t.seedPhraseReminder}</p>

        <p>{t.step2Intro}</p>
        <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-white/80">
          <li><a className="underline text-blue-300" href="https://www.bybit.com" target="_blank">Bybit</a></li>
          <li><a className="underline text-blue-300" href="https://www.huobi.com" target="_blank">Huobi</a></li>
          <li><a className="underline text-blue-300" href="https://www.binance.com" target="_blank">Binance (через P2P)</a></li>
          <li><a className="underline text-blue-300" href="https://www.okx.com" target="_blank">OKX</a></li>
        </ul>

        <p>{t.step2Exchanges}</p>

        <p>
          {t.step2BridgePrefix}{' '}
          <a
            href="https://bridge.arbitrum.io"
            target="_blank"
            rel="noreferrer"
            className="text-blue-300 underline"
          >
            bridge.arbitrum.io
          </a>{' '}
          {t.step2BridgeSuffix}
        </p>
        <br />
        <p>{t.step2SelectNetwork}</p>
        <Image
          src="/metamask-choose-network.png"
          alt=""
          width={400}
          height={100}
          className="rounded mt-3"
        />
        <p>{t.readyToConnect}</p>
      {/* </ol> */}
    </div>
  );
}