const express = require('express')
const addressRouter = express.Router()
const db = require ('../services/service')
const userRole = require('../middleware/userRole')
const { Address, User } = db


addressRouter.get('/', async(req, res, next) =>{
    try{
        let allAddress = await Address.find({})
        if(!allAddress){
            res.status(404).json({message: {mesBody: 'No Items Found'}, mesError: true})
            next(error)
        }
        const addre = await Promise.all(
            allAddress.map(async(add) =>{
                const {_id, userId, address, city, country} = add
                let userAddress = await User.findById(add.userId)
                add = {
                    _id,
                    userId,
                    userFullName: userAddress.fullname,
                    address: address,
                    city: city,
                    country: country
                }
                return add
            })
        )
        res.status(201).json({ message: { addre: addre }, mesError: false });
    } catch(err){
        res.status(500).json({message:{mesBody: "Cannot Found Address"}, mesError: true})
        next(err)
    }
})


addressRouter.post('/create', async(req, res, next) => {
    const{userId, address, city, country} = req.body

    if(!address)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input Address!' } })
    if(!city)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input City!' } })
    if(!country)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input Country!' } })

    try{
        
        const user = await User.findOne({username: userId})
        const userAdd = await Address.findOne({userId: user._id})
        if(userAdd){return res.status(400).json({mesError: true, message:{ mesBody: 'Address already exists!'}})} 

        const newAddress = await new Address({
            userId: user._id,
            address: address,
            city: city,
            country: country
        })
        await newAddress.save()
        res.status(201).json({
            message: { mesBody: "Create New Address Successfully" },
            mesError: false,
        })
    } catch(error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true })
    next(error)
  }
})

addressRouter.param('addressId', async(req, res, next, addressId) => {
    try{
        let findAddress = await Address.findById(addressId)
        if(!findAddress){
            res.status(404).json({ message: { mesBody: "Address not found" }, mesError: true })
        }

        const {_id, userId, address, city, country} = findAddress
        req.address = {
            _id,
            userId,
            address,
            city,
            country
        }
        next()
    } catch (error) {
        res.status(500).json({ message: { mesBody: "Errors" }, mesError: true })
        next(error)
  }
})

addressRouter.put('/edit/:addressId', async(req, res, next) => {
    const{addressInput, countryInput, cityInput} = req.body

    if(!addressInput)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input Address!' } })
    if(!cityInput)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input City!' } })
    if(!countryInput)
        return res.status(400).json({mesError: true, message:{ mesBody: 'Please Input Country!' } })

    try{
        const {_id} = req.address
        let addressinDb = await Address.findByIdAndUpdate(_id, {
            address: addressInput,
            country: countryInput,
            city: cityInput,
        })
        await addressinDb.save()
        res.status(201).json({mesError: false, message:{ mesBody: 'Address Has been Updated!'} })
    } catch (error) {
        res.status(500).json({ message: { mesBody: "Errors" }, mesError: true })
        next(error)
  }
})

addressRouter.get('/details/:addressId', async (req, res, next) => {
    res.status(201).json({mesError: false, message:{ item: req.address }})
})

module.exports = addressRouter