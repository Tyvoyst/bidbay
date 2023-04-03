import authMiddleware from '../middlewares/auth.js'
import { Bid, Product, User} from '../orm/index.js'
import express from 'express'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  const bid = await Bid.findOne({ 
    where: { id: req.params.bidId },
  })
  if(!bid){
    return res.status(404).send({ message: "Bid not found" })
  }else{
    if(bid.bidderId !== await req.user.id && !req.user.admin){
      return res.status(403).send({ error : "User not granted"})
    }else{
      try{
        Bid.destroy({ where: { id: bid.id } })
        res.status(204).send()
      }catch(error){
        return res.status(401).json({ error :"Unauthorized"})
      }
    }
  }
})

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  req.body.productId = req.params.productId
  req.body.bidderId = req.user.id
  req.body.date = new Date()
  const product = await Product.findOne({ 
    where: { id: req.params.productId },
  })
  if(!product){
    return res.status(404).send({ message: "Product not found" })
  }else{
    if(req.body.price == undefined){
      return res.status(400).send({ error: "Invalid or missing fields", details : "getDetails(req.body)" })
    }else{
      try{
        res.status(201).send(await Bid.create(req.body))
      }catch(error){
        return res.status(401).json({ error :"Unauthorized", details: error },)
      }
    }
  }
})

export default router
