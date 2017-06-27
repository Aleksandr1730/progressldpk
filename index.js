'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let pug = require('pug');
let config = require('./config.json');
let mongoose = require('./mongoose.js');
let bodyParser = require('body-parser');
let app = express();
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
app.set('port', (process.env.PORT || 5000));

app.use(session({
    secret: 'loft',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.set('view engine', 'pug');
app.set('views', path.resolve(`./${config.http.publicRoot}/pages`));
app.set('view options', { pretty: true });
app.locals.pretty = true;

app.use(express.static(path.resolve(config.http.publicRoot)));
app.use(bodyParser.json());

//===marsh===
app.use('/admin', require('./middleware.js'));
app.use('/admin', require('./blog.js'));
app.use('/admin', require('./work.js'));
app.use('/mail', require('./mail.js'));
app.use('/auth', require('./auth.js'));
app.use('/shop', require('./section.js'));
app.use('/shops', require('./product.js'));
app.use('/shops', require('./ordering.js'));
app.use('/adminBlog', require('./adminBlog.js'));
app.use('/adminOrdering', require('./adminOrdering.js'));
app.use('/adminWorks', require('./adminWorks.js'));
app.use('/adminSection', require('./adminSection.js'));
app.use('/adminProduct', require('./adminProduct.js'));

app.get(['/', '/index.html', '/index'], function (req, res) { //index
    res.render('index');
});
app.get(['/about.html', '/about'], function (req, res) { //about
    res.render('about', {
        title: 'Hey', message: 'Hello there!'
    });
});
app.get(['/blog.html', '/blog'], function (req, res) { //blog
    require('./BlogSchema.js');
    let Model = mongoose.model('blog');
    Model.find({}).then(function(blog) {
        var blog = blog;
        const query = req.query;
        var page = Math.ceil(blog.length / 4);
            
        if (query.page == undefined || query.page < 0 || query.page > page) {
            query.page = 1;
        }

        var querySection = query.section;
        var queryCategory = query.category;
        var pageActiveEnd = query.page * 4;
        var pageActiveStart = pageActiveEnd - 4;
        if (pageActiveEnd > blog.length) pageActiveEnd = blog.length;
        var prodActive = [];
        for (var i = pageActiveStart; i < pageActiveEnd; i++) {
            prodActive[i] = blog[i];
        }
        
        Array.prototype.clean = function(deleteValue){
            for (var i = 0; i < this.length; i++){
                if (this[i] == deleteValue){
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        };
        
        prodActive.clean(undefined);
        
        res.render('blog', {items: prodActive, page: page, queryPage: query.page});
    });
});
app.get(['/works.html', '/works'], function (req, res) { //works
    require('./WorkSchema.js');
    let Model = mongoose.model('work');
    Model.find({}).then(function(work) {
        res.render('works', {items: work});
    });
});
app.get(['/cart.html', '/cart'], function (req, res) { //cart
    res.render('cart');
});
app.get(['/ordering.html', '/ordering'], function (req, res) { //ordering
    res.render('ordering');
});
function returnsection(section){
    var section = section;
    var sect = [];
    for(var i = 0; i < section.length; i++) {
        sect[i] = section[i].name; 
    };
    sect = Array.from(new Set(sect));

    var sec = new Array(sect.length);
    for(var i = 0; i < sect.length; i++) sec[i] = new Array(4);
    for(var i = 0; i < sec.length; i++) {
        for(var j = 0; j < sec[i].length; j++) {
            sec[i][j] = new Array();
        }
    }
    for(var i = 0; i < sec.length; i++) sec[i][0][0] = sect[i];

    Array.prototype.clean = function(deleteValue){
        for (var i = 0; i < this.length; i++)
        {
            if (this[i] == deleteValue)
            {         
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };

    for(var i = 0; i < sec.length; i++) {
        for(var k = 0; k < section.length; k++) {
            if (sec[i][0] == section[k].name) {
                sec[i][1][k] = section[k].category;
                sec[i][2][k] = section[k].id; 
            };
        };
        sec[i][1].clean(undefined);
        sec[i][2].clean(undefined);
    };

    for(var i = 0; i < sec.length; i++) {
            sec[i][3] = new Array(sec[i][1].length);
    }

    for(var i = 0; i < sec.length; i++) {
        for(var j = 0; j < sec[i][1].length; j++) {
            for(var k = 0; k < section.length; k++) {
                if (sec[i][1][j] == section[k].category) {
                    sec[i][3][j] = section[k].data; 
                };
            };
        };
    };
    
    return sec;
};
app.get(['/shop.html', '/shop'], function (req, res) { //shop
    let Model = mongoose.model('section');
    let Model2 = mongoose.model('product');
    Model.find({}).then(function(section) {
        Model2.find({}).then(function(product) {
            var sec = returnsection(section);
            var product = product;
            const query = req.query;
            var prod = [];
            
            Array.prototype.clean = function(deleteValue){
                for (var i = 0; i < this.length; i++)
                {
                    if (this[i] == deleteValue)
                    {         
                        this.splice(i, 1);
                        i--;
                    }
                }
                return this;
            };

            for (var i = 0; i < product.length; i++) {
                if (query.category == product[i].category) {
                    prod[i] = product[i];
                }
            }
            
            if (query.category == undefined) {
                prod = product;
            }
            prod.clean(undefined);
            
            var page = Math.ceil(prod.length / 6);
            
            if (query.page == undefined || query.page < 0 || query.page > page) {
                query.page = 1;
            }
            
            //var queryPage = Number(query.page.replace(/\D+/g,""));
            var querySection = query.section;
            var queryCategory = query.category;
            var pageActiveEnd = query.page * 6;
            var pageActiveStart = pageActiveEnd - 6;
            if (pageActiveEnd > prod.length) pageActiveEnd = prod.length;
            var prodActive = [];
            for (var i = pageActiveStart; i < pageActiveEnd; i++) {
                prodActive[i] = prod[i];
            }
            
            prodActive.clean(undefined);
            
            res.render('shop', {section: sec, product: prodActive, page: page, querySection: querySection, queryCategory: queryCategory, queryPage: query.page});
        });
    });
});
app.get(['/admin.html', '/admin'], function (req, res) { //admin
    if (!req.session.isAdmin) {
		res.redirect('/');
    } else {
        let Model = mongoose.model('section');
        let Model2 = mongoose.model('ordering');
        let Model3 = mongoose.model('blog');
        let Model4 = mongoose.model('work');
        let Model5 = mongoose.model('product');
        /*var promise = new Promise(function(resolve, reject) {
            Model.find({}).then(function(section) {
                resolve(section);
            });
        });
        promise.then(function(val, val2) {
            Model2.find({}).then(function(ordering) {
                val2(ordering);
            });
        }).then(function(val, val2) {
            console.log(val);
            console.log("---");
            console.log(val2);
        });*/
        
        section();
        function section(){
            Model.find({}).then(function(section) {
                var sec = returnsection(section);
                ordering(sec, section);
            });
        };
        function ordering(section, sectionn){
            Model2.find({}).then(function(ordering) {
                var unsorted = [];
                var ready = [];
                var defer = [];
                for (var i = 0; i < ordering.length; i++) {
                    if (ordering[i].archive == "Unsorted") unsorted.push(ordering[i]);
                    if (ordering[i].archive == "Ready") ready.push(ordering[i]);
                    if (ordering[i].archive == "Defer") defer.push(ordering[i]);
                }
                blog(section, sectionn, ordering, unsorted, ready, defer);
            });
        };
        function blog(section, sectionn, ordering, unsorted, ready, defer) {
            Model3.find({}).then(function(blog) {
                work(section, sectionn, ordering, blog, unsorted, ready, defer);
            });
        };
        function work(section, sectionn, ordering, blog, unsorted, ready, defer) {
            Model4.find({}).then(function(work) {
                product(section, sectionn, ordering, blog, work, unsorted, ready, defer);
            });
        };
        function product(section, sectionn, ordering, blog, work, unsorted, ready, defer) {
            Model5.find({}).then(function(product) {
                resolve(section, sectionn, ordering, blog, work, product, unsorted, ready, defer);
            });
        };
        function resolve(section, sectionn, ordering, blog, work, product, unsorted, ready, defer){
            var a = section;
            var b = ordering;
            var c = blog;
            var d = work;
            var f = product;
            var g = sectionn;
            var unsorted = unsorted;
            var ready = ready;
            var defer = defer;
            res.render('admin', {section: a, ordering: b, blog: c, works: d, sectionn: g, product: f, unsorted: unsorted, ready: ready, defer: defer});
        };
        
        /*Model.find({}).then(function(section) {
        Model2.find({}).then(function(ordering) {
        Model3.find({}).then(function(blog) {
            var sec = returnsection(section);
            var ordering = ordering;
            var blog = blog;
            console.log(sec);
            console.log("---");
            console.log(ordering);
            console.log("---");
            console.log(blog);
            res.render('admin', {section: sec, ordering: ordering, blog: blog});
        });
        });
        });*/
    }
});
//======

app.use((req, res, next) => res.status(404).send('Не удалось найти страницу!'));

app.use((err, req, res, next) => {
    res.status(500);
    res.render('error', {
        error: err.message
    });
    console.error(err.message, err.stack);
});

app.listen(app.get('port'), () => {
    let uploadDir = path.resolve(config.http.publicRoot, 'upload');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    console.log(`Server is up !`);
});
