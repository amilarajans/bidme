Bids = new Meteor.Collection('bids');
Product = new Meteor.Collection('product');

if (Meteor.isClient) {

    Router.map(function() {
        this.route('home');
        this.route('bidnow');
        this.route('signup');
        this.route('contacts');
        this.route('signup', {
            path: '/'
        });
    });

    toastr.options = {
        "closeButton": false,
        "debug": true,
        "positionClass": "toast-bottom-left",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    Template.login.events({
        'submit .form-signing': function(e, t) {
            e.preventDefault();
            // console.log('username - ' + t.find('#loginForm #username').value);
            // console.log('password - ' + t.find('#loginForm #password').value);
            var username = t.find('#loginForm #username').value;
            var password = t.find('#loginForm #password').value;
            Meteor.loginWithPassword(username, password, function(err) {
                if (err) {
                    toastr.error('login failed');
                } else {
                    toastr.info('login successfull');
                }
            });
        }
    });

    Template.signupForm.events({
        'submit .form-signing': function(e, t) {
            e.preventDefault();
            // console.log('username - ' + t.find('#signupForm #username').value);
            // console.log('password - ' + t.find('#signupForm #password').value);
            // console.log('name - ' + t.find('#signupForm #name').value);
            // console.log('email - ' + t.find('#signupForm #email').value);
            // console.log('mobile - ' + t.find('#signupForm #mobile').value);
            var username = t.find('#signupForm #username').value;
            var password = t.find('#signupForm #password').value;
            var repassword = t.find('#signupForm #re-password').value;
            var name = t.find('#signupForm #name').value;
            var email = t.find('#signupForm #email').value;
            var mobile = t.find('#signupForm #mobile').value;
            if (password === repassword) {
                Accounts.createUser({
                    username: username,
                    password: password,
                    profile: {
                        name: name,
                        email: email,
                        mobile: mobile
                    }
                }, function(err) {
                    if (err) {
                        toastr.error('account creation failed');
                    } else {
                        toastr.info('account created');
                    }

                });
            } else {
                toastr.error('password mismatch');
            }
        }
    });

    //Product page Controllers
    Template.product.events({
        'submit .form-signing': function(e, t) {

            var name = t.find('#name').value;
            var descrition = t.find('#desc').value;
            var start_bid = t.find('#st_bid').value;

            var currentDate = new Date();

            var start_date = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
            var end_date = t.find('#end_date').value;

            // console.log('descrition '+descrition);
            // console.log('start_bid '+start_bid);
            // console.log('start_date '+start_date);
            // console.log('end_date '+end_date);

            /*      
            Product.insert({
                name:name,
                descrition:descrition,
                start_bid:start_bid,
                start_date:start_date,
                end_date:end_date
            });
    */

        }
    });

    Template.product.helpers({
        product: function() {
            return Product.find();
        }
    });

    ////Product Bit --------------!
    Template.productBit.events({
        'click .btnBit': function(e, t) {
            console.log(this);
            //var prd_name = t.find("#prdName").value;
            var start_bid = this.start_bid;
            var p_id = this._id;
            var bid = t.find('.prdName').value;
            if (parseInt(start_bid) > parseInt(bid)) {
                alert("invalid Amount");
            } else {
                var user = "5h6pENksNNQMYGsAC";
                Bids.insert({
                    user: user,
                    product: p_id,
                    s_bid: start_bid,
                    bid: bid
                });
            }

            //Product.find({name: {$gt: 100}}, {sort: {score: -1}});

        }
    });

    Template.productBit.helpers({
        product: function() {
            return Product.find();
        }
    });
}



if (Meteor.isServer) {
    Meteor.startup(function() {
        console.log('server');
    });
}
