import React, { useState } from 'react'; 
import TableComponent from './TableComponent/TableComponent'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="App">
            <TableComponent />
        </div>
    </>
  )
}

export default App
