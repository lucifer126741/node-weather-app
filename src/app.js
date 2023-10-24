const path=require('path')
const geocode=require("./utils/geocode")
const forecast=require('./utils/forecast')
const express=require('express')
const hbs=require('hbs')
const app=express()
const port=process.env.PORT || 3000

//Define paths for to Expree=ss config
const publicDirectoryPath=path.join(__dirname,'../public')
const viewPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

//Setup handle bars engine and views location
app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.get('',(req,res)=>{
    res.render('index',{
        title:"Weather",
        name:"Anurag Giddalur"
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title:"About me",
        name:"Anurag Giddalur"
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        helpText:"This is some helpful text!",
        title:"Help",
        name:"Anurag Giddalur"
    })
})
app.get("/weather",(req,res)=>{
    if(!req.query.address)
    {
        return res.send({
            error:"You must provide an address"
        })
    }
    geocode(req.query.address,(error,data)=>{
        if(error)
        {
            return res.send({error})
        }
        forecast(data.latitude,data.longitude,(error,forecastData)=>{
            if(error)
            {
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location:data.location,
                address:req.query.address
            })
        })
    })
})
app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})
app.get('/help/*',(req,res)=>{
    res.render('404-page',{
        err:"Help article not found",
        title:"404",
        name:"Anurag Giddalur"
    })
})
app.get('*',(req,res)=>{
    res.render('404-page',{
        err:"Page not found",
        title:"404",
        name:"Anurag Giddalur"
    })
})
app.listen(port,()=>{
    console.log("Server is up on port "+port)
})