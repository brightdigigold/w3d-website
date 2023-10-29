import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import style from './dashboardDetails/dashboardDetails.module.css'
import { log } from "./logger";

const AreaChart = () => {
    const [isActive,setIsActive] = useState("1M")
    const [chartData, setChartData] = useState(null);


    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = () => {
        // Fetch chart data from your API or any data source
        const data = {
            labels: ['1 Month', '3 Month', '6 Month', '12 Month', '1 Year', '3 Year', '5 Year'],
            datasets: [
                {
                    label: 'Data',
                    data: [40, 45, 50, 55, 60, 65, 70, 75,],
                    fill: true,
                    backgroundColor: 'rgba(255, 215, 0, 0.4)',
                    borderColor: 'rgba(255, 215, 0, 1)',
                    pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 215, 0, 1)',
                },
            ],
        };

        setChartData(data);
    };
    // const chartOptions = {
    //     scales: {
    //         x: {
    //             display: false, // Hide x-axis labels
    //         },
    //         y: {
    //             display: false, // Hide y-axis labels
    //         },
    //     },
    //     plugins: {
    //         legend: {
    //             display: false, // Hide legend
    //         },
    //         tooltip: {
    //             enabled: false, // Disable tooltips
    //         },
    //     },
    // };
    if (!chartData) {
        return <div>Loading chart data...</div>;
    }
    const handleFilterChange = (monthsAndYear) => {
        // Handle filter change logic here based on selected months
        setIsActive(monthsAndYear)
    
    };
    return (
        <div>

            <div className={style.chart}>
                <Line data={chartData} />
            </div>
            <div className={style.filter_btn}>
                <div className='' onClick={() => handleFilterChange("1M")}>
                    <button className={`${isActive === '1M' ? 'activeType' : 'inactiveType'}`} >1M</button>
                </div>
                <div className='' onClick={() => handleFilterChange("3M")}>
                    <button className={`${isActive === '3M' ? 'activeType' : 'inactiveType'}`} >3M</button>
                </div>
                <div className='' onClick={() => handleFilterChange("6M")}>
                    <button className={`${isActive === '6M' ? 'activeType' : 'inactiveType'}`} >6M</button>
                </div>
                <div className='' onClick={() => handleFilterChange("1Y")}>
                    <button className={`${isActive === '1Y' ? 'activeType' : 'inactiveType'}`} >1Y</button>
                </div>
                <div className='' onClick={() => handleFilterChange("3Y     ")}>
                    <button className={`${isActive === '3Y' ? 'activeType' : 'inactiveType'}`} >3Y</button>
                </div>




            </div>
            <style>{`
            .activeType{
                background: #EECA47;
                border-radius: 5.09091px;
                font-weight: 400;
                font-size: 15.2727px;
                line-height: 150%;
                color: #000000;
                padding:5px 10px;

            }
            .inactiveType{
                background: rgba(44, 123, 172, 0.2);
                border: 1.27273px solid #2C7BAC;
                border-radius: 5.09091px;
                font-weight: 400;
                font-size: 15.2727px;
                line-height: 150%;
                color: #FFFFFF;
                padding:5px 10px;
            }
            `}</style>
        </div>
    );
};

export default AreaChart;
