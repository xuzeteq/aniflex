import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import CatalogPage from './pages/CatalogPage'
import AnimePage from './pages/AnimePage'
import RegisterPage from './pages/Auth/RegisterPage'
import AuthPage from './pages/Auth/AuthPage'
import { useAuth } from './contexts/AuthContext'
import OngoingPage from './pages/OngoingPage'
import ProfilePage from './pages/ProfilePage'
import LogsPage from './pages/Admin/LogsPage'
import UsersPage from './pages/Admin/UsersPage'
import BlockedPage from './pages/BlockedPage'
import Footer from './components/Footer/Footer'
import AuditLogsPage from './pages/Admin/AuditLogsPage'
import MustAdminPage from './pages/MustAdminPage'
import HomePage from './pages/HomePage'
import VerifyPage from './pages/Auth/VerifyPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import PrevYearPage from './pages/PrevYearPage'
import ThisYearPage from './pages/ThisYearPage'
import FavouritesPage from './pages/FavouritesPage'

function App() {

  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="layout-shell flex min-h-[50vh] items-center justify-center text-[#d1d1d1]">
        Загрузка...
      </div>
    )
  }

  return (
    <>
    <div className='min-h-screen flex flex-col'>
        <Header />

        <main className="min-w-0 flex-1">
          <Routes>
            <Route path='/' element={ <HomePage /> }/>
            <Route path={'/anime/:id'} element={ <AnimePage /> } />
            <Route path='/catalog' element={ <CatalogPage /> } />
            <Route path='/auth' element={ isAuthenticated ? <Navigate to={"/"} replace /> : <AuthPage /> } />
            <Route path='/register' element = { isAuthenticated ? <Navigate to={'/'} replace /> : <RegisterPage /> } />
            <Route path='/ongoing' element= { <OngoingPage /> } />
            <Route path={'/profile/:id'} element={ <ProfilePage />  }/>
            <Route path='/logs' element = {  <LogsPage /> }/>
            <Route path='/anime/year/2025' element = {  <PrevYearPage /> }/>
            <Route path='/anime/year/2026' element = {  <ThisYearPage /> }/>
            <Route path='/users' element = { <UsersPage /> } />
            <Route path='/favourite' element = { isAuthenticated ? <FavouritesPage /> : <Navigate to={'/auth'} /> } />
            <Route path='/blocked' element = { <BlockedPage />} />
            <Route path='/audit-logs' element= {<AuditLogsPage />} />
            <Route path='/not-allowed' element= { <MustAdminPage /> } />
            <Route path='/verify' element = { isAuthenticated ? <Navigate to={'/'} replace /> : <VerifyPage /> } />
            <Route path='/forgot' element = { isAuthenticated ? <Navigate to={'/'} replace /> : <ForgotPasswordPage />} />
            <Route path='/reset-password' element = { isAuthenticated ? <Navigate to={'/'} replace /> : <ResetPasswordPage />} />
          </Routes>
        </main>

      <Footer />
    </div>



    </>
  )
}

export default App
