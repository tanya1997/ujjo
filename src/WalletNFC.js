import React, { useCallback, useContext, useEffect, useState, useMemo, useRef } from 'react';
import {useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { Button, Dialog, Space, Toast, Divider,  Dropdown, Radio,List,  Input, TextArea, Collapse, Image  } from 'antd-mobile'
import { CopyOutlined} from '@ant-design/icons';
import WalletAddress from './WalletAddress';
import Account from './Account';
export default function WalletNFC () {
  const childRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();
    const [walletAddress, setWalletAddress] = useState("");
    const [walletBalance, setWalletBalance] = useState("");

    const [arrayToken, setArrayToken] = useState([]);
    const [currentContract, setCurrentContract] = useState({});
    const [currentType, setCurrentType] = useState("");
    //const [arrayContract, setArrayContract] = useState([]);

    let refDialogWalletAddress = useRef("");
    let refDialogAmount = useRef("");
    const [dialogVisible, setDialogVisible] = useState(false);
    var arrayContract = location.state.contracts;
    var privateKey = location.state.wallet;//"ad7d4a67e61529bd1d07d6dd68f13a3e2308e0813e9ddc6ba9cc2281ae6fa002";


    useEffect(() => {
      childRef.current.updateApi()
    //  setArrayContract(location.state.contracts)
   //   setArrayContract(["TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"])
    });




    async function sendTRX(){
      console.log("type")
      console.log(currentType)
      childRef.current.sendTokens(currentType, refDialogWalletAddress.current, refDialogAmount.current, currentContract)
      setDialogVisible(false)
      /* console.log(refDialogWalletAddress.current);
      
       var txn = tronWeb.trx.sendTransaction(refDialogWalletAddress.current, refDialogAmount.current * 1000000, privateKey);
       console.log(txn)*/
    }//"TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr"

    function backToHome(){
        navigate('/');
    }

    function setVisibleDlgTransaction(value, type, id){
      if (id != null){
        refDialogAmount.current = id
      }else{
        refDialogAmount.current = ""
      }
      setCurrentType(type)
      setCurrentContract(value)
      setDialogVisible(true)
    }

    function closeSendDlg(){
      setDialogVisible(false)
    }
        

   return (
    <div className={"App MainContainer"}>  
        <div className='TopArea'>Ujjo</div>
        <Account ref={childRef} generateWalletPrivateKey={privateKey} setGenerateBalance={setWalletBalance}
        arrayContract={arrayContract} setArrayToken={setArrayToken} generateWalletAddress={walletAddress} 
        setGenerateWalletAddress={setWalletAddress}
/>
      <div className={"ChildContainer MainContainer"} style={{flexGrow: 4}} >
        <div className={"AppWithoutPadding ChildContainer MainContainer"}>
            <WalletAddress className={"ChildContainer"} generateWalletAddress={walletAddress} generateWalletPrivateKey={privateKey}/>
            <div className={"ChildContainer"} style={{flexGrow: 5, height: 0, overflowY:"auto", alignItems: "inherit", width:"100%"}}>
            <List style={{ width:"100%", "--border-top": "white"}}>
            <List.Item  extra={<Button  onClick={()=>setVisibleDlgTransaction(null, "TRX", null)} style={{"marginRight": 25}}>Send</Button>} 
              style={{marginTop: 20, width:"100%", textAlign: "initial", marginLeft: 10}}>
              {walletBalance/ 1000000} TRX </List.Item>  
            {arrayToken.map( e =>
                <div style={{width:"100%"}}>{ (e[1] == null || e[1].length == 0)? (
                  <List.Item extra={<Button  onClick={()=>setVisibleDlgTransaction(e[0], "TOKEN", null)} style={{"marginRight": 25}}>Send</Button>} 
                  style={{ width:"100%", textAlign: "initial", marginLeft: 10}}>{e[0].view}</List.Item>): (
                  <Collapse defaultActiveKey={['1']}>
                  <Collapse.Panel key='1' title={e[0].view}>
                    {
                      e[1].map(img => 
                      <div className='HorizontalCreateCard'><Image src={img[1]} width={100} height={100} fit='contain'></Image>
                        <div className='RightAlign' style={{marginRight: -28}}>
                          <Button onClick={()=>setVisibleDlgTransaction(e[0], "TRC721", img[0])}>Send</Button> </div>
                      </div> )
                    }
                  </Collapse.Panel>
                  </Collapse>
                ) }</div>
              )}
              </List>
              </div>
              <div className={"VerticalAlignment ChildContainer"} style={{justifyContent: "center", width: "auto" }}>
            <button className="button_tron" onClick={backToHome}>Scan other card</button>
            </div>
        </div>
        
       </div> 

       <Dialog visible={dialogVisible} title= 'Transaction' confirmText='Close'
        content ={ <div>
                    <div>
                      <div>wallet</div>
                      <Input className='inputBorder'
                        onChange={val => {
                          refDialogWalletAddress.current = val;
                        }}/>
                    </div>
                    
                      { refDialogAmount.current == "" ? (
                       <div> 
                      <div>amount</div>
                      <Input value={refDialogAmount.current} className='inputBorder'
                        onChange={val => {
                          refDialogAmount.current = val;
                        }}/>
                    </div>) : (<div></div>)
                      }
                    <div style={{display: "flex", marginTop: 15}}>
                    <Button style={{marginRight: 5}} size='large' block onClick={()=>closeSendDlg()}>Cancel</Button>
                    <Button style={{marginLeft: 5}}size='large' block onClick={()=> sendTRX()}>Send</Button>
                    </div>
                  </div>
                }
      ></Dialog>
    </div>
   );
}             
//<button onClick={sendTRX}>receive</button>
//<button onClick={showTronweb}>show</button>      
//<div>{location.state.wallet}</div>