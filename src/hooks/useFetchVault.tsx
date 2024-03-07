import React, { useCallback, useEffect, useState } from 'react'
import { funcForDecrypt } from '@/components/helperFunctions';

export default function useFetchVault() {
    const [vaultError, setVaultError] = useState<string | null>(null);
    const [isLoadingVault, setIsLoadingVault] = useState<boolean>(false);
    const [vaultData, setVaultData] = useState([])

    const apiForWallet = useCallback(async () => {
        setIsLoadingVault(true);
        setVaultError(null)
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.baseUrl}/user/vault`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            const decryptedData = await funcForDecrypt(data.payload);
            // return JSON.parse(decryptedData).data;
            setVaultData(JSON.parse(decryptedData).data)
        } catch (error) {
            setVaultError('Error while fetching vault.')
        } finally {
            setIsLoadingVault(true);
        }
    }, [])
    useEffect(() => { apiForWallet() }, [apiForWallet]);

    return { vaultData, isLoadingVault, vaultError }
}
