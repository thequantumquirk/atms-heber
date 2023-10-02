import React from 'react'
import { HodTo } from '@/data/assign-to'
import { Hod } from '@/data/assign-from'
import Dashboard from './dashboard'

type Props = {}

const HOD = (props: Props) => {
  return (
    <div>
        <Dashboard/>
        <div className='mx-20 my-10'>Hod Page</div>
    </div>
  )
}

export default HOD