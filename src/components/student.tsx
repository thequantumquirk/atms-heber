import React from 'react'
import Dashboard from './dashboard'
import { student } from '@/data/assign-from'

type Props = {}

const Student = (props: Props) => {
  return (
    <>
    <Dashboard />
    <div className='px-20'>
      <div className="flex justify-between items-center mt-9">
            <h1 className="text-3xl font-medium">Your Tasks</h1>
      </div>
    </div>
    </>
  )
}

export default Student