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
    res.json(product)
    res.status(600).send()
  } catch (error) {
    return res.status(400).json({ error })
  }
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

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  if(!req.params.productId) return res.status(404).send({ message: "Product not found" })
  try{
    Product.destroy({ where: { id: req.params.productId } })
    res.status(204).send({ message: "Product deleted"})
  }catch(error){
    return res.status(400).json({ error })
  }
  res.status(600).send()
})

export default router
