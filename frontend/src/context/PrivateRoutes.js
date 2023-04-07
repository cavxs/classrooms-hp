import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';
const PrivateRoutes = () => {
  const {user} = useContext(AuthContext);
    console.log(user);
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;