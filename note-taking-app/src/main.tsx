import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';



import { Provider } from 'react-redux';
import {store} from "./redux/store/index.ts"
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <BrowserRouter>
    <App/>
  
  </BrowserRouter>,
  </Provider>


)
