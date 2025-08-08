"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const CarList = () => {

    const router = useRouter();
    const [search, setSearch] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
                <Button className="flex items-center" onClick={() => router.push('/admin/cars/create')}>
                    <Plus className='h-4 w-4' /> Add Car
                </Button>

                <form onSubmit={handleSearchSubmit} className='flex w-full sm:w-auto'>
                    <div className='relative flex-1'>
                        <Search className='h-4 w-4 absolute left-2.5 top-2.5 text-gray-500' />
                        <Input className="pl-9 w-full sm:w-60"
                            placeholder='Search cars...'
                            type="search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CarList