


import { Route, Routes, Navigate, Outlet } from 'react-router-dom';

import { HomePage } from '../pages/HomePage'
import { LoginForm } from '../auth/LoginForm';
import { SignUpForm } from '../auth/SignUpForm'
import { CategoriesPage } from '../components/tag_categories/CategoriesPage'

import { CreateNotePage } from '../pages/CreateNotePage'
import { MainLayout } from '../components/layout/MainLayout';
import { ProfilePage } from '../pages/ProfilePage';
import { NoteFrom } from '../pages/NoteFrom';
import { EditNotePage } from '../pages/EditNotePage';
import { NoteStatusPage } from '../components/status-page/NoteStatusPage';
import {TasksNotes} from '../pages/TasksNotes';
import {TaskLayout} from "../components/notelayout/TaskLayout";
import { NoteDetailPage } from '../pages/NoteDetailPage';
import { MyTaskNote } from '../pages/MyTaskNote';
import { MyProjectPages } from '../pages/MyProjectPages';
import { NewProjectLayout } from '../components/notelayout/NewProjectLayout';
import { UpdateProfilePage } from '../components/myprofile/UpdateProfilePage';

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
        <Route path='/' element={<HomePage/>}/>
        <Route path='/category' element={<MainLayout><CategoriesPage/></MainLayout>}/>
        <Route path='/note-form' element={<MainLayout><NoteFrom /></MainLayout>}/>
        <Route path='/tasks-note' element={<MainLayout><TasksNotes/></MainLayout>}/>
        <Route path = 'tasks-note/task-layout' element = {<MainLayout><TaskLayout/></MainLayout>}/>
        <Route path='/note-form/create' element={<MainLayout><CreateNotePage/></MainLayout>}/>
        <Route path='/tasks-note/note-status' element={<MainLayout><NoteStatusPage/></MainLayout>}/>
        <Route path='/profile' element={<MainLayout><ProfilePage/></MainLayout>}/>
        <Route path='/note-form/edit/:id' element={<MainLayout><EditNotePage/></MainLayout>} />
        <Route path='/note-form/detail/:id' element={<MainLayout><NoteDetailPage/></MainLayout>} />
        <Route path='/board' element={<MainLayout><NoteStatusPage/></MainLayout>}/>
        <Route path='/my-tasks' element={<MainLayout><MyTaskNote/></MainLayout>}/>
        <Route path='/my-project' element={<MainLayout><MyProjectPages/></MainLayout>}/>
        <Route path='/my-project/new-project' element={<MainLayout><NewProjectLayout/></MainLayout>}/>
        <Route path='/profile/edit-profile' element={<MainLayout><UpdateProfilePage/></MainLayout>}/>


        </Route>

        <Route path='*' element={<Navigate to='/' replace/>}/>
    </Routes>
  )

        

}