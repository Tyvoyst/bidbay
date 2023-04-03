import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll({ 
    include: [
      { 
        model: User, 
        as: 'seller',
        attributes: ['id','username']
      }
    ],
    include: [
      {
        model: Bid,
        as: 'bids',
        attributes: ['id','price','createdAt'],
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
        }],
        include: [
          {
            model: Bid,
            as: 'bids',
            attributes: ['id','price','createdAt'],
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

router.post('/api/products', authMiddleware, (req, res) => {
  Product.create(
    {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      originalPrice: req.body.originalPrice,
      pictureUrl: req.body.pictureUrl,
      startDate : req.body.startDate,
      endDate: req.user.endDate,

    }
  )
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
