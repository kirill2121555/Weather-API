const Router=require('express')
const router=new Router()
const controller=require('./controller')

router.get('/weather', controller.getweather)

module.exports=router
