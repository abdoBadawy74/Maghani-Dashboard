import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { USER } from "../../../Api/Api";
import Loading from "../../../Components/Loading/Loading";
import { Axios } from "../../../Api/axios";
import Err403 from "../Errors/Err403";

export default function RequireAuth({ allowedRole }) {
    const navigate = useNavigate();
    // user
    const [user, setUser] = useState(null);

    useEffect(() => {
        Axios.get(`/${USER}`)
            .then((res) => {
                console.log(res.data);
                setUser(res.data);
            })
            .catch((err) => {
                navigate("/login", { replace: true });
            });
    }, []);

    // cookie && token
    const cookie = Cookie();
    const token = cookie.get("e-commerce");

    //   token ? <Outlet /> : <Navigate to="/login" replace={true} />;

    //   check if the token is available or not
    if (token) {
        if (user === null) {
            return <Loading />;
        } else if (allowedRole.includes(user?.role)) {
            return <Outlet />;
        } else {
            return <Err403 role={user?.role} />;
        }
    } else {
        return <Navigate to="/login" replace={true} />;
    }
}