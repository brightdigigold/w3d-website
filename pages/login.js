import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { log } from '@/components/logger';
import React from 'react'
import LoginProfile from '@/components/loginAside/loginAside'
const About = () => {
    return (
        <div>
            <Header></Header>
            <div className=''>
                <h1>Login</h1>
                <LoginProfile></LoginProfile>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default About
