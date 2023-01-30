import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { router } from './Router/Router';

function App() {
  return (
    <div className="App">
    <div className='max max-w-full-lg mx-auto bg-white'>
        <Toaster />
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
