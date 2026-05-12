


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
import { ProfilePage } from '../pages/ProfilePage'

//  const CreateProtectedRouter = ({ children }: {children:JSX.Element}) => {

//     const isAuthenticated = localStorage.getItem("token");
// import { MainLayout } from '../components/layout/MainLayout'




//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />
//     }

//     return children;
// };
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
        {/* <Route path='/main' element = {<MainLayout></MainLayout>}/> */}
        {/* <Route path='/' element= {<CreateProtectedRouter><HomePage/></CreateProtectedRouter>}/>
        <Route path='/createnote' element= {<CreateProtectedRouter><CreateNotePage/></CreateProtectedRouter>}/>
        <Route path='/note' element= {<CreateProtectedRouter><NoteCategory/></CreateProtectedRouter>}/>
        <Route path='/layout' element= {<CreateProtectedRouter><MainLayout/></CreateProtectedRouter>}/>
        
        <Route path='/category' element= {<CreateProtectedRouter><CategoriesPage/></CreateProtectedRouter>}/> */}

        <Route element={<AuthenticatedRoutes/>}>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/note' element={<MainLayout><NoteCategory/></MainLayout>}/>
        <Route path='/category' element={<MainLayout><CategoriesPage/></MainLayout>}/>
        <Route path='/create' element={<MainLayout><CreateNotePage/></MainLayout>}/>
        <Route path='/profile' element={<MainLayout><ProfilePage/></MainLayout>}/>
        <Route path='/trash' element={<MainLayout><TrashPage/></MainLayout>}/>
        </Route>
    </Routes>
  )

        

}