import { Cookies } from "react-cookie";
import { setLogin } from "./redux/state";
import { useDispatch } from "react-redux";
import axios from "./axios";

export const GoogleCookie = () => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const dispatch = useDispatch();

    if (accessToken) {
        const getUser = async () => {
            const response = await axios.get(`/api/auth/me`);
            dispatch(
                setLogin({
                    user: response.data,
                    token: accessToken,
                })
            );
        };
        getUser();
    }
}

export const RemoveCookie = () => {
    const cookies = new Cookies();
    cookies.remove('accessToken');
}

