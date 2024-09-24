'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import RedirectTimer from '@/components/redirectTimer';
import { fetchTransactionData } from '@/api/DashboardServices';

interface PageProps {
  params: { id: string };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchData = async () => {
      if (!token) {
        if (isMounted) {
          setError('No token found');
          setLoading(false);
        }
        return;
      }

      try {
        const transactionData = await fetchTransactionData(params.id, token);
        if (isMounted) {
          setData(transactionData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err);
          setError('Error fetching transaction data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Clean up on component unmount
    };
  }, [params.id, token]);

  const handlePopState = () => {
    // console.log('Back button pressed');
    // Handle back navigation here, if necessary
  };

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const transactionStatus = data?.data?.transactionStatus || 'UNKNOWN';
  const orderId = data?.data?.order_id || {};
  const itemType = orderId.itemType || 'UNKNOWN';

  return (
    <div className="px-4">
      <div className="min-h-screen flex items-center justify-center">
        <Image
          className="absolute -bottom-12 -left-20 opacity-30"
          src="https://brightdigigold.s3.ap-south-1.amazonaws.com/bdgwhite5.webp"
          alt="Bright Digi Gold"
          width={500}
          height={500}
        />
        <div className="w-[580px] z-[20]">
          <div className="coins_background shadow-md rounded-md mb-100 text-center text-white py-12 relative">
            <div className="flex justify-center">
              {transactionStatus === 'SUCCESS' ? (
                <img
                  src="https://brightdigigold.s3.ap-south-1.amazonaws.com/Successfully+Done.gif"
                  className="absolute h-36 -top-16"
                />
              ) : (
                <img
                  src="https://brightdigigold.s3.ap-south-1.amazonaws.com/oops.gif"
                  className="absolute h-36 -top-16"
                />
              )}
            </div>
            {orderId.orderType === 'BUY' && itemType === 'GOLD' && (
              <p className="text-2xl italic pt-16">
                24k <span className="text-gold01">Gold</span> Purchase
                <br />
                <span className="text-3xl">{data?.data?.transactionData?.payment_status}</span>
              </p>
            )}
            {orderId.orderType === 'BUY' && itemType === 'SILVER' && (
              <p className="text-2xl italic pt-16">
                99.99% <span className="text-gold01">Silver</span> Purchase
                <br />
                <span className="text-3xl">{data?.data?.transactionData?.payment_status}</span>
              </p>
            )}
            {orderId.orderType === 'PRODUCT' && itemType === 'GOLD' && (
              <p className="text-2xl italic pt-16">
                24k <span className="text-gold01">Gold Coin</span> Purchase
                <br />
                <span className="text-3xl">{data?.data?.transactionData?.payment_status}</span>
              </p>
            )}
            {orderId.orderType === 'PRODUCT' && itemType === 'SILVER' && (
              <p className="text-2xl italic pt-16">
                99.99% <span className="text-gold01">Silver Coin</span> Purchase
                <br />
                <span className="text-3xl">{data?.data?.transactionData?.payment_status}</span>
              </p>
            )}
            {orderId.orderType === 'CART' && (
              <p className="text-2xl italic pt-16">
                Cart Purchase
                <br />
                <span className="text-3xl">{data?.data?.transactionData?.payment_status}</span>
              </p>
            )}
            <div
              className={`p-4 mx-6 ${
                transactionStatus === 'SUCCESS'
                  ? 'bg-green-500'
                  : transactionStatus === 'FAILED'
                  ? 'bg-red-500'
                  : transactionStatus === 'PENDING'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              } rounded-bl-md rounded-br-md`}
            >
              {transactionStatus === 'SUCCESS' && (
                <Link target="_blank" href={`${data?.data?.order_id?.invoiceUrl}`}>
                  <button className="rounded-full px-4 py-2 text-white flex items-center bg-theme text-sm mx-auto">
                    Download Invoice
                    <ArrowDownIcon className="text-gold01 h-4 gap-2" />
                  </button>
                </Link>
              )}
              <RedirectTimer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
