// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { useAppSelector } from "@/app/hooks";

const PrivateRoute = () => {
  const token = useAppSelector((state: RootState) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
