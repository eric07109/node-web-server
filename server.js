const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let underMaint = true;

var app = express();

// set up partials directory
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
    console.log(`Getting the current year`);
    return new Date().getFullYear();
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

// const currentYear = new Date().getFullYear();
// currentYear variable can be replaced by getCurrentYear helper which is called reictly in the hbs file

myLogger = (req, res, next) => {
    console.log('LOGGED');
    next();
}

requestTime = (req, res, next) => {
    req.requestTime = new Date().toString();
    let log = `${req.requestTime}: ${req.method} ${req.url}`;

    console.log(log);
    
    fs.appendFile('server.log', log + '\n', err => {
        if(err){
            console.log(`Unable to append to server.log`);
        }
    });

    next();
}

directToMaintenance = (req, res, next) => {
    res.render('maintenance.hbs', {
        maintenanceMessage: 'Oops! The page is under maintenance rigth now. Come back soon!'
    })
}


app.use(express.static(__dirname + `/public`));

if(underMaint){
    app.use(directToMaintenance)
};

app.use(requestTime);

app.get('/', (req, res) => {
    // res.send(`<h1>Hello Express!</h1>`);
    // res.send(`Request time is ${req.requestTime}`);

    // res.send({
    //     name: 'Eric',
    //     likes: ['Eating','Pooping']
    // })

    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: `Welcome to the Home Page`
    })
});

app.get('/about', (req, res) => {
    // res.send(`About Page`);
    res.render('about.hbs', {
        pageTitle: 'About Page'
    })
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'This is crap!!'
    })
})

app.listen(3000, () => {
    console.log(`Server is up on port 3000`);
});