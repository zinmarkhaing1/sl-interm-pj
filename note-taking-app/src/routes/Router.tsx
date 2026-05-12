<<<<<<< HEAD
import { Route ,Routes,Navigate, Outlet} from 'react-router-dom'
=======
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
>>>>>>> 6a675bc1a5e70db0b731478d92f79b9655b5907d
import { HomePage } from '../pages/HomePage'
import { LoginForm } from '../auth/LoginForm'
import { SignUpForm } from '../auth/SignUpForm'
import { CategoriesPage } from '../components/tag_categories/CategoriesPage'
<<<<<<< HEAD
import type { JSX } from 'react'
import { CreateNotePage } from '../pages/CreateNotePage'
import { NoteCategory } from '../components/note_layout/NoteCategory'
import { MainLayout } from '../components/layout/MainLayout';
import { TrashPage } from '../components/trash_page/TrashPage'
import { ProfilePage } from '../pages/ProfilePage'

//  const CreateProtectedRouter = ({ children }: {children:JSX.Element}) => {

//     const isAuthenticated = localStorage.getItem("token");
=======
import { MainLayout } from '../components/layout/MainLayout'

const AuthenticatedRoutes = () => {
    const isAuthenticated = localStorage.getItem("token");
>>>>>>> 6a675bc1a5e70db0b731478d92f79b9655b5907d

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
<<<<<<< HEAD
    return <Outlet/>
=======

    return <Outlet />;
>>>>>>> 6a675bc1a5e70db0b731478d92f79b9655b5907d
};

export const Router = () => {

    return (
<<<<<<< HEAD
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
=======
        <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignUpForm />} />
            <Route path='/main' element={<MainLayout />} />

            <Route element={<AuthenticatedRoutes />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/category' element={<CategoriesPage />} />
            </Route>
        </Routes>
    )
>>>>>>> 6a675bc1a5e70db0b731478d92f79b9655b5907d
}