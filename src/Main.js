import React from 'react';
import { Routes , Route } from 'react-router-dom';

import NFCScaner from './NFCScaner';
import WalletNFC from './WalletNFC';
import MainPage from './MainPage'
import CreateWallet from './CreateWallet'
import NFCWriter from './NFCWriter';

const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' element={<MainPage/>}></Route>
      <Route exact path='/nfc_scaner' element={<NFCScaner/>}></Route>
      <Route exact path='/wallet' element={<WalletNFC/>}></Route>
      <Route exact path='/create_wallet' element={<CreateWallet/>}></Route>
      <Route exact path='/nfc_writer' element={<NFCWriter/>}></Route>
    </Routes>
  );
}
export default Main;
