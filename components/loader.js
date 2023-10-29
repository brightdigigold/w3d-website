import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import { log } from "./logger";

const Loader = () => {
    return (
        <div>
            <div className='loader_position'>
                <ThreeCircles
                    height="100"
                    width="100"
                    color="#EECA47"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="three-circles-rotating"
                    outerCircleColor=""
                    innerCircleColor=""
                    middleCircleColor=""
                />
            </div>
            <style>{`
            .loader_position{
                 position: absolute;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%);
                    margin: 0 auto;
                    z-index:999999;
            }
            .blur-background {
            filter: blur(5px);
            }
            `}</style>
        </div>
    )
}

export default Loader
