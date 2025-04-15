import { Navigate } from "react-router";
import { useAuthContext } from "../../lib/hooks/useAuthContext";

const ProtectedRoute:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;