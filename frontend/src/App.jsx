import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import PlaceholderPage from './components/PlaceholderPage'
import FloatingButtons from './components/FloatingButtons'
import ManageAccounts from './components/ManageAccounts'
import ChangePassword from './components/ChangePassword'
import SecuritySettings from './components/SecuritySettings'
import TransferSystem from './components/TransferSystem'
import TransactionHistory from './components/TransactionHistory'
import AccountOverview from './components/AccountOverview'
import AccountStatement from './components/AccountStatement'
import AdvancedTransactionHistory from './components/AdvancedTransactionHistory'

// Import all page components
import Accounts from './pages/Accounts'
import Payments from './pages/Payments'
import Shop from './pages/Shop'
import Investments from './pages/Investments'
import Loans from './pages/Loans'
import Cards from './pages/Cards'
import Insurance from './pages/Insurance'
import Services from './pages/Services'

// Existing pages used below
import FixedDeposit from './pages/FixedDeposit'
import GoldPurchase from './pages/GoldPurchase'
import MutualFunds from './pages/MutualFunds'
import NomineeUpdate from './pages/NomineeUpdate'
import ApplyPersonalLoan from './pages/ApplyPersonalLoan'
import ApplyHomeLoan from './pages/ApplyHomeLoan'
import ApplyEducationLoan from './pages/ApplyEducationLoan'
import ApplyCarLoan from './pages/ApplyCarLoan'
import ApplyLifeInsurance from './pages/ApplyLifeInsurance'
import ApplyGeneralInsurance from './pages/ApplyGeneralInsurance'
import CreditCardDetails from './pages/CreditCardDetails'
import ApplyCard from './pages/ApplyCard'
import BlockCard from './pages/BlockCard'
import ChequeBookRequest from './pages/ChequeBookRequest'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <FloatingButtons />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Account Management Routes */}
            <Route 
              path="/accounts/*" 
              element={
                <ProtectedRoute>
                  <Accounts />
                </ProtectedRoute>
              } 
            />
            
       {/* Payment Routes */}
       <Route 
         path="/payments/transfer" 
         element={
           <ProtectedRoute>
             <TransferSystem />
           </ProtectedRoute>
         } 
       />
       <Route 
         path="/payments/beneficiaries" 
         element={
           <ProtectedRoute>
             <TransferSystem />
           </ProtectedRoute>
         } 
       />
       <Route 
         path="/payments/history" 
         element={
           <ProtectedRoute>
             <TransactionHistory />
           </ProtectedRoute>
         } 
       />
       <Route 
         path="/payments/overview" 
         element={
           <ProtectedRoute>
             <AccountOverview />
           </ProtectedRoute>
         } 
       />
       <Route 
         path="/payments/statement" 
         element={
           <ProtectedRoute>
             <AccountStatement />
           </ProtectedRoute>
         } 
       />
       <Route 
         path="/payments/history/advanced" 
         element={
           <ProtectedRoute>
             <AdvancedTransactionHistory />
           </ProtectedRoute>
         } 
       />
            <Route 
              path="/payments/*" 
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              } 
            />
            
            {/* Shop Routes */}
            <Route 
              path="/shop" 
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              } 
            />
            
            {/* Investment Routes */}
            <Route 
              path="/investments/*" 
              element={
                <ProtectedRoute>
                  <Investments />
                </ProtectedRoute>
              } 
            />
            
           {/* Loan Routes */}
           <Route 
              path="/loans/*" 
              element={
                <ProtectedRoute>
                  <Loans />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loans/personal" 
              element={
                <ProtectedRoute>
                  <ApplyPersonalLoan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loans/home" 
              element={
                <ProtectedRoute>
                  <ApplyHomeLoan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loans/education" 
              element={
                <ProtectedRoute>
                  <ApplyEducationLoan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loans/car" 
              element={
                <ProtectedRoute>
                  <ApplyCarLoan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insurance/life" 
              element={
                <ProtectedRoute>
                  <ApplyLifeInsurance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insurance/general" 
              element={
                <ProtectedRoute>
                  <ApplyGeneralInsurance />
                </ProtectedRoute>
              } 
            />
            
            {/* Card Routes */}
            <Route 
              path="/cards/*" 
              element={
                <ProtectedRoute>
                  <Cards />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cards/details" 
              element={
                <ProtectedRoute>
                  <CreditCardDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cards/apply" 
              element={
                <ProtectedRoute>
                  <ApplyCard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cards/block" 
              element={
                <ProtectedRoute>
                  <BlockCard />
                </ProtectedRoute>
              } 
            />

            <Route 
  path="/fixed-deposit" 
  element={
    <ProtectedRoute>
      <FixedDeposit />
    </ProtectedRoute>
  } 
/>

            <Route 
  path="/investments/gold" 
  element={
    <ProtectedRoute>
      <GoldPurchase />
    </ProtectedRoute>
  } 
/>

            {/* Insurance Routes */}
            <Route 
              path="/insurance/*" 
              element={
                <ProtectedRoute>
                  <Insurance />
                </ProtectedRoute>
              } 
            />
            
            {/* Service Routes */}
            <Route 
              path="/services/*" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            {/* Service Routes */}
            <Route 
              path="/services/cheque-book" 
              element={
                <ProtectedRoute>
                  <ChequeBookRequest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services/nominee-update" 
              element={
                <ProtectedRoute>
                  <NomineeUpdate />
                </ProtectedRoute>
              } 
            />
            {/* Profile Routes */}
            <Route 
              path="/profile/update" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/manage-accounts" 
              element={
                <ProtectedRoute>
                  <ManageAccounts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/change-password" 
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/security" 
              element={
                <ProtectedRoute>
                  <SecuritySettings />
                </ProtectedRoute>
              } 
            />
            <Route path="/mutual-funds" element={
              <Suspense fallback={<div className="p-6">Loading...</div>}>
                <MutualFunds />
              </Suspense>
            } />
            {/* Catch-all route for any unmatched paths */}
            <Route 
              path="*" 
              element={
                <PlaceholderPage 
                  title="Page Not Found"
                  description="The page you're looking for doesn't exist."
                  icon="❌"
                />
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
