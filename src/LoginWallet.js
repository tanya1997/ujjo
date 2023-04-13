import React, { useCallback, useContext, useEffect, useState, useMemo, useRef } from 'react';
import {useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { Button, Dialog, Space, Toast, Divider,  Dropdown, Radio, Input, TextArea } from 'antd-mobile'


export default function LoginWallet () {
    const [value, setValue] = useState('')
    const navigate = useNavigate();
    
    const TronWeb = require('tronweb')

    async function checkWalletAndNextStep(){
        console.log(value)
        /*var address = tronWeb.address.fromPrivateKey(value)
        if(address == false){

        }*/
        try{
            var res = TronWeb.fromMnemonic(value)
            console.log(res)
            navigate('/create_wallet',{state:{wallet:res}});
        }catch{
            Toast.show({
                icon: 'fail',
                content: 'Failed to find wallet',
              })
            console.log("err")
        }
    }

    function skip(){
        navigate('/create_wallet',{state:{wallet:null}});
    }

    return (
        <div>  
            <div className='TopArea'>Ujjo</div>
            <div className="App" style={{ padding: 12}}>
                <div style={{width: "90%", display: "block", marginLeft: "auto", marginRight: "auto"}}>
                    <TextArea style={{ paddingLeft: "5px", marginLeft: "-4px"}} className='inputBorder' placeholder='Enter your mnemonic, private key, keystore' value={value} 
                    onChange={val => {setValue(val)}} autoSize={{ minRows: 4, maxRows: 7 }}/>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <button style={{alignSelf: "center"}} className="button_tron" onClick={checkWalletAndNextStep}>Next step</button>
                    <Button style={{alignSelf: "center"}} className="button_tron" onClick={skip}>Skip</Button>
                </div>
            </div>
            
        </div>
    );
}