import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { RootState } from '@/redux/store';
import { postMethodHelperWithEncryption } from '@/api/postMethodHelper';
import Notiflix from "notiflix";
import OTPCorporateSignUp from './modals/otpCorporateSignUp';
import CustomButton from './customButton';

interface setCorporateProfile {
    isOpen: boolean;
    onClose: () => void;
}

// Define the Yup validation schema
const schema = Yup.object().shape({
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    gstMobile: Yup.string().required('GST Mobile is required'),
    gstNumber: Yup.string().required('GST Number is required'),
    legalName: Yup.string().required('Name is required'),
    pan: Yup.string().required('PAN is required'),
    tradeName: Yup.string().required('Trade Name is required'),
    name: Yup.string().required('Name is required'),
    mobile_number: Yup.string()
        .matches(/^[6789][0-9]{9}$/, 'Mobile No. is not valid')
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Enter a valid Mobile Number')
        .required('Mobile Number is required'),
    gmail: Yup.string().email('Invalid email address').required('Gmail is required'),
    termsAndConditions: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
    type: Yup.string().required('User type Name is required'),
    mode: Yup.string().required('Mode Name is required'),
    country_iso: Yup.string().required('County ISO is required'),
    isCountryIsoRequired: Yup.boolean().required('County ISO is required'),
});

// Updated SetProfileCorporate component
const SetProfileCorporate: React.FC<setCorporateProfile> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const userType = useSelector((state: RootState) => state.auth.UserType);
    const showProfileFormCorporate = useSelector((state: RootState) => state.auth.showProfileFormCorporate);
    const corporateBusinessDetails = useSelector((state: RootState) => state.auth.corporateBusinessDetails);
    const [showCorporateOTPModal, setShowCorporateOTPModal] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [OTPMsg, setOTPMsg] = useState<string | null>(null);
    const [otpDetails, setOtpDetails] = useState<any>(null);

    const closeCorporateOTPModal = () => {
        setShowCorporateOTPModal(false);
    }

    useEffect(() => {
        const toggleBodyScroll = (shouldLock: boolean) => {
            document.body.style.overflow = shouldLock ? 'hidden' : 'auto';
        };

        toggleBodyScroll(showProfileFormCorporate);
        return () => toggleBodyScroll(false);
    }, [showProfileFormCorporate]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            dateOfBirth: corporateBusinessDetails?.dateOfBirth,
            gstMobile: corporateBusinessDetails?.gstMobile,
            gstNumber: corporateBusinessDetails?.gstNumber,
            legalName: corporateBusinessDetails?.legalName,
            pan: corporateBusinessDetails?.pan,
            tradeName: corporateBusinessDetails?.tradeName,
            name: '',
            gmail: '',
            mobile_number: '',
            termsAndConditions: false,
            type: userType,
            country_iso: '91',
            isCountryIsoRequired: true,
            mode: "signUp",
        }
    });

    // Update onSubmit to receive form data
    const onSubmit = async (data: any) => {
        try {
            setSubmitting(true);
            const result = await postMethodHelperWithEncryption(
                `${process.env.baseUrl}/auth/send/otp`,
                data,
            );

            if (!result.isError && result.data.status) {
                setOTPMsg(result.data.message);
                setOtpDetails({
                    name: data.name,
                    gmail: data.gmail,
                    mobile_number: data.mobile_number,
                    termsAndConditions: data.termsAndConditions,
                    type: userType,
                    country_iso: '91',
                    isCountryIsoRequired: true,
                    mode: "signUp",
                });
                setShowCorporateOTPModal(true);
                setSubmitting(false);
            } else if (result.isError) {
                // setError(result?.errorMsg);
                Notiflix.Report.failure('Error', result?.errorMsg || 'An unexpected error occurred.', 'OK');
            }
        } catch (error) {
            // This block may not be needed unless you want to handle non-Axios errors
            Notiflix.Report.failure('Error', 'Something went wrong!', 'OK');
            setSubmitting(false);
        } finally {
            setSubmitting(false);
            Notiflix.Loading.remove();
        }
    };

    return (
        <aside id="default-sidebar" className={`bg-theme fixed top-0 right-0 h-full w-full lg:w-4/12 md:w-5/12 sm:w-6/12  transition-transform-x-${isOpen ? '0' : 'full'}transition-transform ease-in-out z-50 `} style={{ zIndex: 1000 }}>
            <div ref={modalRef} className="grid  h-screen place-items-center w-full">
                <div className="flex flex-col h-full w-full">
                    {showCorporateOTPModal && otpDetails && (
                        <OTPCorporateSignUp OTPMsg={OTPMsg} otpDetails={otpDetails} closeModal={closeCorporateOTPModal} />
                    )}
                    <button type='button' onClick={onClose} className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer ">
                        <FaTimes size={28} className="text-themeBlueLight hover:text-red-500 border-1 rounded-full p-1 transition-colors duration-300 ease-in-out" />
                    </button>
                    <img
                        src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png"
                        className="h-10 sm:h-16 md:h-20 lg:h-20 mx-auto mt-2 sm:mt-8 md:mt-5"
                    />

                    <div className='flex h-screen w-full'>
                        <form onSubmit={handleSubmit(onSubmit)} className='text-gray-200 w-full sm:mt-4'>
                            <div className='px-4'>
                                <div className="mb-3">
                                    <label className="text-white">GST Number</label>
                                    <input
                                        className="text-white placeholder:text-gray-500 tracking-widest bold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none"
                                        {...register('gstNumber')}
                                        readOnly />
                                    {errors.gstNumber && <p className='text-red-600'>{errors.gstNumber.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label className="text-white">PAN</label>
                                    <input
                                        className="text-white placeholder:text-gray-500 tracking-widest bold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none"
                                        {...register('pan')}
                                        readOnly />
                                    {errors.pan && <p className='text-red-600'>{errors.pan.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label className="text-white">Email Address</label>
                                    <input
                                        className="text-white placeholder:text-gray-500 tracking-widest bold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none"
                                        placeholder="EMAIL ADDRESS"
                                        {...register('gmail')} />
                                    {errors.gmail && <p className='text-red-600 text-sm'>{errors.gmail.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label className="text-white">Mobile Number</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="MOBILE NUMBER"
                                        className="text-white placeholder:text-gray-500 tracking-widest bold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none"
                                        {...register('mobile_number')} />
                                    {errors.mobile_number && <p className='text-red-600 text-sm'>{errors.mobile_number.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label className="text-white">Name</label>
                                    <input
                                        className="text-white placeholder:text-gray-500 tracking-widest bold border-1 rounded mt-1 w-full p-2 coins_backgroun outline-none"
                                        placeholder="NAME"
                                        {...register('name')} />
                                    {errors.name && <p className='text-red-600 text-sm mb-2'>{errors.name.message}</p>}
                                </div>
                            </div>
                            <div className="bottom-1 absolute w-full px-4">
                                <div className="flex">
                                    <div>
                                        <input
                                            className="cursor-pointer placeholder:text-gray-500 w-4 h-5 text-theme coins_background rounded-lg focus:outline-none"
                                            id="termsAndConditions"
                                            type="checkbox"
                                            {...register('termsAndConditions')} />
                                    </div>
                                    <div>
                                        <label htmlFor="termsAndConditions" className="ml-2 text-white text-justify text-xs sm:text-sm">
                                            By continuing, I confirm that I am authorized to act on behalf of the company and accept the E-sign disclosure and electronic communications consent.
                                        </label>
                                    </div>
                                </div>
                                {errors.termsAndConditions && <p className='text-red-600 text-sm ml-4'>{errors.termsAndConditions.message}</p>}
                                <CustomButton
                                    btnType="submit"
                                    title="SEND OTP"
                                    loading={submitting}
                                    isDisabled={submitting}
                                    containerStyles="bg-themeBlue px-4 py-2 rounded-full w-full lg:w-full sm:w-full sm:mx-full mt-2 mb-2 extrabold text-black"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SetProfileCorporate;
