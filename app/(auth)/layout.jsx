"use client";

import React, { useEffect } from 'react'

const AuthLayout = ({children}) => {

  useEffect(() => {
    // Scroll to the very top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='flex justify-center items-center pt-40'>
      {children}
    </div>
  )
}

export default AuthLayout