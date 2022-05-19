const db = require ('../services/service')
const User = db.User

const objMiddlewareCustom = {
  isAdmin: async (req, res, next) => {
    try {
      const { _id } = req.user
      let foundAccount = await User.findById(_id)
      if (foundAccount.role !== process.env.ADMIN) {
        res.status(403).json({
          message: "Your dont have permission to access this page",
          mesErorr: true
        })
        return
      }
      next()
    } catch (error) {
      next(error)
    }
  },
  isCustomer: async (req, res, next) => {
    try {
      const { _id } = req.user
      let foundAccount = await User.findById(_id)
      if (foundAccount.role !== process.env.CUSTOMER) {
        res.status(403).json({
          message: "Your dont have permission to access this page",
          mesErorr: true
        })
        return
      }
      next()
    } catch (error) {
      next(error)
    }
  },
  isManager: async (req, res, next) => {
    try {
      const { _id } = req.user
      let foundAccount = await User.findById(_id)
      if (foundAccount.role !== process.env.MANAGER) {
        res.status(403).json({
          message: "Your dont have permission to access this page",
          mesErorr: true
        })
        return
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = objMiddlewareCustom;