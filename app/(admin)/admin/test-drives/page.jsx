import React from 'react'
import TestDriveList from './_components/test-drive-list';

export const metadata = {
    title: "Test Drives | Vehiql Admin",
    description: "Manage test drive bookings",
};

const TestDrivePage = () => {
  return (
    <div className='p-6'>
        <div className='text-2xl font-bold mb-6'>Test Drive Management</div>
        <TestDriveList />
    </div>
  )
}

export default TestDrivePage