Logininfo=new Meteor.Collection('logininfo');

if (Meteor.isClient) {
    // Template.hello.greeting = function() {
    //     return "Welcome to bidme. " + Session.get("greet");
    // };

    // Template.hello.events({
    //     'keypress input': function(e, t) {
    //         if (e.keyCode == 13) {
    //             console.log('Welcome ' + t.find('#intxt').value);
    //             Session.set("greet",  t.find('#intxt').value);
    //         };
    //     }
    // });

  Template.login.events({
        'submit .form-signin': function(e, t) {
            // if (e.keyCode == 13) {
                console.log('email - ' + t.find('#email').value);
                console.log('password - ' + t.find('#password').value);
                alert('email - ' + t.find('#email').value);
                alert('password - ' + t.find('#password').value);
                Logininfo.insert({username:t.find('#email').value,password:t.find('#password').value});
            // };
        }
    });
}



if (Meteor.isServer) {
    Meteor.startup(function() {
        console.log('server');
    });
}
