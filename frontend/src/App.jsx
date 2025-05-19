import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Transactions from './pages/Transactions'
import { PortraitProvider } from './contexts/PortraitLandscape'
import { ThemeProvider } from './contexts/Theme'
import { AuthContextProvider } from './contexts/auth'
import { FinancialProvider } from './contexts/finances'
import NoSideBarLayout from './components/NoSideBarLayout'
import SideBarLayout from './components/SideBarLayout'
import Stats from './pages/Stats'
import AddIncome from './components/AddIncome'
import AddExpense from './components/AddExpense'

function App() {

  return (
    <>
      <ThemeProvider>
        <PortraitProvider>
          <AuthContextProvider>
            <FinancialProvider>
              <Router>
                <Routes>
                  <Route path='/' element={<NoSideBarLayout />}>
                    <Route index path='' element={<LandingPage />} />
                    <Route path='log-in' element={<Login />} />
                    <Route path='register' element={<Register />} />
                  </Route>

                  <Route path='/user' element={<SideBarLayout/>}>
                    <Route index path='dashboard' element={<Dashboard />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='transactions' element={<Transactions />} />
                    <Route path='monthly-stats' element={<Stats />} />
                    <Route path='dashboard/add-income' element={<AddIncome/>} />
                    <Route path='dashboard/add-expense' element={<AddExpense/>} />
                  </Route>

                </Routes>
              </Router>
            </FinancialProvider>
          </AuthContextProvider>
        </PortraitProvider>
      </ThemeProvider>
    </>
  )
}

export default App
