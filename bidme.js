Bids = new Meteor.Collection('bids');
Product = new Meteor.Collection('product');

if (Meteor.isClient) {

    Router.map(function() {
        this.route('home');
        this.route('contacts');
        this.route('realtimeadmin', {
            path: '/realtimeadmin'
        });
        this.route('productdet', {
            path: '/productdet'
        });
        this.route('home', {
            path: '/'
        });
        this.route('signup', {
            path: '/signup',
            template: 'signup',

            onBeforeAction: function() {
                // if (Meteor.loggingIn()) {
                //     this.redirect('bidnow');
                // };
            }
        });
        this.route('bidnow', {
            path: '/bidnow',
            template: 'bidnow'
        });
        this.route('logout', {
            path: '/logout',
            template: 'logout',

            onBeforeAction: function() {
                if (Meteor.user()) {
                    Meteor.logout(function() {
                        Session.set('user', null);
                    });
                }
                this.redirect('home');
            }
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
                    Session.set('user', null);
                } else {
                    toastr.info('login successfull');
                    Session.set('user', Meteor.userId());
                    // Meteor.Router.to('/bidnow');
                    Router.go('/bidnow');
                    // toastr.info('user id - '+Meteor.userId());
                }
            });
        }
    });

    //home
    Template.home.events({
        'submit .mozartsbit': function(e, t) {
            e.preventDefault();
            // mainbit
            if (Session.get('user') != null) {
                Router.go('/bidnow');
            } else {
                toastr.error("Must Login First");
            }
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
                        toastr.info('please login to start bidding');
                    }

                });
            } else {
                toastr.error('password mismatch');
            }
        }
    });

    //bidnow page Controllers
    ////Product Bit --------------!
    Template.productBit.events({
        'click .btnclass2': function(e, t) {
            e.preventDefault();
            console.log(Session.get('user'));

            if (Session.get('user') != null) {
                var start_bid = this.start_bid;
                var p_id = this._id;
                var bid = t.find('#' + this._id + '-bid').value;
                if (parseInt(start_bid) > parseInt(bid)) {
                    toastr.error("invalid Amount");
                } else {
                    // toastr.info(Session.get('user'));
                    var user = Session.get('user');
                    Bids.insert({
                        user: user,
                        product: p_id,
                        s_bid: start_bid,
                        bid: bid
                    });
                    // console.log(this._id);
                    // console.log(bid);

                    // Router.go('/productdet');
                    Product.update({
                        _id: this._id
                    }, {
                        $set: {
                            start_bid: bid
                        }
                    });
                }
                toastr.info('Bid Placed');
            } else {
                toastr.error("Must Login First");
            }

            //Product.find({name: {$gt: 100}}, {sort: {score: -1}});

        }
    });

    Template.productBit.helpers({
        product: function() {
            return Product.find();
        },
        remtimer: function(target, targetTime) {
            var now = new Date();
            var countTo = targetTime + now.valueOf();
            $('#' + target).countdown(countTo, function(event) {
                var $this = $(this);
                switch (event.type) {
                    case "seconds":
                    case "minutes":
                    case "hours":
                    case "days":
                    case "weeks":
                    case "daysLeft":
                        $this.find('span.' + event.type).html(event.value);
                        break;
                    case "finished":
                        $this.hide();
                        break;
                }
            });
        }
    });

    Template.bidnow.rendered = function() {
        var Wheight = $(document).height();
        var Wwidth = $(document).width();
        if (Wwidth < 1054) {
            document.getElementById('banner').style.height = Wheight - 136;
            document.getElementById('bannerwrapper').style.height = Wheight - 136;

            document.getElementById('main_container').style.height = Wheight - 136;
            document.getElementById('mainwrapper').style.height = Wheight - 136;
        } else if (Wwidth < 900) {
            document.getElementById('banner').style.height = Wheight - 136;
            document.getElementById('bannerwrapper').style.height = Wheight - 136;

            document.getElementById('main_container').style.height = Wheight - 136;
            document.getElementById('mainwrapper').style.height = Wheight - 136;
        } else {
            document.getElementById('banner').style.height = Wheight - 136;
            document.getElementById('bannerwrapper').style.height = Wheight - 136;

            document.getElementById('main_container').style.height = Wheight - 136;
            document.getElementById('mainwrapper').style.height = Wheight - 136;
        }
    };

    Template.realtimeadmin.rendered = function() {
        var Wheight = $(document).height();
        var Wwidth = $(document).width();
        if (Wwidth < 1054) {
            document.getElementById('banner').style.height = Wheight - 136;
            document.getElementById('bannerwrapper').style.height = Wheight - 136;

            document.getElementById('main_container').style.height = Wheight - 136;
            document.getElementById('mainwrapper').style.height = Wheight - 136;
        } else if (Wwidth < 900) {
            document.getElementById('banner').style.height = Wheight - 136;
            document.getElementById('bannerwrapper').style.height = Wheight - 136;

            document.getElementById('main_container').style.height = Wheight - 136;
            document.getElementById('mainwrapper').style.height = Wheight - 136;
        } else {
            document.getElementById('banner').style.height = Wheight - 136;
            document.getElementById('bannerwrapper').style.height = Wheight - 136;

            document.getElementById('main_container').style.height = Wheight - 136;
            document.getElementById('mainwrapper').style.height = Wheight - 136;
        }
    };

    //Product page Controllers
    Template.realtimeadmin.events({
        'submit form': function(e, t) {
            e.preventDefault();

            var name = t.find('#productName').value;
            var descrition = t.find('#productDis').value;
            var start_bid = t.find('#startingbid').value;

            var currentDate = new Date();

            var start_date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            var end_date = t.find('#date1').value;
            var url = t.find('#url').value;

            console.log('descrition ' + descrition);
            console.log('start_bid ' + start_bid);
            console.log('start_date ' + start_date);
            console.log('end_date ' + end_date);


            Product.insert({
                name: name,
                descrition: descrition,
                start_bid: start_bid,
                start_date: start_date,
                end_date: end_date,
                url: url
            });

            toastr.info('Product added');


        }
    });

    Template.realtimeadmin.helpers({
        product: function() {
            return Product.find();
        }
    });

}



if (Meteor.isServer) {
    Meteor.startup(function() {
        console.log('server');
        // Session.set('user', null);
    });
}
