const adminModel = require("../models/adminModel")
const { responseReturn } = require("../utilities/response")
const bcrypt = require('bcrypt')
const { createToken } = require("../utilities/tokenCreate")

class authControllers {
    admin_login = async(req, res) => {
        // console.log(req.body)  
        const {email, password} = req.body
        try {
            const admin = await adminModel.findOne({email}).select('+password')
            console.log(admin)
            if (admin) {
                console.log("Password Match")
                console.log(`1st password ${password}`)
                console.log(`2nd password ${admin.password}`)
                console.log(`Name ${admin.name}`)
                console.log(`Id ${admin.id}`)
                const match = await bcrypt.compare(password, admin.password)
                console.log("IS Password Match: "+match)
                if (match) {
                    //make data for token
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    })
                    //set cookies
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7*24*60*60*1000)
                    })
                    responseReturn(res,200,{token, message: "Login Success"})
                } else {
                    responseReturn(res,404,{error: "Invalid Password"})
                }

            } else {
                responseReturn(res,404,{error: "Email Not Found"})
            }
            
        } catch (error) {
            responseReturn(res,500,{error: error.message})
        }
    }//EO admin_login method

    getUser = async (req, res) => {
        const {id, role} = req

        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id)
                responseReturn(res,200,{userInfo: user})
            } else {
                console.log('Seller Info Page')
            }
        } catch (error) {
            console.log(error.message)
        }
    }//EO get_user method
}     

module.exports = new authControllers()