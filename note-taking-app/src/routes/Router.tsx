import { Route ,Routes,Navigate} from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginForm } from '../auth/LoginForm'
import { SignUpForm } from '../auth/SignUpForm'
import { CategoriesPage } from '../components/tag_categories/CategoriesPage'
import type { JSX } from 'react'

 const CreateProtectedRouter = ({ children }: {children:JSX.Element}) => {

    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children;
};
export const Router = () =>{
   
    return (
    <Routes>
        <Route path='/' element= {<CreateProtectedRouter><HomePage/></CreateProtectedRouter>}/>
        <Route path='/login' element= {<LoginForm/>}/>
        <Route path='/signup' element= {<SignUpForm/>}/>
        <Route path='/category' element= {<CreateProtectedRouter><CategoriesPage/></CreateProtectedRouter>}/>
    </Routes>
  )
}