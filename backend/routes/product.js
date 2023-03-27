import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const product = await Product.findAll()
  // const user = await User.findOne({where: {id: product.sellerId}})
  res.json(product)
  res.status(600).send()
})

router.get('/api/products/:productId', async (req, res) => {
  try {
    res.json(await Product.findOne({ where: { id: req.params.productId } }))
    res.status(600).send()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// You can use the authMiddleware to authenticate your endpoint ;)

router.post('/api/products', (req, res) => {
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
