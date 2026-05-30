import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FeedShellShimmer } from "../components/UI/AppLoader";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    
    if (loading) {
        return <FeedShellShimmer />;
    }

    return isAuthenticated ? children : <Navigate to="/signin" replace/>;
}

export default PrivateRoute;
