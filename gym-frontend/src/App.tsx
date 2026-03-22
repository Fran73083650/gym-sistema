import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ConfigProvider } from "./context/ConfigProvider";
import { NotificacionesProvider } from "./context/NotificacionesProvider";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider>
          <NotificacionesProvider>
            <AppRoutes />
          </NotificacionesProvider>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
