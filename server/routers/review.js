const express = require('express')
const reviewRouter = express.Router()
const db = require ('../services/service')
const userRole = require('../middleware/userRole')
const { Item, Trademark, Review, User } = db
const passport = require("passport")

reviewRouter.use(passport.authenticate("jwt", { session: false })) 

reviewRouter.get('/', async(req, res, next) =>{
    try {
        let allReviews = await Review.find({})
        if(!allReviews){
            res.status(404).json({message: {mesBody: 'No Reviews Found'}, mesError: true})
            next(error)
        }

    const reivews = await Promise.all(
        allReviews.map(async(rev) => {
            const{_id, userId, itemId, comment, rating} = rev

            let userComment = await User.findById(rev.userId)
            let itemComment = await Item.findById(rev.itemId)
            rev = {_id, userId, userFullName: userComment.fullname, itemId, nameItem: itemComment.name, comment: comment, rating: rating}
            return rev
        })
    )
    res.status(200).json({ message: { reivews: reivews }, mesError: false });
    } catch(err){
        res.status(500).json({message:{mesBody: "Cannot Found Item"}, mesError: true})
        next(err)
    }
})

reviewRouter.post('/create', async(req, res, next) => {
    const{ itemReviewId, reviewComment} = req.body

    if(!itemReviewId)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Not Found Item' }})
    if(!reviewComment)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input Comment' }})

    try{
        const itemCommentId = await Item.findById(itemReviewId)

        const newReview = await new Review({
            userId: req.user._id,
            itemId: itemCommentId,
            comment: reviewComment
        })
        await newReview.save()
        res.status(200).json({
            message: { mesBody: "Post Comments successfully" },
            mesError: false,
        })
    } catch(error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
})

reviewRouter.param('reviewId', async(req, res, next, reviewId) => {
    try{
        let findReview = await Review.findById(reviewId)
        if (!findReview){
            res.status(404).json({ message: { mesBody: "Review not found" }, mesError: true })
        }
        const {_id, userId, itemId, comment,rating} = findReview
        const items = await Item.findById(itemId)
        req.reivew = {
            _id,
            items: items,
            userId,
            comment: comment,
            rating: rating
        }
        next()
    } catch (error) {
        res.status(500).json({ message: { mesBody: "Errors" }, mesError: true })
        next(error)
    }
})


reviewRouter.put('/edit/:reviewId', async(req, res, next) => {
    const {newComment} = req.body
    try{
        let userWithComment = await Review.findOne({userId: req.user._id})
        const{_id} = userWithComment
        let userCommentInDb = await Review.findByIdAndUpdate(_id, {
            comment: newComment
        })

        await userCommentInDb.save
        res.status(201).json({mesError: false, message:{ mesBody: 'Comment Has Been Updated!' } })
    } catch(error) {
        res.status(500).json({ message: { mesBody: "Errors" }, mesError: true })
        next(error)
  }
})

reviewRouter.delete('/delete/:reviewId', async(req, res, next) => {
    try{
        let userWithComment = await Review.findOne({userId: req.user._id})
        const{_id} = userWithComment
        await Review.findByIdAndDelete(_id)
        res.status(201).json({mesError: false, message:{ mesBody: 'Comment Has Been Removed!' } })
    } catch(error) {
        res.status(500).json({ message: { mesBody: "Errors" }, mesError: true })
        next(error)
  }
})

module.exports = reviewRouter