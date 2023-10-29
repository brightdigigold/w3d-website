import React from 'react'
import style from './header.module.css'
import Image from 'next/image'
import { useState, useEffect, useRef } from "react"
import Link from 'next/link'
import { useRouter } from 'next/router'
import LoginAside from '../loginAside/loginAside'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Loader from '../loader'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { logOutUser, logInUser,doShowLoginAside,profileFilled } from '../../store/index';
import { log } from "../logger";

const Header = ({ myAccount }) => {
    const dispatch = useDispatch();
    // const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('')
    const router = useRouter();
    const [shoeNavBar, setShowNavBar] = useState(false)
    let menuRef = useRef()
    const [showAside, setShowAside] = useState(false);
    const [token, setToken] = useState(false);
    const [toggleHeader, setToggleHeader] = useState(false);
    const handleShowAside = () => {
        log("handleShowAside:")
        dispatch(doShowLoginAside(true));
    };
    const handleCloseAside = ()=>{
        log("handleCloseAside:")
        dispatch(doShowLoginAside(false));
    };
    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const isActive = (path) => {
        // 
        return router.pathname === path ? 'active' : '';
    };
    const handleClick = () => {
        // setLoading(true);
        handleToggleMenu(false)
    }

    const data = useSelector((state) => {
        return state.auth
    })


    useEffect(() => {
        let handler = (e) => {
            if (!menuRef?.current?.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
    })


    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollPosition = window.pageYOffset;
    //         setIsSticky(scrollPosition > 0);
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    useEffect(() => {
        const tokenTemp = localStorage.getItem("token");
        // 
        if (tokenTemp) {
            setToken(true);
            dispatch(logInUser(true));
        } else {
            dispatch(logOutUser(false));
        }

    }, [router.pathname, toggleHeader]);


    const logoutProfile = () => {
        router.push('/')
        localStorage.removeItem("mobile_number");
        localStorage.removeItem("token");
        localStorage.removeItem("isLogIn");
        // setLoading(false);
        // handleToggleMenu(false);
        setToken(false);
        dispatch(logOutUser(false));
        dispatch(profileFilled(false));
        //  setLoading(true);
       

    }
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = (state = false) => {
        setIsMenuOpen(state);
    };
    return (
        // <div>{loading && <Loader />}
            <div className={`${style.header} ${isSticky ? style.sticky : ''}`}>
                <div className={style.header_background}>
                    <header className='d-none d-md-block'>
                        <nav className="navbar navbar-expand-lg navbar-light header">
                            <div className="container ">
                                <div className={style.gold_img}>
                                    <Link href={"/"}>
                                        <Image src="/images/bdg_logo_large.png" height={130} width={130} alt='gold-logo' />
                                    </Link>
                                </div>
                                <div className='d-flex'>
                                    <ul className="navbar-nav">
                                        <li className={`header-item ${isActive('/')}`}>
                                            <Link href="/" legacyBehavior>
                                                <a onClick={handleClick} className="nav-link">Home</a>
                                            </Link>
                                        </li>
                                        <li className={`header-item ${isActive('/coins')}`}>
                                            <Link href="/coins" legacyBehavior>
                                                <a onClick={handleClick} className="nav-link">Coins</a>
                                            </Link>
                                        </li>
                                        <li className={`header-item ${isActive('/about')}`}>
                                            <Link href="/about" legacyBehavior>
                                                <a onClick={handleClick} className="nav-link">About</a>
                                            </Link>
                                        </li>
                                        <li className={`header-item ${isActive('/contact')}`}>
                                            <Link href="/contact" legacyBehavior>
                                                <a onClick={handleClick} className="nav-link">Contact</a>
                                            </Link>
                                        </li>
                                        {data.isAuthenticated ? (
                                            <>

                                                <li className={`header-item ${isActive('/dashboard/orders')}`}>
                                                    <Link href="/dashboard/orders" legacyBehavior>
                                                        <a onClick={handleClick} className="nav-link">Dashboard</a>
                                                    </Link>
                                                </li>
                                                {/* <div ref={menuRef}>
                                                <li className={`header-item ${isActive('/Profile/profile')}`} onClick={handlePopoverClick}>My Account
                                                </li>

                                                {
                                                    isOpen &&
                                                    (
                                                        <>
                                                            <div className='dropDown' >
                                                                <div onClick={sendToProfile} >Profile</div>
                                                
                                                                <div className='mt-3' style={{ cursor: "pointer" }} onClick={logoutProfile}>Logout</div>
                                                        

                                                            </div>
                                                        </>
                                                    )

                                                }
                                            </div> */}
                                                <li className={`header-item dropdown ${isActive('/profile')}`}>

                                                    <a className="nav-link">My Account</a>

                                                    <ul className="dropdown-menu">
                                                        <li onClick={handleClick}>
                                                            <Link href="/profile">Profile</Link>
                                                        </li>
                                                        <li onClick={logoutProfile}>
                                                            <a  onClick={handleClick} style={{ cursor: "pointer", marginTop: "10px" }}>Logout</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </>

                                        ) : (

                                            <li className={`header-item dropdown ${isActive('#')}`}>
                                                <Link onClick={handleClick} href="#" legacyBehavior>
                                                    <a  className="nav-link" onClick={handleShowAside}>Login/Sign Up</a>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </nav>

                    </header>

                    <header className='d-block d-md-none mobile'>
                        <div className={style.mobileHeader}>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className={style.gold_img}>
                                   <Link href={'/'}><Image src="/images/bdg_logo_large.png" height={100} width={100} alt='gold-logo' /></Link>
                                </div>
                                <div className={style.hamburgerIcon} onClick={()=>handleToggleMenu(true)}>
                                <Image src={"/images/homeicon.svg"} width={25} height={25} alt='home' title='Home'></Image>
                                </div>
                            </div>
                            {isMenuOpen &&
                            <div className={`${style.menuContainer} ${isMenuOpen ? style.open : ''}`}>
                                <AiOutlineCloseCircle style={{ margin: "20px", color: '#fff', fontSize: "30px" }} onClick={()=>handleToggleMenu(false)} />
                                <ul className={style.menuItems}>
                                    <div className='d-flex justify-content-start gap-3 m-3'>
                                        <Image src={"/images/mobile_icons/Home.svg"} width={25} height={25} alt='home' title='Home'></Image>
                                        <li onClick={handleClick}><Link href="/" legacyBehavior>Home</Link></li>
                                    </div>
                                    <div className='d-flex justify-content-start gap-3 m-3 ' style={{ color: "#fff" }}>
                                        <Image src={"/images/mobile_icons/About Us.svg"} width={25} height={25} alt='about' title='About Us'></Image>
                                        <li onClick={handleClick}><Link href="/about" legacyBehavior>About Us</Link></li>
                                    </div>
                                    <div className='d-flex justify-content-start gap-3 m-3'>
                                        <Image src={"/images/mobile_icons/Contact.svg"} width={25} height={25} alt='contactus' title='Contact Us'></Image>
                                        <li onClick={handleClick}><Link href="/contact" legacyBehavior>Contact Us</Link></li>
                                    </div>
                                    <div className='d-flex justify-content-start gap-3 m-3'>
                                        <Image src={"/images/mobile_icons/Coin.svg"} width={25} height={25} alt='coin' title='Coin'></Image>
                                        <li onClick={handleClick}><Link href="/coins" legacyBehavior>Coins </Link></li>
                                    </div>
                                    {data.isAuthenticated ? 
                                        (
                                            <>
                                                <div className='d-flex justify-content-start gap-3 m-3'>
                                                    <Image src={"/images/mobile_icons/Vault.svg"} width={25} height={25} alt='dashboard' title='Vault'></Image>
                                                    <li onClick={handleClick}><Link href="/dashboard/orders" legacyBehavior>Dashboard</Link></li>
                                                </div>
                                                <div className='d-flex justify-content-start gap-3 m-3'>
                                                    <Image src={"/images/mobile_icons/Profile.svg"} width={25} height={25} alt='profile' title='Profile'></Image>
                                                    <li onClick={handleClick}><Link href="/profile" legacyBehavior>Profile</Link></li>
                                                </div>

                                                <div onClick={handleClick} className='d-flex justify-content-start gap-3 m-3'>
                                                    <Image src={"/images/mobile_icons/Logout.svg"} width={25} height={25} alt='logout' title='Logout'></Image>
                                                    <li onClick={logoutProfile}>Logout</li>
                                                </div>

                                            </>
                                        ) : (
                                            <>
                                                <div  onClick={handleClick} className='d-flex justify-content-start gap-3 m-3'>
                                                    <Image src={"/images/login_signup.svg"} width={25} height={25} />
                                                    <li onClick={handleShowAside}>Login/Sign Up</li>
                                                </div>
                                            </>
                                        )

                                    }
                                </ul>
                            </div>
                            }
                        </div>
                    </header>
                </div>
                <div className={`aside-backdrop ${showAside ? 'show' : ''}`} onClick={handleCloseAside} />
                <style>{`
            .navbar {
                
            }

            .navbar-nav{
                display:flex;
                gap:20px;
                align-items:center;
                color:#FFF !important;
                flex-direction: inherit !important;
                position: relative;
                z-index: 1;
            }
          .scroll-container {
                scroll-padding: 50px 0 0 50px;
            }
                .header-item {
                margin-right: 10px;
                border: none;
                border-bottom: 3px solid transparent;
                transition: border-color 0.2s;
                }

                .header-item:hover {
                    border-top:2px solid #EEC644;
                }

                .header-item.active {
                    border-top:2px solid #EEC644;
                }

                .dropdown {
                position: relative;
                }

                .dropdown-menu {
                position: fixed !important;
                top: 65px;
                // right: 120px;
                display: none;
                padding: 10px;
                background-color: #f2f2f2;
                list-style: none;
                background: #123F55;
                padding: 10px 30px;
                border-radius: 8px;
                min-width:70px;
                 z-index: 2;
            
                }
                .dropdown-menu a ,.mobile a{
                color:#FFF !important;
                text-decoration:none;
                }
                .dropdown:hover .dropdown-menu {
                display: block;
                }

                .dropdown-menu li {
                margin-bottom: 5px;
                }
              .aside-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
                display: none;
                }
                .aside-backdrop.show {
                display: block;
                }
            `}</style>
            </div>
        // </div>
    )
}

export default Header
{/* <div className={style.gold_navbar}>
                        <div className={style.gold_img}>
                            <Image src="/images/gold_Logo.png" height={100} width={100} alt='gold-logo' />
                        </div>
                        <div className={style.gold_right_navbar}>
                            <ul>

                                <li
                                    onClick={() => handleClick(0)}
                                >
                                    <div className={activeItem === 0 ? 'activeHeader' : 'inactive'} >Home</div>
                                </li>
                                <li

                                    onClick={() => handleClick(1)}
                                >
                                    <div className={activeItem === 1 ? 'activeHeader' : 'inactive'} >About</div>
                                </li>
                                <li

                                    onClick={() => handleClick(2)}
                                >
                                    <div className={activeItem === 2 ? 'activeHeader' : 'inactive'} >Contact Us</div>
                                </li>
                                {token ?
                                    (
                                        <li
                                            className={activeItem === 3 ? 'activeHeader' : ''}
                                            onClick={() => handleClick(3)}
                                        >
                                            <div className='d-flex align-items-center gap-2' ref={menuRef}>
                                                <div className={activeItem === 3 ? 'activeHeaderA' : 'inactive'} onClick={() => setIsOpen(!isOpen)} >My account </div>
                                                <div><IoIosArrowDown className={activeItem === 3 ? 'activeHeaderA' : 'inactive'} />
                                                </div>
                                                {
                                                    isOpen &&
                                                    (
                                                        <>
                                                            <div className='dropDown' >
                                                                <Link href='/about'>
                                                                    <div >Logout</div>
                                                                </Link>
                                                                <Link href='/Profile/profile'>
                                                                    <div className='mt-3'>Profile</div>
                                                                </Link>
                                                            </div>
                                                        </>
                                                    )

                                                }
                                            </div>
                                        </li>
                                        
                                    ) :
                                    (
                                        <li
                                            className={activeItem === 3 ? 'activeHeader' : ''}
                                            onClick={() => handleClick(3)}
                                        >
                                            <div className={activeItem === 3 ? 'activeHeader' : 'inactive'} onClick={handleShowAside} >Login</div>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div> */}



//                       .activeHeader {
//     border - top: 2px solid #EEC644;
//     color: #EEC644!important;
// }
//                 .active {
//     border - top: 2px solid #EEC644;
//     color: #EEC644!important;
// }
//                 .dropDown{
//     position: absolute;
//     top: 60px;
//     background: #123F55;
//     padding: 10px 30px;
//     border - radius: 8px;
// }
//                 .dropDown a{
//     color: white!important;
//     text - decoration: none;
//     margin - bottom: 10px;
// }
//                 .header - item :hover{
//     border - top: 2px solid #EEC644;
//     color: #EEC644!important;
// }
// {/* .activeHeader {
//                 border-top:2px solid #EEC644;
//                 color:#EEC644 !important;
//                 }
//             .inactive{
//                color:#FFFFFF !important;
//             } */}
//             .dropdown {
//     position: relative;
// }

//         .dropdown - menu {
//     position: absolute;
//     top: 100 %;
//     left: 0;
//     display: none;
//     padding: 10px;
//     background - color: #f2f2f2;
//     list - style: none;
// }

//         .dropdown: hover.dropdown - menu {
//     display: block;
// }


