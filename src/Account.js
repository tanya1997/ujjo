import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Dialog, Space, Toast, Dropdown, Radio, TextArea  } from 'antd-mobile'

function Account (props, ref) {

    const [network, setNetwork] = useState("Shasta Testnet");
    const [apiLink, setApiLink] = useState("https://api.shasta.trongrid.io");

    const TronWeb = require('tronweb')
    const HttpProvider = TronWeb.providers.HttpProvider;
    var fullNode = new HttpProvider(apiLink);
    var solidityNode = new HttpProvider(apiLink);
    var eventServer = new HttpProvider(apiLink);
    var privateKey = '';
    var tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
    useEffect(() => {
   
    const interval = setInterval(() => {
      changeApi(apiLink)
    }, 5000);
    return () => clearInterval(interval);

  }, [apiLink, props.arrayContract, props.contractItem, props.setContractItem,
      props.generateWalletAddress, props.generateWalletPrivateKey, props.setGenerateWalletPrivateKey]);

    useImperativeHandle(ref, () => ({

        async triggercontract(){
         
            const res = await getTokenBalance(props.contractAddress)
            return res
            
          },

        async sendTokens(type, address, amount, contract_address) {
          
          console.log("send tokens")
          console.log(address)
          console.log(amount)
          console.log("type")

          if (type == "TRX"){
            try {
              var rez = await tronWeb.trx.sendTransaction(address,
                 amount * 1000000, props.generateWalletPrivateKey);

              if (rez.result == true){
                var txid = rez.txid
                console.log(txid)
                showTransactionDlg(txid)
                
              }else{
                Toast.show('Error!')
              }
            } catch(error) {
              Toast.show('Error!')
              console.error("trigger smart contract error",error)
            }
          }
          if (type == "TOKEN"){
            try {
                tronWeb.setAddress(props.generateWalletAddress);
                tronWeb.setPrivateKey(props.generateWalletPrivateKey);
                
                let contract = await tronWeb.contract().at(contract_address.contract);
                let result = await contract.transfer(
                    address,
                    amount * ((10 ** contract_address.decimals))
                ).send();
                showTransactionDlg(result)
            } catch(error) {
                Toast.show('Error!')
                console.error("trigger smart contract error11",error)
            }
          }

          if (type == "TRC721"){
            try {
                tronWeb.setAddress(props.generateWalletAddress);
                tronWeb.setPrivateKey(props.generateWalletPrivateKey);
                
                console.log(contract_address.contract)
                let contract = await tronWeb.contract().at(contract_address.contract);
                let result = await contract.transferFrom(
                    props.generateWalletAddress,
                    address,
                    amount
                ).send();
                showTransactionDlg(result)
            } catch(error) {
                Toast.show('Error!')
                console.error("trigger smart contract error11",error)
            }
          }
        },
          
        async  generateWallet(){
          var tx = await tronWeb.createAccount()
          var testAddress = tx.address.base58//
          var testPrivateKey = tx.privateKey
               
          return [testPrivateKey, testAddress]

                
        },

        updateApi(){
          changeApi(apiLink)
        }
    }));


    function showTransactionDlg(id){
      Dialog.alert({
        confirmText: 'Close',
        title: 'Transaction success',
        content: (
          <>
            <TextArea disabled value={id}rows={4} />
            <Button size='large' block 
              onClick={()=>{navigator.clipboard.writeText(id);
                Toast.show('Copied!') } }>Copy</Button>
          </>
        ),
      })
    }
    async function trc721_tokenURI(contractAddressTemp, index) {
      try {
        let contract = await tronWeb.contract().at(contractAddressTemp);
        let token_id = await contract.tokenOfOwnerByIndex(
          props.generateWalletAddress, // address owner
        index //uint256 index
        ).call();
        const tokenid = tronWeb.toDecimal(token_id)
        let tokenURI = await contract.tokenURI (
          tokenid //uint256 tokenid
            ).call();
        //console.log(tokenid + ' tokenURI:', tokenURI);
        return [token_id, tokenURI];
      } catch(error) {
          console.error("trigger smart contract error",error)
      }
      return "";
  }

    function changeApi(api){

      fullNode = new HttpProvider(api);
      solidityNode = new HttpProvider(api);
      eventServer = new HttpProvider(api);
      tronWeb = new TronWeb(fullNode,solidityNode,eventServer,props.generateWalletPrivateKey);
      showTronweb()
     
    }

    const onChange = (e) => {
        console.log('radio checked', e);
        setNetwork(e);
        let api = ""
  
        switch(e) {
          case 'Shasta Testnet':  // if (x === 'value1')
            api = "https://api.shasta.trongrid.io"
            break;
          case 'Mainnet':
            api = "https://api.trongrid.io"
            //setApiLink() 
            break;
          case 'Nile Testnet':
            api = "https://nile.trongrid.io"
             
            break;
        }
        setApiLink(api)
        changeApi(api)
      };

      async function showTronweb(){
         var address = tronWeb.address.fromPrivateKey(props.generateWalletPrivateKey)
         props.setGenerateWalletAddress(address)
         tronWeb.trx.getBalance(address).then(result => {props.setGenerateBalance(result)})
   
         var tokenBalance = [];
   
         try{
            for (let i in props.arrayContract){
                 const balance = await getTokenBalance(props.arrayContract.at(i))
                tokenBalance.push(balance)
            }
        }catch(e){
            
        }   
   
         props.setArrayToken(tokenBalance)

       }
     
        async function getTokenBalance(contractAddressTemp){
           tronWeb.setAddress(props.generateWalletAddress);
           let contract = await tronWeb.contract().at(contractAddressTemp);
           const result = await contract.balanceOf(props.generateWalletAddress).call(); 
          var tokenArray = []

           var decimals = 0;
           try{
              decimals = await contract.decimals().call();
           }catch{
            const result_num = tronWeb.toDecimal(result)
            if (Number.isInteger(result_num) && result_num < 10 && result_num != 0){
                for (let j = 0; j < result_num; j++) {
                  const trc_721 = await trc721_tokenURI(contractAddressTemp, j)
                  tokenArray.push(trc_721)
                }
            }

           }
   
           var bal = result / (10 ** decimals)
           const sym = await contract.symbol().call();
           var resultBalance = {} 
           resultBalance.balance = bal;
           resultBalance.decimals = decimals;
           resultBalance.sym = sym;
           resultBalance.contract = contractAddressTemp 
           var curent = bal + " " + sym
           resultBalance.view = curent;
          
           return [resultBalance, tokenArray]
        }

   
      


    return (
        <div>
            <Dropdown style={{ background: "#f5f5f5" }}>
              <Dropdown.Item key='sorter' title={network}>
                <div style={{ padding: 12}}>
                  <Radio.Group onChange={onChange} defaultValue='Shasta Testnet'>
                    <Space direction='vertical' block>
                      <Radio block value='Shasta Testnet'>Shasta Testnet
                      </Radio>
                      <Radio block value='Mainnet'>
                        Mainnet
                      </Radio>
                      <Radio block value='Nile Testnet'>
                        Nile Testnet
                      </Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </Dropdown.Item>
            </Dropdown>
        </div>
    )
}
export default forwardRef(Account)