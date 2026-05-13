import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from '@/routes/PrivateRoute'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Materiales from '@/pages/Materiales'
import Modulos from '@/pages/Modulos'
import Proyectos from '@/pages/Proyectos'
import Configuracion from '@/pages/Configuracion'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="materiales" element={<Materiales />} />
        <Route path="modulos" element={<Modulos />} />
        <Route path="proyectos" element={<Proyectos />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
