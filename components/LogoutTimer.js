import { useEffect, useRef,useState,useContext } from 'react';
import { useIdleTimer } from "react-idle-timer"
import { useRouter } from 'next/router';
import IdleTimer from 'react-idle-timer';
import { useDispatch } from 'react-redux';
import { logOutUser, logInUser,doShowLoginAside,profileFilled } from '../store/index';
import { log } from "./logger";

const LogoutTimer = ({ onIdle, idleTime = 1 }) => {
    const router = useRouter();
    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState(false)
    const handleIdle = () => {
        setIdle(true)
        router.push('/')
        localStorage.removeItem("mobile_number");
        localStorage.removeItem("token");
        localStorage.removeItem("isLogIn");
        // setLoading(false);
        // handleToggleMenu(false);
        setToken(false);
        dispatch(logOutUser(false));
        dispatch(profileFilled(false));
    }
    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptTimeout: idleTimeout / 2,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 500
    })

  return {
    isIdle,
    setIdle,
    idleTimer
}
};

export default LogoutTimer;
