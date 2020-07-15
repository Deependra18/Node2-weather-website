const express=require('express');
const path=require('path');
const hbs=require('hbs');
const geocode=require('./utils/geocode');
const forecast=require('./utils/forecast');

const app=express();
//define a path for express config.
const dirpath=path.join(__dirname,'../public');
const viewspath=path.join(__dirname,'../template/views');
const partialpath=path.join(__dirname,'../template/partials')
//setup the handlebar engine and views location
app.set('view engine','hbs');
app.set('views',viewspath)
hbs.registerPartials(partialpath);
//setup static directory to serve
app.use(express.static(dirpath));
app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather',
        name:'Deependra Kumar',
    });
});

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText:'this is a some Helpful Text',
        title:'Help',
        name:'Deependra Kumar',
    });
});

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Deependra Kumar',
    });
});



app.get('/weather',(req,res)=>{

    if(!req.query.address)
    {
       return res.send({
            error:"please provide the address!",
        })
    }
    const address=req.query.address;
    geocode(address,(error,{longitude,latitude,location}={})=>{
        if(error)
        {
            return res.send({
                error,
            });
        }
    
        forecast(longitude,latitude,(error,forecastdata)=>{
            if(error)
            {
                return res.send({
                    error,
                });
            }
           res.send(
            {
                forecast:forecastdata,
                location,
                address,


            });
            
        })
    });
});



app.get('/product',(req,res)=>{
    // console.log(req.query);
    if(!req.query.search)
    {
        return res.send({
            error:'Please enter any search title',
        })
    }
    res.send(
        {
           product:[], 
        }
    )
})
app.get('/help/*',(req,res)=>{
    res.render('404',{
      title:'404',
      name:'Deependra Kumar',
      errorMsg:'Help page Not found',
    })
})



app.get('*',(req,res)=>{
      res.render('404',{
          title:'404',
          name:'Deependra Kumar',
          errorMsg:'Page Not Found',
      })
})

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

