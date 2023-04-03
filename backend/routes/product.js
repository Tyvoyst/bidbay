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
<<<<<<< HEAD
            attributes: ['id','price','date'],
=======
            attributes: ['id','price','createdAt'],
            include: [
              { 
                model: User, 
                as: 'bidder',
                attributes: ['id','username'],
              }]
>>>>>>> backend/product-seller
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
  try{
    if(req.body.name != undefined){
      const product = Product.create(
        {
          name: req.body.name,
          description: req.body.description,
          pictureUrl: req.body.pictureUrl,
          category: req.body.category,
          originalPrice: req.body.originalPrice,
          startDate : req.body.startDate,
          endDate: req.body.endDate,
          sellerId: req.user.id
        }
      )
    }
    res.json(product)
    res.status(201).send()
  }catch(error){
    return res.status(400).json({ error })
  }
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
