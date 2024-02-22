

import './App.css'
import React, { lazy, Suspense } from "react";
import EmployeeManagementSystem from './components/empform'
// import Dashboards from './components/dashboard'
function App() {
 

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
     <EmployeeManagementSystem></EmployeeManagementSystem>
     {/* <Dashboards></Dashboards> */}
     </Suspense>
    </>
  )
}

export default App
