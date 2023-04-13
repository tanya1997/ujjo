import React, { useEffect, useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import crc32 from 'crc/crc32';
import { Button, Dialog, Input, Checkbox, Card, Collapse, Image, List  } from 'antd-mobile'
import PasswordForm from './PasswordForm';
import Account from './Account';
import WalletAddress from './WalletAddress';
import NFCWarningDlg from './NFCWarningDlg';
import './App.css';

export default function CreateWallet () {
    const childRef = useRef(null);
    const childRefPwd = useRef(null);
    const navigate = useNavigate();

    const [dlgErrormessage, setDlgErrorMessage] = useState('');
    const [visibleErrorDlg, setVisibleErrorDlg] = useState(false);

    const [checkboxProtectWallet, setCheckboxProtectWallet] = useState(false);
    const [generateWalletAddress, setGenerateWalletAddress] = useState("");
    const [generateWalletPrivateKey, setGenerateWalletPrivateKey] = useState("");
    const [generateBalance, setGenerateBalance] = useState("");

    const [arrayToken, setArrayToken] = useState([]);
    const [arrayContract, setArrayContract] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [contractItem, setContractItem] = useState({});
    const [contractAddress, setContractAddress] = useState("");

    var CryptoJS = require("crypto-js");

    useEffect(() => {
      if ('NDEFReader' in window) { 
    }else{
      setDlgErrorMessage("Web NFC is not available")
      setVisibleErrorDlg(true)
     }
      childRef.current.updateApi()

    }, [contractItem, generateWalletPrivateKey, generateWalletAddress]);

    async function createWallet(){
      const result = await childRef.current.generateWallet() 
      setGenerateWalletPrivateKey(result[0])
      setGenerateWalletAddress(result[1])
    }

    function writeWallet(){

      var key = generateWalletPrivateKey;
      var crc = crc32(key).toString(16);
      var secure = false;
      var password = "";
      if (childRefPwd.current != null){
        password = childRefPwd.current.getPassword();
      }
      if (checkboxProtectWallet && password!= null && password.length > 0){
        key = CryptoJS.AES.encrypt(key, password).toString();
        secure = true
      }

      var arrayContractJSON = JSON.stringify(arrayContract);
      console.log("arrayContractJSON")
      console.log(arrayContractJSON)

      const dataMsg = "{\"private_key\": \""+ key +"\", \"crc\": \""+ crc +"\", \"secure\": \""+ secure +"\",\"contracts\": "+ arrayContractJSON +"}"
      navigate('/nfc_writer',{state:{wallet:dataMsg}});
    }

  function addNewToken(){
    setArrayContract(oldArray => [...oldArray, contractAddress]);
    setArrayToken(oldArray => [...oldArray, contractItem]);
    setContractAddress("");
    setContractItem({});
    
  }

  async function triggercontract(){
    var res = await childRef.current.triggercontract()
    setContractItem(res)
  }


   return (
    <div className={"App MainContainer"}>  
        <div className='TopArea'>Ujjo</div>
        <Account ref={childRef} generateWalletPrivateKey={generateWalletPrivateKey} setGenerateBalance={setGenerateBalance}
        arrayContract={arrayContract} setArrayToken={setArrayToken} generateWalletAddress={generateWalletAddress} arrayToken={arrayToken}
        contractAddress={contractAddress} setContractItem={setContractItem} setGenerateWalletAddress={setGenerateWalletAddress} 
        setGenerateWalletPrivateKey={setGenerateWalletPrivateKey}/>
        { generateWalletAddress.length > 0 ? 
        <div className={"ChildContainer MainContainer"} style={{flexGrow: 4}} >
          <div className={"AppWithoutPadding ChildContainer MainContainer"}>
             <WalletAddress className={"ChildContainer"} generateWalletAddress={generateWalletAddress} generateWalletPrivateKey={generateWalletPrivateKey}/>

              <div className={"ChildContainer"} style={{flexGrow: 5, height: 0, overflowY:"auto", alignItems: "inherit", width:"100%"}}>
                <List style={{ width:"100%", "--border-top": "white"}}>
                  <List.Item style={{marginTop: 20, width:"100%"}}>{generateBalance/ 1000000} TRX</List.Item>  
                  {arrayToken.map( e =>
                    <div style={{width:"100%"}}>{ (e[1] == null || e[1].length == 0)? (<List.Item>{e[0].view}</List.Item>): (
                      <Collapse defaultActiveKey={['1']}>
                      <Collapse.Panel key='1' className='HorizontalCreateCard' title={e[0].view}>
                        { e[1].map(img => <Image src={img[1]} width={100} height={100} fit='contain'></Image> )}
                      </Collapse.Panel>
                      </Collapse>
                    ) }</div>
                  )}
                </List>
                <Button style={{position: "sticky", bottom: 0, background: "white",borderTop: "solid #f2f1f1", borderBottom: "solid #f2f1f1"}} size='large' className={"ChildContainer"} color='primary' fill='none' onClick={()=>setDialogVisible(true)}>More assets</Button>
              </div>
              
              
              <div className={"VerticalAlignment ChildContainer"} style={{justifyContent: "end", width: "100%" }}>
                <Checkbox value={checkboxProtectWallet} defaultChecked={checkboxProtectWallet} 
                  onChange={checked => {setCheckboxProtectWallet(checked)}}>Protect wallet
                </Checkbox>
                {
                  checkboxProtectWallet ? 
                <PasswordForm ref={childRefPwd} /> : 
                <div></div>
                }
              </div>
              <div className={"VerticalAlignment ChildContainer"} style={{justifyContent: "center", width: "auto" }}>
                
                <button className="button_tron" onClick={writeWallet}>Write card</button>
              </div>
          </div>
          <Dialog visible={dialogVisible}  
            confirmText='Close'
            title = 'New Asset'

            content={ 
              <div>
                <Input placeholder='Token/Contract Address' className='inputBorder'
                  id="inputname"
                  value={contractAddress}
                
                  onChange={val => {
                    setContractAddress(val);
                  }}
                />
                <Button size='large' style={{marginTop: 10}} block onClick={triggercontract}>Search</Button>
                
                {
                  (contractItem[0] != null && contractItem[0].view.length > 0) ?
                  <div>
                    <Card style={{textAlign: "center", fontWeight: 600, fontSize: "large"}}>{contractItem[0].view}</Card>
                    <Button size='large' block onClick={addNewToken}>Add</Button>
                  </div>
                  : <div></div>
                }
                <Button style={{marginTop: 10}} size='large' block onClick={()=>{
                                                                                  setDialogVisible(false); 
                                                                                  setContractAddress(""); setContractItem({})} 
                                                                                }>Close</Button>
              </div>
              
            }>
          </Dialog>
          </div>: <div style={{justifyContent: "center", width: "auto" }} className='ChildContainer' >
            <div><button  className="button_tron" onClick={createWallet}>Create new Wallet</button></div>
            <NFCWarningDlg visible={visibleErrorDlg} setVisible={setVisibleErrorDlg} message={dlgErrormessage}/>
        </div>
        } 
               
    </div>
   );
}