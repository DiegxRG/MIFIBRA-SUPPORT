import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './routes';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#141A26',
            border: '1px solid #2B3448',
            color: '#F5F7FB',
          },
        }}
      />
    </>
  );
}
