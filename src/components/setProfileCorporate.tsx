import { setShowProfileFormCorporate } from '@/redux/authSlice';
import { AppDispatch } from '@/redux/store';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import CustomButton from './customButton';

interface FormValues {
    dateOfBirth: string;
    gstMobile: string;
    gstNumber: string;
    legalName: string;
    pan: string;
    tradeName: string;
    name: string;
    mobileNumber: string;
    gmail: string;
    mobile_number: string;
    termsAndConditions: boolean;
    type: string;
    country_iso: '91';
    isCountryIsoRequired: boolean;
    mode: string;
}

const SetProfileCorporate = () => {
    const dispatch: AppDispatch = useDispatch();

    const handleClose = () => {
        dispatch(setShowProfileFormCorporate(false));
    }

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        mode: 'onSubmit', // Validate only on form submission
        defaultValues: {
            dateOfBirth: '01/07/2017',
            gstMobile: '9582967915',
            gstNumber: '07AADCD4946L1ZC',
            legalName: '',
            pan: 'GTEPK8368A',
            tradeName: '',
            name: '',
            gmail: '',
            mobileNumber: "",
            termsAndConditions: false,
            type: "user",
            country_iso: '91',
            isCountryIsoRequired: false,
            mode: "",
        }
    });

    const onSubmit = (data: FormValues) => {
        console.log('Form submitted with data:', data);
    };

    return (
        <aside id="default-sidebar" className="bg-theme fixed top-0 right-0 z-40 lg:w-4/12 md:w-5/12 sm:w-6/12 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <button
                onClick={handleClose}
                className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer"
            >
                <FaTimes size={28} className="text-themeBlueLight hover:text-red-500 border-1 rounded-full p-1 transition-colors duration-300 ease-in-out" />
            </button>
            <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png" className="h-20 mx-auto mt-12 md:mt-6" />
            <div className='flex h-screen w-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='text-gray-200 w-full'>
                    <div className='px-4'>
                        <div className={styles.p2}>
                            <label className={styles.p1}>GST Number</label>
                            <input
                                className={styles.p0}
                                {...register('gstNumber', { required: 'GST Number is required' })}
                                readOnly
                            />
                            {errors.gstNumber && <p className='text-red-600'>{errors.gstNumber.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>PAN</label>
                            <input
                                className={styles.p0}
                                {...register('pan', { required: 'PAN is required' })}
                                readOnly
                            />
                            {errors.pan && <p className='text-red-600'>{errors.pan.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>Name</label>
                            <input
                                className={styles.p0}
                                placeholder="NAME"
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className='text-red-600 text-sm '>{errors.name.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>Mobile Number</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                minLength={10}
                                maxLength={10}
                                placeholder="MOBILE NUMBER"
                                className={styles.p0}
                                {...register('mobileNumber', { required: 'Mobile Number is required' })}
                            />
                            {errors.mobileNumber && <p className='text-red-600 text-sm '>{errors.mobileNumber.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>Email Address</label>
                            <input
                                className={styles.p0}
                                placeholder="EMAIL ADDRESS"
                                {...register('gmail', { required: 'Gmail is required' })}
                            />
                            {errors.gmail && <p className='text-red-600 text-sm '>{errors.gmail.message}</p>}
                        </div>

                        <div className='flex mx-auto'>
                            <div>
                                <input
                                    className="cursor-pointer w-4 h-5 text-theme coins_background rounded-lg focus:outline-none"
                                    id="termsAndConditions"
                                    type="checkbox"
                                    {...register('termsAndConditions', { required: 'You must accept the terms and conditions' })}
                                />
                            </div>
                            <div>
                                <label htmlFor="termsAndConditions" className="ml-2 text-white text-justify text-sm">
                                    By continuing, I confirm that I am authorized to act on behalf of the company and accept the E-sign disclosure and electronic communications consent.
                                </label>
                            </div>
                        </div>
                        {errors.termsAndConditions && <p className='text-red-600 text-sm ml-4'>{errors.termsAndConditions.message}</p>}

                    </div>
                    <div className="bottom-2 absolute w-full px-4">
                        <button
                            type="submit"
                            title="SEND OTP"
                            className="bg-themeBlue px-4 py-2 rounded-full w-full mt-2 mb-2 extrabold text-black"
                        >
                            SEND OTP
                        </button>
                    </div>
                </form>
            </div>
        </aside>
    )
}

const styles = {
    p0: "hidden xl:block bold text-gray-100 hover:bg-gray-800 hover:text-white rounded-md py-1.5 text-gray-100 tracking-wider placeholder:text-gray-500 border-1 rounded w-full p-2 coins_backgroun outline-none user-select-none focus:bg-transparent focus:outline-none",
    p1: 'bold tracking-wide pb-0.5',
    p2: 'flex flex-col pb-2'
};

export default SetProfileCorporate;
