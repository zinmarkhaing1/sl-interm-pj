


// import { Route, Routes, Navigate, Outlet } from 'react-router-dom';

// import { HomePage } from '../pages/HomePage'
// import { LoginForm } from '../auth/LoginForm';
// import { SignUpForm } from '../auth/SignUpForm'
// import { CategoriesPage } from '../components/tag_categories/CategoriesPage'

// import { CreateNotePage } from '../pages/CreateNotePage'
// import { MainLayout } from '../components/layout/MainLayout';
// import { ProfilePage } from '../pages/ProfilePage';
// import { NoteFrom } from '../pages/NoteFrom';
// import { EditNotePage } from '../pages/EditNotePage';
// import { NoteStatusPage } from '../components/status-page/NoteStatusPage';
// import {TasksNotes} from '../pages/TasksNotes';
// import  {TaskLayout} from "../components/notelayout/TaskLayout";
// import { NoteDetailPage } from '../pages/NoteDetailPage';
// import { MyTaskNote } from '../pages/MyTaskNote';
// import { MyProjectPages } from '../pages/MyProjectPages';
// import { NewProjectLayout } from '../components/notelayout/NewProjectLayout';
// import { UpdateProfilePage } from '../components/myprofile/UpdateProfilePage';
// import { SharedTaskPage } from '../components/status-page/SharedTaskPage';
// // import { PlainTextNotePage } from '../components/notecreatepage/PlainTextNotePage';
// // import { NoteCreateForm } from '../components/createfolder/NoteCreateForm';
// import {NoteCreateForm } from "../components/createfolder/NoteCreateForm";
// import { DashBoardPage } from '../pages/DashBoardPage';



// const AuthenticatedRoutes = () => {
//     const isAuthenticated = localStorage.getItem('token');
//     if (!isAuthenticated) {
//         return <Navigate to='/login' replace/>
//     }

//     return <Outlet/>
// };

// export const Router = () => {

//     return (
//     <Routes>
//         <Route path='/login' element= {<LoginForm/>}/>
//         <Route path='/signup' element= {<SignUpForm/>}/>

     
//         <Route element={<AuthenticatedRoutes/>}>
//         <Route path='/' element={<HomePage/>}/>
//         <Route path='/dashboard' element={<MainLayout><DashBoardPage/></MainLayout>}/>
//         <Route path='/category' element={<MainLayout><CategoriesPage/></MainLayout>}/>
//         <Route path='/board' element={<MainLayout><NoteStatusPage/></MainLayout>}/>
//         <Route path='/profile' element={<MainLayout><ProfilePage/></MainLayout>}/>
//         <Route path='/profile/edit-profile' element={<MainLayout><UpdateProfilePage/></MainLayout>}/>




//         {/* for new note page */}
//         <Route path='/note-form' element={<MainLayout><NoteFrom /></MainLayout>}/>
//         <Route path='/note-form/create' element={<MainLayout><CreateNotePage/></MainLayout>}/>
//         <Route path='/note-form/edit/:id' element={<MainLayout><EditNotePage/></MainLayout>} />
//         <Route path='/note-form/detail/:id' element={<MainLayout><NoteDetailPage/></MainLayout>} />

//         {/* for task notes page  */}
//         <Route path='/tasks-note' element={<MainLayout><TasksNotes/></MainLayout>}/>
//         <Route path = 'tasks-note/task-layout' element = {<MainLayout><TaskLayout/></MainLayout>}/>

//         {/* for my task page  */}
//         <Route path='/my-tasks' element={<MainLayout><MyTaskNote/></MainLayout>}/>
//         <Route path='/my-tasks/shared-task' element={<MainLayout><SharedTaskPage/></MainLayout>}/>

//         {/* for project page */}
//         <Route path='/my-project' element={<MainLayout><MyProjectPages/></MainLayout>}/>
//         <Route path='/my-project/new-project' element={<MainLayout><NewProjectLayout/></MainLayout>}/>

//       {/* for note create form page  */}
//         <Route path='/note' element={<MainLayout><NoteCreateForm/></MainLayout>}/>

//         </Route>

//         <Route path='*' element={<Navigate to='/' replace/>}/>
//     </Routes>
//   )

// }

// // import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
// // import { HomePage } from '../pages/HomePage';
// // import { LoginForm } from '../auth/LoginForm';
// // import { SignUpForm } from '../auth/SignUpForm';
// // import { CategoriesPage } from '../components/tag_categories/CategoriesPage';
// // import { CreateNotePage } from '../pages/CreateNotePage';
// // import { MainLayout } from '../components/layout/MainLayout';
// // import { ProfilePage } from '../pages/ProfilePage';
// // import { NoteFrom } from '../pages/NoteFrom';
// // import { EditNotePage } from '../pages/EditNotePage';
// // import { NoteStatusPage } from '../components/status-page/NoteStatusPage';
// // import { TasksNotes } from '../pages/TasksNotes';
// // import { TaskLayout } from "../components/notelayout/TaskLayout";
// // import { NoteDetailPage } from '../pages/NoteDetailPage';
// // import { MyTaskNote } from '../pages/MyTaskNote';
// // import { MyProjectPages } from '../pages/MyProjectPages';
// // import { NewProjectLayout } from '../components/notelayout/NewProjectLayout';
// // import { UpdateProfilePage } from '../components/myprofile/UpdateProfilePage';
// // import { SharedTaskPage } from '../components/status-page/SharedTaskPage';
// // import { NoteCreateForm } from '../components/createfolder/NoteCreateForm';
// // import { DashBoardPage } from '../pages/DashBoardPage';

// // // ============ Option 1: Keep MainLayout wrapper (Current approach) ============
// // const AuthenticatedRoutes = () => {
// //   const isAuthenticated = localStorage.getItem('token');
// //   if (!isAuthenticated) {
// //     return <Navigate to='/login' replace />;
// //   }
// //   return <Outlet />;
// // };

// // export const Router = () => {
// //   return (
// //     <Routes>
// //       {/* Public Routes */}
// //       <Route path='/login' element={<LoginForm />} />
// //       <Route path='/signup' element={<SignUpForm />} />

// //       {/* Protected Routes */}
// //       <Route element={<AuthenticatedRoutes />}>
// //         {/* Dashboard & Home */}
// //         <Route path='/' element={<HomePage />} />
// //         <Route path='/dashboard' element={<DashBoardPage />} />

// //         {/* Notes */}
// //         <Route path='/note-form' element={<MainLayout><NoteFrom /></MainLayout>} />
// //         <Route path='/note-form/create' element={<MainLayout><CreateNotePage /></MainLayout>} />
// //         <Route path='/note-form/edit/:id' element={<MainLayout><EditNotePage /></MainLayout>} />
// //         <Route path='/note-form/detail/:id' element={<MainLayout><NoteDetailPage /></MainLayout>} />

// //         {/* Note Create - Remove duplicate or keep one */}
// //         <Route path='/note' element={<MainLayout><NoteCreateForm /></MainLayout>} />

// //         {/* Categories */}
// //         <Route path='/category' element={<MainLayout><CategoriesPage /></MainLayout>} />

// //         {/* Tasks */}
// //         <Route path='/tasks-note' element={<MainLayout><TasksNotes /></MainLayout>} />
// //         <Route path='/tasks-note/task-layout' element={<MainLayout><TaskLayout /></MainLayout>} />

// //         {/* Board / Status */}
// //         <Route path='/board' element={<MainLayout><NoteStatusPage /></MainLayout>} />

// //         {/* My Tasks */}
// //         <Route path='/my-tasks' element={<MainLayout><MyTaskNote /></MainLayout>} />
// //         <Route path='/my-tasks/shared-task' element={<MainLayout><SharedTaskPage /></MainLayout>} />

// //         {/* Projects */}
// //         <Route path='/my-project' element={<MainLayout><MyProjectPages /></MainLayout>} />
// //         <Route path='/my-project/new-project' element={<MainLayout><NewProjectLayout /></MainLayout>} />

// //         {/* Profile */}
// //         <Route path='/profile' element={<MainLayout><ProfilePage /></MainLayout>} />
// //         <Route path='/profile/edit-profile' element={<MainLayout><UpdateProfilePage /></MainLayout>} />
// //       </Route>

// //       {/* 404 - Not Found */}
// //       <Route path='*' element={<Navigate to='/' replace />} />
// //     </Routes>
// //   );
// // };


import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginForm } from '../auth/LoginForm';
import { SignUpForm } from '../auth/SignUpForm';
import { CategoriesPage } from '../components/tag_categories/CategoriesPage';
import { CreateNotePage } from '../pages/CreateNotePage';
import { MainLayout } from '../components/layout/MainLayout';
import { ProfilePage } from '../pages/ProfilePage';
import { NoteFrom } from '../pages/NoteFrom';
import { EditNotePage } from '../pages/EditNotePage';
import { NoteStatusPage } from '../components/status-page/NoteStatusPage';
import { TasksNotes } from '../pages/TasksNotes';
import { TaskLayout } from "../components/notelayout/TaskLayout";
import { NoteDetailPage } from '../pages/NoteDetailPage';
import { MyTaskNote } from '../pages/MyTaskNote';
import { MyProjectPages } from '../pages/MyProjectPages';
import { NewProjectLayout } from '../components/notelayout/NewProjectLayout';
import { UpdateProfilePage } from '../components/myprofile/UpdateProfilePage';
import { SharedTaskPage } from '../components/status-page/SharedTaskPage';
import { NoteCreateForm } from "../components/createfolder/NoteCreateForm";
import { DashBoardPage } from '../pages/DashBoardPage';
import { NewTaskLayout } from '../components/taskcreated/NewTaskLayout';
import { EditProjectLayout } from '../components/notelayout/EditProjectLayout';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { NewNotePage } from '../pages/NewNotesPage';

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
            <Route path='/login' element={<LoginForm/>}/>
            <Route path='/signup' element={<SignUpForm/>}/>
            
            <Route element={<AuthenticatedRoutes/>}>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/dashboard' element={<MainLayout><DashBoardPage/></MainLayout>}/>
                <Route path='/category' element={<MainLayout><CategoriesPage/></MainLayout>}/>
                <Route path='/board' element={<MainLayout><NoteStatusPage/></MainLayout>}/>
                <Route path='/profile' element={<MainLayout><ProfilePage/></MainLayout>}/>
                <Route path='/profile/edit-profile' element={<MainLayout><UpdateProfilePage/></MainLayout>}/>
                
                <Route path='/note-form' element={<MainLayout><NoteFrom /></MainLayout>}/>
                <Route path='/new-note' element={<MainLayout><NewNotePage/></MainLayout>}/>
                <Route path='/note-form/create' element={<MainLayout><CreateNotePage/></MainLayout>}/>
                <Route path='/note-form/edit/:id' element={<MainLayout><EditNotePage/></MainLayout>} />
                <Route path='/note-form/detail/:id' element={<MainLayout><NoteDetailPage/></MainLayout>} />
                
                <Route path='/tasks-note' element={<MainLayout><TasksNotes/></MainLayout>}/>
                <Route path='/tasks-note/task-layout' element={<MainLayout><TaskLayout/></MainLayout>}/>
                
                <Route path='/my-tasks' element={<MainLayout><MyTaskNote/></MainLayout>}/>
                <Route path='/my-tasks/task-create-note' element={<MainLayout><NewTaskLayout/></MainLayout>}/>
                <Route path='/my-tasks/shared-task' element={<MainLayout><SharedTaskPage/></MainLayout>}/>
                <Route path='/my-tasks/task-detail/:id' element={<MainLayout><TaskDetailPage/></MainLayout>}/>

                
                <Route path='/my-project' element={<MainLayout><MyProjectPages/></MainLayout>}/>
                <Route path='/my-project/new-project' element={<MainLayout><NewProjectLayout/></MainLayout>}/>
                <Route path='/my-project/edit-project/:id' element={<MainLayout><EditProjectLayout/></MainLayout>}/>

                
                <Route path='/note' element={<MainLayout><NoteCreateForm/></MainLayout>}/>
            </Route>
            
            <Route path='*' element={<Navigate to='/' replace/>}/>
        </Routes>
    );
};