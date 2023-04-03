import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  try {
    res.json(await User.findOne({ 
      where: { id: req.params.userId },
      include: [
        { 
          model: Product, 
          as: 'products',
          attributes: ['id','name','description',"category",'originalPrice','endDate',"pictureUrl"],
        },
        {
          model: Bid,
          as: 'bids',
          attributes: [
            'id',
            'price',
            'createdAt',
          ],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id','name'],
            }
          ]
        }
    ]
    }))
    res.status(600).send()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
