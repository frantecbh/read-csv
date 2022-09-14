import { Request, Response, Router } from "express";
import {Readable} from 'stream'
import readline from 'readline'

import multer from 'multer'
import { prismaClient } from "./database";


const multerConfig = multer()




const router = Router()

interface Product {
  code_bar: string;
  name: string;
  price: number;
  quantity: number;
}

router.post("/products", multerConfig.single("file"), async(request: Request, response: Response) =>{

  // console.log(request.file?.buffer.toString("utf-8"))
  const arquivo = request.file?.buffer
  const readableFile = new Readable()
  readableFile.push(arquivo)
  readableFile.push(null)

  const productLine = readline.createInterface({
    input: readableFile
  })

  console.log(productLine)

  const products: Product[] = []

for await(let line of productLine){
  const productItem = line.split(";")

  products.push({
    code_bar: productItem[0],
      name: productItem[1],
      price: Number(productItem[2]),
      quantity: Number(productItem[3]),
  })

}

for await(let{code_bar, name, price, quantity} of products){
   await prismaClient.products.create({
    data:{
      code_bar,
      name,
      price,
      quantity
    }
   })
}


return response.json(products)

})



export {router}