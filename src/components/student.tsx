import React from 'react'
import Dashboard from './dashboard'
import { student } from '@/data/assign-from'

type Props = {}

const Student = (props: Props) => {
  return (
    <>
    <Dashboard />
    <div className='mx-20 my-10'>Student Page</div>
    </>
  )
}

export default Student