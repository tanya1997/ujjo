import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { ActionsContext } from './context';
import './App.css';
import { Dialog  } from 'antd-mobile'
import {useNavigate} from 'react-router-dom';
import circles from './circles.svg';
import crc32 from 'crc/crc32';
import PasswordForm from './PasswordForm';
import NFCWarningDlg from './NFCWarningDlg';
    

function NFCScaner() {
  var CryptoJS = require("crypto-js");
  const childRef = useRef(null);
  const abortController = new AbortController();
  const signal = abortController.signal;

  const [dlgErrormessage, setDlgErrorMessage] = useState('');
  const [visibleErrorDlg, setVisibleErrorDlg] = useState(false);
  const { actions, setActions} = useContext(ActionsContext);
  const isModalShow = useRef(false);
  const navigate = useNavigate();
 var ndef;

  useEffect(() => {
    scan();
  }, [dlgErrormessage]);
  
  async function scan(){
    if ('NDEFReader' in window) { 
        try {
            ndef = new window.NDEFReader();
            await ndef.scan({signal});
            
            console.log("Scan started successfully.");
            ndef.onreadingerror = () => {
                console.log("Cannot read data from the NFC tag. Try another one?");
            };
            
            ndef.onreading = event => {
                if (isModalShow.current == false){
                            
                    isModalShow.current = true
                    console.log("NDEF message read.");
                    onReading(event);
                    setActions({
                        scan: 'scanned',
                        write: null
                    });
                }
            };

        } catch(error){
            setDlgErrorMessage(error.message)
            setVisibleErrorDlg(true)
        };
    }else {
      console.log(`not NDEFReader`);
      setDlgErrorMessage("Web NFC is not available")
      setVisibleErrorDlg(true)
    }
};

const onReading = ({message, serialNumber}) => {
    //setSerialNumber(serialNumber);
    for (const record of message.records) {
        switch (record.recordType) {
            case "text":
                try{
                    const textDecoder = new TextDecoder(record.encoding);
                    const data = textDecoder.decode(record.data);
                    var myObject = JSON.parse(data);
                    console.log(myObject)
                    if (myObject.secure == "true"){
                        console.log("isModalShow ")
                        console.log(isModalShow)
                        
                            Dialog.confirm({
                                cancelText: 'Cancel',
                                confirmText:'Confirm',
                                title: 'Password verification',
                                content: (
                                <>
                                    <PasswordForm ref={childRef} />                                 
                                </>
                                ), 
                                onConfirm: () => {
                                    const password = childRef.current.getPassword();
                                    checkCard(myObject.private_key, myObject.crc, myObject.contracts, password)
                                    isModalShow.current = false
                                }
                            })
                        


                    }else{
                        checkCard(myObject.private_key, myObject.crc, myObject.contracts, null)
                    }
                }catch (err){
                    console.log(err)
                   // showErrorDlg("")
                }
                
               

                break;
            default:
                break;
            }
    }
};

function checkCard(s_key, s_crc, contracts, s_pwd){
    //setMessage(myObject.private_key);
    var key = s_key;
    if (s_pwd != null){
        var decrypted = CryptoJS.AES.decrypt(key, s_pwd);
        key = decrypted.toString(CryptoJS.enc.Utf8)
    }
    var crc = crc32(key).toString(16);
    if (s_crc == crc){
        //setDebugMessage(key)
        abortController.abort();
        navigate('/wallet',{state:{wallet:key, contracts:contracts}});
    }else{
        showErrorDlg(s_crc + "  " + crc + " "+ key);
    }
}

function showErrorDlg(content){
    Dialog.alert({
            title: 'Card',
            content: 'Cannot read card ',// + content,
            confirmText:'Try again',
          })
}

function backToHome(){
    abortController.abort();
    navigate('/');
}

function debugWallet(){
    navigate('/wallet',{state:{wallet:"ad7d4a67e61529bd1d07d6dd68f13a3e2308e0813e9ddc6ba9cc2281ae6fa002"}});
}

return (
    <div className="App MainContainer">  
        <div className='TopArea'>Ujjo</div>
        <div className={"ChildContainer MainContainer"}>
            <h1 className='ChildContainer' style={{justifyContent: "center"}}>Put NFC card on phone</h1>
            
            <div className='ChildContainer' style={{ width: "100%"}}>
                <img className="image_card" src={circles}></img>
                <div  className={"ChildContainer ScanninghWritingText"}>Scanning...</div>
            </div>           
            <div className='ChildContainer' style={{width: "auto"}}><button className="button_tron" onClick={backToHome}>Stop</button></div>
            
        </div>
        <NFCWarningDlg visible={visibleErrorDlg} setVisible={setVisibleErrorDlg} message={dlgErrormessage}/>
    </div>
  );
}
//<div className='ChildContainer'><button onClick={debugWallet}>Debug Wallet</button></div>
export default NFCScaner;