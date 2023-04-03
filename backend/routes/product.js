import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'
import { BaseError } from 'sequelize'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll({ 
    include: [
      { 
        model: User, 
        as: 'seller',
        attributes: ['id','username']
      },
      {
        model: Bid,
        as: 'bids',
        attributes: ['id','price','date'],
      }
  ]
  })
  res.json(products)
  res.status(600).send()
})

router.get('/api/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      where: { id: req.params.productId }, 
      include: [
        { 
          model: User, 
          as: 'seller',
          attributes: ['id','username'],
          //where: { id: req.params.sellerId }
        },
          {
            model: Bid,
            as: 'bids',
            attributes: ['id','price','createdAt'],
            include: [
              { 
                model: User, 
                as: 'bidder',
                attributes: ['id','username'],
              }]
          }
      ]
    })
    if(!product) return res.status(404).send({ message: "Product not found" })
    res.json(product)
    res.status(200).send()
  } catch (error) {
    return res.status(400).json({ error :"Invalid or missing products", details: error })
  }
  return res.status(600).send()
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req, res) => {
  try{
    req.body.sellerId = req.user.id
    res.status(201).send(await Product.create(req.body))
  }catch(error){
    return res.status(400).json({ error :"Invalid or missing fields", details: error },)
  }
  return res.status(600).send()
})

router.put('/api/products/:productId', authMiddleware, async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.productId },
    include: [
      {
        model: User,
        as: 'seller',
        attributes: ['id','username']
      }
    ]
  })
  try{
    if(!product){
      return res.status(404).send({ message: "Product not found" })
    }else{
      if(product.seller.id !== req.user.id && !req.user.admin){
        return res.status(403).send({ error : "User not granted"})
      }else{
        await Product.update(req.body, { where: { id: req.params.productId } })
        res.status(200).send(await Product.findOne({ where: { id: req.params.productId } }))
      }
    }
  }catch(error){
    return res.status(401).json({ error :"Unauthorized", details: error })
  }
})

router.delete('/api/products/:productId', authMiddleware, async (req, res) => {
  const product = await Product.findOne({ 
    where: { id: req.params.productId },
    include: [
      {
        model: User,
        as: 'seller',
        attributes: ['id','username']
      }
    ]
  })
  if(!product){
    return res.status(404).send({ message: "Product not found" })
  }else{
    if(product.seller.id !== req.user.id && !req.user.admin){
      return res.status(403).send({ error : "User not granted"})
    }else{
      try{
        Product.destroy({ where: { id: product.id } })
        res.status(204).send()
      }catch(error){
        return res.status(401).json({ error :"Unauthorized", details: error })
      }
      res.status(600).send()
    }
  }
})

export default router
