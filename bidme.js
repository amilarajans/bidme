Logininfo = new Meteor.Collection('logininfo');

if (Meteor.isClient) {

    Template.login.events({
        'submit .form-signin': function(e, t) {
            // events.preventDefault();
            console.log('username - ' + t.find('#loginForm #username').value);
            console.log('password - ' + t.find('#loginForm #password').value);
            alert('login');
            // Logininfo.insert({
            //     username: t.find('#username').value,
            //     password: t.find('#password').value
            // });
            var username = t.find('#loginForm #username').value;
            var password = t.find('#loginForm #password').value;
            Meteor.loginWithPassword(username, password, function(err) {
                if (err)
                    alert('failed');
                else
                    alert('logged');
            });
        }
    });

    Template.signup.events({
        'submit .form-signin': function(e, t) {
            // events.preventDefault();
            console.log('username - ' + t.find('#signupForm #username').value);
            console.log('password - ' + t.find('#signupForm #password').value);
            console.log('name - ' + t.find('#signupForm #name').value);
            console.log('email - ' + t.find('#signupForm #email').value);
            console.log('mobile - ' + t.find('#signupForm #mobile').value);
            alert('signup');
            var username = t.find('#signupForm #username').value;
            var password = t.find('#signupForm #password').value;
            var name = t.find('#signupForm #name').value;
            var email = t.find('#signupForm #email').value;
            var mobile = t.find('#signupForm #mobile').value;
            Accounts.createUser({
                username: username,
                password: password,
                profile: {
                    name: name,
                    email:email,
                    mobile:mobile
                }
            }, function(err) {
                if (err) {
                    alert('account creation failed');
                } else {
                    alert('account created');
                }

            });
        }
    });

    Meteor.autorun(function() {
        // Whenever this session variable changes, run this function.
        var message = Session.get('displayMessage');
        if (message) {
            var stringArray = message.split('&amp;');
            ui.notify(stringArray[0], stringArray[1])
                .effect('slide')
                .closable();

            Session.set('displayMessage', null);
        }
    });
}



if (Meteor.isServer) {
    Meteor.startup(function() {
        console.log('server');
    });
}
