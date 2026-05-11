import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginForm } from '../auth/LoginForm'
import { SignUpForm } from '../auth/SignUpForm'
import { CategoriesPage } from '../components/tag_categories/CategoriesPage'

const AuthenticatedRoutes = () => {
    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
};

export const Router = () => {

    return (
        <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignUpForm />} />

            <Route element={<AuthenticatedRoutes />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/category' element={<CategoriesPage />} />
            </Route>
        </Routes>
    )
}