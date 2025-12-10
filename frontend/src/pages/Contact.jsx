import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>IND</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className=' text-gray-500'>603203 ktr <br /> SRM University, potheri, Chennai</p>
          <p className=' text-gray-500'>Ph: +91-9019916906<br /> Email: manoharreddyind@gmail.com</p>
          <p className=' font-semibold text-lg text-gray-600'></p>
          <p className=' text-gray-500'></p>
          {/* <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'></button> */}

      
        </div>
      </div>

    </div>
  )
}

export default Contact
