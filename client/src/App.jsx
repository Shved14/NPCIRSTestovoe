import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from './layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Dashboard/>}/>
                <Route path="data" element={<Dashboard/>}/>
            </Route>
        </Routes>
    </BrowserRouter>)
}

export default App
