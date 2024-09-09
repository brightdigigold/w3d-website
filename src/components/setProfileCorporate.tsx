import { setShowProfileFormCorporate } from '@/redux/authSlice'
import { AppDispatch } from '@/redux/store';
import React from 'react'
import { useDispatch } from 'react-redux'

const SetProfileCorporate = () => {
    const dispatch: AppDispatch = useDispatch();

    const handleClose = () => {
        dispatch(setShowProfileFormCorporate(false));
    }

    return (
        <aside id="default-sidebar" className="fixed top-0 right-0 z-40 lg:w-4/12 md:w-5/12 sm:w-6/12 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 bg-theme">
                <button onClick={handleClose}>close</button>
            </div>
        </aside>
    )
}

export default SetProfileCorporate