import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/auth"
import { RoutesApp } from "./routes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "./context/theme";

function App() {

  return (
    <BrowserRouter basename="/">
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 4000000000 }}
          />
          <RoutesApp />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>

  )
}

export default App
