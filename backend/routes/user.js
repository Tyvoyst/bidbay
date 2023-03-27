import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  try {
    res.json(await User.findOne({ where: { id: req.params.userId } }))
    res.status(600).send()
  } catch (error) {
    return res.status(400).json({ error })
  }
})

export default router
