import React from 'react'
import Dashboard from './dashboard'
import { staffTo } from '@/data/assign-to'
import { staff } from '@/data/assign-from'

type Props = {}

const Staff = (props: Props) => {
  return (
    <><Dashboard /><div className='mx-20 my-10'>Staff Page</div></>
  )
}

export default Staff