


import { Route, Routes, Navigate, Outlet } from 'react-router-dom';

import { HomePage } from '../pages/HomePage'
import { LoginForm } from '../auth/LoginForm';
import { SignUpForm } from '../auth/SignUpForm'
import { CategoriesPage } from '../components/tag_categories/CategoriesPage'

// import type { JSX } from 'react'
import { CreateNotePage } from '../pages/CreateNotePage'
import { NoteCategory } from '../components/note_layout/NoteCategory'
import { MainLayout } from '../components/layout/MainLayout';
import { TrashPage } from '../components/trash_page/TrashPage'
import { ProfilePage } from '../pages/ProfilePage';

import { ProtectedRoute } from './ProtectedRoute';

const AuthenticatedRoutes = () => {
    const isAuthenticated = localStorage.getItem('token');
    if (!isAuthenticated) {
        return <Navigate to='/login' replace/>
    }

    return <Outlet/>
};

export const Router = () => {

    return (
    <Routes>
        <Route path='/login' element= {<LoginForm/>}/>
        <Route path='/signup' element= {<SignUpForm/>}/>

     

        <Route element={<AuthenticatedRoutes/>}>
        <Route path='/' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path='/note' element={<MainLayout><NoteCategory/></MainLayout>}/>
        <Route path='/category' element={<MainLayout><CategoriesPage/></MainLayout>}/>
        <Route path='/create' element={<MainLayout><CreateNotePage/></MainLayout>}/>
        <Route path='/profile' element={<MainLayout><ProfilePage/></MainLayout>}/>
        <Route path='/trash' element={<MainLayout><TrashPage/></MainLayout>}/>
        </Route>
    </Routes>
  )

        

}