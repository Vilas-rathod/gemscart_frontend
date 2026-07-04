import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Guards a route tree by role.
 *   <RoleRoute roles={['SELLER','ADMIN']}>...</RoleRoute>
 * Unauthenticated → /login (remembers target). Wrong role → home.
 */
const RoleRoute = ({ roles, redirectTo = "/", children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);
  console.log("Role:", user?.role);
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default RoleRoute;
