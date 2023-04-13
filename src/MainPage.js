import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActionsContext } from './context';
import logo from './logo.svg';
import './App.css';
import './MainPage.css';
import {useNavigate} from 'react-router-dom';
import credit_card from './credit_card.png';

function MainPage() {
    const navigate = useNavigate();

    function goToScan(){
        navigate('/nfc_scaner');
    }

    function goToCreateCard(){
        navigate('/create_wallet',{state:{wallet:null}});
        //navigate('/login_wallet')
    }

    return (
        <div className={"App MainContainer"}>
            <div className='ChildContainer' style={{justifyContent: "end"}}>
                <div className='FontLogo'>Ujjo</div>
                <div className='FontNFCWallet'>NFC wallet card</div>
                <div className='FontTronChain'>Works in TRON chain</div>
            </div>
            <div className='ChildContainer' style={{justifyContent: "center", flexGrow: 2}}>
                <img className="image_card" src={credit_card}></img>
            </div>
            <div className='ChildContainer'>
                <div><button className="button_tron" onClick={goToScan}>Scan card</button></div>
                <div><button className="button_tron" style={{marginTop: 20}} onClick={goToCreateCard}>Create card</button></div>
            </div>
        </div>
    );
}

export default MainPage;