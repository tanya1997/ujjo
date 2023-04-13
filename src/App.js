import React, { useCallback, useContext, useEffect, useState } from 'react';
import Main from './Main';
import './App.css';

function App() {

return (
    <div style={{overflowX: "hidden", overflowY: "unset", height: "100%"}}>
      <Main/>
    </div>
  );
}

export default App;