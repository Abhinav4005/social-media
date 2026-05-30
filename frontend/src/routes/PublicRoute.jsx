import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return !isAuthenticated ? children : <Navigate to="/" replace/>;
}

export default PublicRoute;
