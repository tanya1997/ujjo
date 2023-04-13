import { WalletConnectWallet, WalletConnectChainID } from '@tronweb3/walletconnect-tron';
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
export default function MyWalletConnect () {

    
    const [message, setMessage] = useState('11');
    const wallet = new WalletConnectWallet({
        network: WalletConnectChainID.Mainnet,
        options: {
          relayUrl: 'wss://relay.walletconnect.com',
          projectId: '1e91e120bb988a50bb8a2ad77b7649f2',
          metadata: {
            name: 'JustLend',
            description: 'JustLend WalletConnect',
            url: 'https://app.justlend.org/',
            icons: ['https://app.justlend.org/mainLogo.svg']
          }
        }
      });

      
   async function sign() {
    const { address } = await wallet.connect();
    setMessage(address)
       // await wallet.connect();
   }

   return (
       <div className="App">
           <button onClick={sign}>sign message</button>
           <div>{message}</div>
       </div>
   );
}