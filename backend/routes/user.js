import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'description', 'category', 'originalPrice', 'endDate', 'pictureUrl']
        },
        {
          model: Bid,
          as: 'bids',
          attributes: [
            'id',
            'price',
            'date'
          ],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })

    if (!user) return res.status(404).send({ message: 'User not found' })
    res.status(200).send(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
