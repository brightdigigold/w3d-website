'use client'
import LoginAside from '@/components/authSection/loginAside';
import React, { useState } from 'react'

const page = () => {
  const [openLoginAside, setOpenLoginAside] = useState(false);

  return (
    <div>{openLoginAside && (
      <LoginAside
        isOpen={openLoginAside}
        onClose={() => setOpenLoginAside(false)}
        purpose=''
      />
    )}</div>
  )
}

export default page