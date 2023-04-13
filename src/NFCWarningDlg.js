import React, { useCallback, useContext, useEffect, useState } from 'react';
import './App.css';
import {Dialog, Button} from 'antd-mobile'

function NFCWarningDlg(props) {
function closeDlg(){
    props.setVisible(false)
}
return (

    <Dialog 
        title = 'NFC ERROR'
        visible={props.visible}
        content= {
        <>
            <div>{props.message}</div>  
            <Button style={{marginTop: 10}} size='large' block onClick={closeDlg}>Close</Button>                               
        </>}></Dialog>
        
    
  );
}


export default NFCWarningDlg;