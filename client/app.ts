///<reference path="../packages/typescript-libs/lib.d.ts"/>
///<reference path="../packages/typescript-libs/meteor.d.ts"/>
///<reference path="../packages/typescript-libs/underscore.d.ts"/>
///<reference path="../packages/typescript-libs/jquery.d.ts"/>

///<reference path="../collections.d.ts"/>
///<reference path="../bootstrap.d.ts"/>
///<reference path="../ironrouter.d.ts"/>

module Util {

    export function createTimeOptions() {

        var _timeOptions: Array<string> = [];

        for (var i: number = 0; i < 24; i++) {

            if (_.isEqual(i.toString().length, 2)) {
                _timeOptions.push(i + ":00");
                _timeOptions.push(i + ":30");
            } else {
                _timeOptions.push("0" + i + ":00");
                _timeOptions.push("0" + i + ":30");
            }
        }

        return _timeOptions;
    }

    export function requiredCheck(arg: string): boolean {

        if(_.isEmpty(arg)) {
            return true;
        }

        if(/^\s+$/.test(arg)) {
            return true;
        }

        return false;

    }

}

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

Router.map(function() {

    this.route('home', {
        path: '/',
        template: 'home'
    });

    this.route('about', {
        path: '/about',
        template: 'about'
    });

    this.route('new', {
        path: '/new',
        template: 'new',
        data: function() {
            return {
                inputEventTitleError: Session.get('inputEventTitle'),
                infoAreaError: Session.get('infoArea'),
                inputPasswordError: Session.get('inputPassword'),
                selectDateError: Session.get('selectDate'),
                timeOptions: Util.createTimeOptions()
            };
        }
    });

    this.route('admin', {
        path: '/admin',
        template: 'admin',
        data: function() {
            var _result: any = BoonsCollection.find({}, {sort: {createAt: -1}});
            return _result;
        }
    });

    this.route('show', {
        path: '/boons/:_id',
        template: 'show',
        onBeforeAction: function() {
            if(_.isUndefined(BoonsCollection.findOne(this.params._id))) {
                Router.go('home');
            }
        },
        data: function() {

            var _result: any = BoonsCollection.findOne(this.params._id);

            return {
                thisUrl: location.href,
                result: _result
            }
        }
    });

});

Template['admin'].events({
    'click #delete': function() {
        BoonsCollection.remove($('#delete').data('id'));
        Router.go('list');
    }
});

Template['show'].events({

    'click #copyTargetUrl': function() {
        $('#copyTargetUrl').select();
    },

    'click #deleteFire': function(e) {
        var $deleteFire = $('#deleteFire');
        var $inputPassword = $('#inputPassword');
        var _id = $deleteFire.data('id');
        var _password: any = BoonsCollection.findOne(_id).eventPassword;

        if(_.isEqual(_password, $inputPassword.val())) {
            $('#deleteModal').modal('hide').on('hidden.bs.modal', function(e) {
                BoonsCollection.remove(_id);
            });
        } else {
            $('#inputPasswordIsRequired').removeClass('hide');
            $('#inputPasswordGroup').addClass('has-warning');
        }
    }

});

Template['new'].events({

    'click #postEntry' : function(e) {

        var $inputEventTitle = $('#inputEventTitle');
        var $infoArea = $('#infoArea');
        var $inputPassword = $('#inputPassword');

        var $selectDate = $('#select-date');
        var $selectStartTime = $('#select-start-time');
        var $selectEndTime = $('#select-end-time');

        Session.set('inputEventTitle', Util.requiredCheck($inputEventTitle.val()));
        Session.set('infoArea', Util.requiredCheck($infoArea.val()));
        Session.set('inputPassword', Util.requiredCheck($inputPassword.val()));
        Session.set('selectDate', Util.requiredCheck($selectDate.val()));

        if(!Session.get('inputEventTitle') &&
           !Session.get('infoArea') &&
           !Session.get('inputPassword') &&
           !Session.get('selectDate')) {

            var _id = BoonsCollection.insert({
                eventTitle: $inputEventTitle.val(),
                eventInfo: $infoArea.val(),
                eventPassword: $inputPassword.val(),
                selectDate: $selectDate.val(),
                selectStartTime: $selectStartTime.val(),
                selectEndTime: $selectEndTime.val(),
                createAt: (new Date()).getTime()
            }, ()=> {
                Router.go('show', {_id: _id});
            });

        }

    }
});
