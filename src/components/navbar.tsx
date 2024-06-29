"use client";
import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { classNames } from "./helperFunctions";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setIsLoggedIn,
  setIsLoggedInForTempleReceipt,
  setShowOTPmodal,
  setShowProfileForm,
} from "@/redux/authSlice";
import { resetUserDetails } from "@/redux/userDetailsSlice";
import SidebarAside from "./mobileSidebar";
import LoginAside from "./authSection/loginAside";
import { resetVault } from "@/redux/vaultSlice";
import { clearCoupon } from "@/redux/couponSlice";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import mixpanel from "mixpanel-browser";
import SetProfileForNewUser from "./setProfile";

const Navbar = () => {
  const dispatch = useDispatch();
  const devotee_isNewUser = useSelector((state: RootState) => state.auth.devotee_isNewUser);
  const showProfileForm = useSelector((state: RootState) => state.auth.showProfileForm);
  const isLoggedInForTempleReceipt = useSelector((state: RootState) => state.auth.isLoggedInForTempleReceipt);
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const isloggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [openLoginAside, setOpenLoginAside] = useState(false);
  const [openSidebarAside, setOpenSidebarAside] = useState(false);
  const handleDropdownToggle = (isOpen: boolean | ((prevState: boolean) => boolean)) => {
    setDropdownOpen(isOpen);
  };

  const logoutProfile = () => {
    localStorage.removeItem("mobile_number");
    localStorage.removeItem("token");
    localStorage.removeItem("isLogIn");
    mixpanel.reset();
    dispatch(setShowOTPmodal(false));
    dispatch(setIsLoggedInForTempleReceipt(false));
    dispatch(setIsLoggedIn(false));
    dispatch(setShowProfileForm(false));
    dispatch(resetUserDetails());
    dispatch(resetVault());
    dispatch(clearCoupon());
    router.push("/");
  };

  // logoutProfile();

  const handleLoginClick = () => {
    if (isLoggedInForTempleReceipt && devotee_isNewUser) {
      dispatch(setShowProfileForm(true));
    } else {
      setOpenLoginAside(!openLoginAside);
    }
    // mixpanel.track('New User Login(web)');
    // dispatch(setShowProfileForm(true));
  };

  const handleSidebarClick = () => {
    setOpenSidebarAside(!openSidebarAside);
  };

  const onClose = () => {
    dispatch(setShowProfileForm(false));
  };

  return (
    <Disclosure as="nav" className="bg-header fixed top-0 w-full z-[49]">
      {({ open, close }) => (
        <>
          {openLoginAside && (
            <LoginAside
              isOpen={openLoginAside}
              onClose={() => setOpenLoginAside(false)}
              purpose="login"
            />
          )}
          {openSidebarAside && (
            <SidebarAside
              isOpen={openSidebarAside}
              onClose={() => setOpenSidebarAside(false)}
            />
          )}

          {showProfileForm && (
            <SetProfileForNewUser isOpen={showProfileForm} onClose={onClose} />
          )}

          <div className="mx-auto px-2 sm:px-6 xl:px-16 py-2 z-10">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center xl:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  onClick={handleSidebarClick}
                  className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>

                  <Bars3Icon
                    className="block h-6 w-6 text-yellow-400"
                    aria-hidden="true"
                  />
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center xl:items-stretch xl:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" prefetch={true}>
                    <img
                      className="h-12 sm:h-16"
                      src={new URL(
                        "../../public/Logo.png",
                        import.meta.url
                      ).toString()}
                      alt="Bright Digi Gold Logo"
                    />
                  </Link>
                </div>
              </div>
              <div className={clsx({ 'border-b-4 border-yellow-500 rounded-md': pathname == '/', })}>
                <Link className={styles.p0} href="/" prefetch={true}>
                  Home
                </Link>
              </div>
              <div className={clsx({ 'border-b-4 border-yellow-500 rounded-md': pathname == '/coins', })}>
                <Link className={styles.p0} href="/coins" prefetch={true}>
                  Coins
                </Link>
              </div>
              <div className={clsx('mb-0', { 'border-b-4 border-yellow-500 rounded-md': pathname == '/about', })}>
                <Link className={styles.p0} href="/about" prefetch={true}>
                  About
                </Link>
              </div>
              {/* <Link className={styles.p0} href="/contact" prefetch={true}>
                Contact Us
              </Link> */}
              {isloggedIn && (
                <>
                  <div className={clsx({ 'border-b-4 border-yellow-500 rounded-md': pathname == '/dashboard', })}>
                    <Link className={styles.p0} href="/dashboard" prefetch={true}>
                      Dashboard
                    </Link>
                  </div>
                  <div className={clsx({ 'border-b-4 border-yellow-500 rounded-md': pathname == '/cart' })}>
                    <Link className={styles.p0} href="/cart" prefetch={true}>
                      Cart
                    </Link>
                  </div>
                </>
              )}

              {isloggedIn ? (
                <div
                  onMouseEnter={() => handleDropdownToggle(true)}
                  onMouseLeave={() => handleDropdownToggle(false)}
                  className={clsx('hidden xl:block text-lg extrabold tracking-wider text-gray-100 hover:bg-gray-800 hover:text-white rounded-md px-5 py-2 relative cursor-pointer z-20', { 'border-b-4 border-yellow-500': pathname == '/myAccount' })}
                >
                  <span>My Account</span>
                  {isDropdownOpen && (
                    <div className='absolute w-32 top-full  left-0 p-2 mt-0 bg-theme space-y-2 shadow-md rounded-md cursor-pointer'>
                      <Link href="/myAccount" prefetch={true}>
                        <div
                          onClick={() => {
                            setDropdownOpen(false);
                            close();
                          }}
                          className="block px-4 text-white text-center rounded py-2 text-sm coins_background cursor-pointer shadow-md"
                        >
                          Profile
                        </div>
                      </Link>

                      <div
                        onClick={() => {
                          setDropdownOpen(false);
                          logoutProfile();
                          close();
                        }}
                        className="block px-4 text-center rounded py-2 text-sm coins_background cursor-pointer shadow-md"
                      >
                        Sign out
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="text-white hidden xl:inline-block ml-3"
                  onClick={handleLoginClick}
                >
                  <span>
                    <Link className="text-white " href="#">
                      Login/Sign Up
                    </Link>
                  </span>
                </div>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <div className="hidden xl:ml-6 xl:block">
                  <div className="flex space-x-4"></div>
                </div>
                {isloggedIn && (
                  <Link
                    href="/cart"
                    prefetch={true}
                    className="text-gray-300 rounded-md text-md extrabold xl:hidden"
                  >
                    <img src="/images/cart.png" alt="cart pic" className="h-6 ml-2" />
                  </Link>
                )}
                {!isloggedIn && (
                  <Link
                    className=" text-gold01  rounded-md text-md extrabold ml-2 xl:hidden"
                    href="#"
                    aria-label="User Profile"
                  >
                    <UserCircleIcon
                      onClick={() => {
                        handleLoginClick();
                      }}
                      className="h-6"
                    />
                  </Link>
                )}

                <Menu as="div" className="relative ml-3">
                  <Menu.Button
                    onClick={() => {
                      close();
                    }}
                    className="relative flex focus:outline-none"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {isloggedIn && (
                      <Link
                        className="block xl:hidden text-gold01   rounded-md px-1 py-2 text-md medium"
                        href="#"
                        aria-label="User Profile"
                      >
                        <UserCircleIcon
                          onClick={() => {
                            close();
                            setDropdownOpen(false);
                          }}
                          className="h-8"
                        />
                      </Link>
                    )}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md coins_background py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {isloggedIn && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/myAccount"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-6 py-2 text-sm text-white hover:bg-transparent"
                              )}
                              prefetch={true}
                            >
                              <div
                                onClick={() => {
                                  close();
                                }}
                              />
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      {!isloggedIn && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-6 py-2 text-white text-sm hover:bg-transparent"
                              )}
                              onClick={() => {
                                handleLoginClick();
                              }}
                            >
                              Login/Sign Up
                            </Link>
                          )}
                        </Menu.Item>
                      )}

                      {isloggedIn && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-6 py-2 text-white text-sm hover:bg-transparent"
                              )}
                              onClick={() => {
                                logoutProfile();
                              }}
                            >
                              Sign out
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure >
  );
};

const styles = {
  p0: "hidden xl:block text-lg  extrabold text-gray-100 hover:bg-gray-800 hover:text-white rounded-md px-5 py-2",
  p1: "block flex items-center gap-3 rounded-md px-3 py-2 text-lg  extrabold text-white",
};

export default Navbar;
