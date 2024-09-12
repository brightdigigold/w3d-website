import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaTimes } from 'react-icons/fa';
import CustomButton from './customButton';
import { useDispatch } from 'react-redux';
import { setShowProfileFormCorporate } from '@/redux/authSlice';

// Define the Yup validation schema
const schema = Yup.object().shape({
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    gstMobile: Yup.string().required('GST Mobile is required'),
    gstNumber: Yup.string().required('GST Number is required'),
    legalName: Yup.string().required('Legal Name is required'),
    pan: Yup.string().required('PAN is required'),
    tradeName: Yup.string().required('Trade Name is required'),
    name: Yup.string().required('Name is required'),
    mobileNumber: Yup.string()
        .matches(/^[6789][0-9]{9}$/, 'Mobile No. is not valid')
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Enter a valid Mobile Number')
        .required('Mobile Number is required'),
    gmail: Yup.string().email('Invalid email address').required('Gmail is required'),
    termsAndConditions: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const SetProfileCorporate = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
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
        }
    });

    const onSubmit = (data) => {
        console.log('Form submitted with data:', data);
    };

    return (
        <aside id="default-sidebar" className="bg-theme fixed top-0 right-0 z-40 lg:w-4/12 md:w-5/12 sm:w-6/12 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <button onClick={() => dispatch(setShowProfileFormCorporate(false))} className="absolute top-3 end-2.5 text-white hover:text-gold01 text-xl cursor-pointer ">
                <FaTimes size={28} className="text-themeBlueLight hover:text-red-500 border-1 rounded-full p-1 transition-colors duration-300 ease-in-out" />
            </button>
            <img src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgLogo.png" className="h-20 mx-auto mt-12 md:mt-8" />
            <div className='flex h-screen w-full'>
                <form onSubmit={handleSubmit(onSubmit)} className='text-gray-200 w-full'>
                    <div className='px-4'>
                        <div className={styles.p2}>
                            <label className={styles.p1}>GST Number</label>
                            <input
                                className={styles.p0}
                                {...register('gstNumber')}
                                readOnly
                            />
                            {errors.gstNumber && <p className='text-red-600'>{errors.gstNumber.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>PAN</label>
                            <input
                                className={styles.p0}
                                {...register('pan')}
                                readOnly
                            />
                            {errors.pan && <p className='text-red-600'>{errors.pan.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>Email Address</label>
                            <input
                                className={styles.p0}
                                placeholder="EMAIL ADDRESS"
                                {...register('gmail')}
                            />
                            {errors.gmail && <p className='text-red-600 text-sm'>{errors.gmail.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>Mobile Number</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="MOBILE NUMBER"
                                className={styles.p0}
                                {...register('mobileNumber')}
                            />
                            {errors.mobileNumber && <p className='text-red-600 text-sm'>{errors.mobileNumber.message}</p>}
                        </div>

                        <div className={styles.p2}>
                            <label className={styles.p1}>Name</label>
                            <input
                                className={styles.p0}
                                placeholder="NAME"
                                {...register('legalName')}
                            />
                            {errors.legalName && <p className='text-red-600 text-sm'>{errors.legalName.message}</p>}
                        </div>
                    </div>
                    <div className="bottom-2 absolute w-full px-4">
                        <div className="">
                            <input
                                className="cursor-pointer placeholder:text-gray-500 w-4 h-5 text-theme coins_background rounded-lg focus:outline-none"
                                id="termsAndConditions"
                                type="checkbox"
                                {...register('termsAndConditions')}
                            />
                            <label htmlFor="termsAndConditions" className="ml-2 text-white text-justify text-sm">
                                By continuing, I confirm that I am authorized to act on behalf of the company and accept the E-sign disclosure and electronic communications consent.
                            </label>
                            {errors.termsAndConditions && <p className='text-red-600 text-sm'>{errors.termsAndConditions.message}</p>}
                        </div>
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
    );
};

const styles = {
    p0: "hidden xl:block text-md bold text-gray-100 hover:bg-gray-800 hover:text-white rounded-md  py-2 text-gray-100 tracking-wider placeholder:text-gray-500 border-1 rounded w-full p-2 coins_backgroun outline-none user-select-none focus:bg-transparent focus:outline-none",
    p1: 'bold tracking-wide pb-0.5',
    p2: 'flex flex-col pb-2.5'
};

export default SetProfileCorporate;
