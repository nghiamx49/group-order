const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema ({
    name: String
},
  {
    timestamps: true,
  })

module.exports = mongoose.model('Roles', RoleSchema)
