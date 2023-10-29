import React,{useEffect,useState} from 'react';
import { log } from "./logger";
const CountDown = ({timer,onRestart}) => {

    const [[hrs, mins, secs], setTime] = useState(timer);

    const tick = () => {

        setTime(([hrs,mins,secs]) => {
            if (hrs === 0 && mins === 0 && secs === 0) {
                onRestart();
                return timer;
            }else if (mins === 0 && secs === 0) {
                return [hrs - 1, 59, 59];
            } else if (secs === 0) {
                return [hrs, mins -1, 59];
            } else {
               return [hrs, mins, secs-1];
            }
        });
    };
   

    useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    }, [])

    useEffect(() => {
        if (timer) {
            setTime(timer);
        }
    }, [timer])

    return (<>
    {`${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
    </>);

}
export default CountDown;