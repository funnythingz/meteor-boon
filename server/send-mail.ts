///<reference path="../definitions/lib.d.ts"/>
///<reference path="../definitions/meteor.d.ts"/>
///<reference path="../definitions/underscore.d.ts"/>

// TODO: メールサーバーの設定
Meteor.startup(function () {
    //process.env.MAIL_URL = '';
});

Meteor.methods({

    sendMail: function() {

        this.unblock();

        Email.send({
            from: "hoge@from.hoge",
            to: ["tekito@to.tekito"],
            subject: "test",
            text: "test"
        });
    }
});
