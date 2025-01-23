import { Outlet } from "react-router";
import {useAuth} from "./hooks/AuthProvider.tsx";

const PrivateRoute = () => {
    const user = useAuth();
    if (!user.token) console.log("user not auth");
    return <Outlet />;
};

export default PrivateRoute;