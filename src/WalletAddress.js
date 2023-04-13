import React from 'react';
import { Button, Dialog,  Toast, TextArea, Collapse  } from 'antd-mobile'
import { CopyOutlined} from '@ant-design/icons';
import './WalletAddress.css'

export default function WalletAddress (props, ref) {


    function copyAddress(){
        navigator.clipboard.writeText(props.generateWalletAddress)
        Toast.show('Copied!')
      }   
      
      function copyPrivateKey(){
        navigator.clipboard.writeText(props.generateWalletPrivateKey)
        Toast.show('Copied!')
      }  
    
      function exportCard(){
          Dialog.alert({
            confirmText: 'Close',
            title: 'Private Key',
            content: (
              <>
                <div>Please write the private key on the paper and store it safely.</div>
                <Collapse>
                  <Collapse.Panel  key='1' title='View private key'>
                    <TextArea disabled value={props.generateWalletPrivateKey}rows={4} />
                  </Collapse.Panel>
                </Collapse>
                <Button size='large' block onClick={copyPrivateKey}>Copy</Button>
              </>
            )
          })
        }

    return (
        <div style={{width: "100%"}}>
             <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center"}}>
                <h2 style={{gridColumnStart: 2}}>NFC Wallet</h2> 
                <Button className='ExportAccount' onClick={exportCard}>Export Account</Button>
              </div>
              <div className='HorizontalCreateCard' style={{justifyContent: "center"}}>
                <div style={{fontWeight: 600}}>{props.generateWalletAddress}</div>
                <CopyOutlined style={{marginLeft: "10px"}} onClick={copyAddress} ></CopyOutlined>
              </div>
        </div>
    )

}