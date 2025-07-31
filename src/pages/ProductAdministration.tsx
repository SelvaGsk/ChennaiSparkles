// @ts-nocheck
import React from 'react'
import Shop from './Shop'
import { AddProductToShop, EditProduct } from '@/components/AdminProduct'

const ProductAdministration = () => {
  return (
    <>
     <div className="flex gap-3 items-center justify-center">

           <AddProductToShop/>
           <EditProduct/>
          </div>
    <Shop/>
    </>
  )
}

export default ProductAdministration