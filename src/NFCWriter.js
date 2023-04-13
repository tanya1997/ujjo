import React, { useCallback, useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {useNavigate, useLocation} from 'react-router-dom';
import circles from './circles.svg';
import NFCWarningDlg from './NFCWarningDlg';
import {Dialog, Button} from 'antd-mobile'

function NFCWriter() {

  const abortController = new AbortController();
  const signal = abortController.signal;
  const [dlgErrormessage, setDlgErrorMessage] = useState('');
  const [visibleErrorDlg, setVisibleErrorDlg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  var ndef;

  useEffect(() => {
    if ('NDEFReader' in window) { 
    }else{
      setDlgErrorMessage("Web NFC is not available")
      setVisibleErrorDlg(true)
    }
    writeCard(location.state.wallet);
  }, [dlgErrormessage]);

  async function writeCard(dataMsg){
      console.log(dataMsg)
      onWrite(dataMsg)    
  }
  
  const onWrite = async(message) => {
          try {
            //abortController.abort();
              ndef = new window.NDEFReader();
              // This line will avoid showing the native NFC UI reader
             // await ndef.scan();
              await ndef.write({records: [{ recordType: "text", data: message }]}, {signal});
              Dialog.alert({
                confirmText:'ok',
                onConfirm: async () => {
                    backToHome()
                },

                title: 'NFC Card',
                content: (
                <>
                    <div>Data written successfully!</div>                                 
                </>)
              })
            //  alert(`Value Saved!`);
              
          } catch (error) {
            };
      
    }
      

function backToHome(){
    abortController.abort();
    navigate('/');
}

return (
    <div className="App MainContainer">  
        <div className='TopArea'>Ujjo</div>
        <div className={"ChildContainer MainContainer"}>
            <h1 className='ChildContainer' style={{justifyContent: "center"}}>Put NFC card on phone</h1>
            
            <div className='ChildContainer' style={{ width: "100%"}}>
                <img className="image_card" src={circles}></img>
                <div  className={"ChildContainer ScanninghWritingText"}>Writing...</div>
            </div>           
            <div className='ChildContainer' style={{width: "auto"}}><button className="button_tron" onClick={backToHome}>Stop</button></div>
        </div>
        <NFCWarningDlg visible={visibleErrorDlg} setVisible={setVisibleErrorDlg} message={dlgErrormessage}/>
    </div>
  );
}


export default NFCWriter;