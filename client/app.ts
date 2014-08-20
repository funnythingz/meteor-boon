///<reference path="../packages/typescript-libs/lib.d.ts"/>
///<reference path="../packages/typescript-libs/meteor.d.ts"/>
///<reference path="../packages/typescript-libs/underscore.d.ts"/>
///<reference path="../packages/typescript-libs/jquery.d.ts"/>
///<reference path="../packages/typescript-libs/ironrouter.d.ts"/>

///<reference path="../collections.d.ts"/>
///<reference path="../definitions/bootstrap.datepicker.d.ts"/>
///<reference path="../definitions/bootstrap.d.ts"/>

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

    export function createDate(date: any): string {
        return date.getFullYear() + "." + date.getMonth() + "." + date.getDate();
    }

    export class DatePickerApp {

        $selectDate = $('#select-date');
        $datePicker = $('#date-picker');

        constructor() {
            this.ready();
        }

        ready() {

            var datepickerOptions = {
                language: "ja",
                todayHighlight: true,
                format: "dd/mm/yyyy"
            }

            this.$datePicker
                .datepicker(datepickerOptions)
                .on("changeDate", e => this.updateDate(e));
        }

        updateDate(e) {
            if(_.isUndefined(e.date)) {
                this.$selectDate.val('')
            } else {
                var date = createDate(new Date(e.date));
                this.$selectDate.val(date);
            }
        }

    }

}

module ViewModel {

    export class Boon {
        constructor(public eventTitle: string,
                    public eventInfo: string,
                    public eventPassword: string,
                    public selectDate: string,
                    public selectStartTime: string,
                    public selectEndTime: string,
                    public createAt: number) {}
    }

}

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});


var HomeController = RouteController.extend({
    template: 'home'
});

var AboutController = RouteController.extend({
    template: 'about'
});

var NewController = RouteController.extend({
    template: 'new',

    onAfterAction: function() {
        setTimeout(function() {
            new Util.DatePickerApp();
        },1000);
    },

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

var AdminController = RouteController.extend({
    template: 'admin',

    data: function() {
        var _result: any = BoonsCollection.find({}, {sort: {createAt: -1}});
        return _result;
    }
});

var ShowController = RouteController.extend({
    template: 'show',
    onBeforeAction: function() {
        if(_.isUndefined(BoonsCollection.findOne(this.params._id))) {
            Router.go('home');
        }
    },

    onAfterAction: function() {
        setTimeout(function() {
            $('#deleteModal').on('hidden.bs.modal', function(e) {
                Session.set('deletePassword', false);
                $('#deletePassword').val('');
            });
        }, 1000);
    },

    data: function() {


        var _result: any = BoonsCollection.findOne(this.params._id);

        return {
            thisUrl: location.href,
            result: _result,
            deletePasswordError: Session.get('deletePassword'),
        }
    }
});

Router.map(function() {

    this.route('home', {
        path: '/',
        controller: HomeController,
        fastRender: true
    });

    this.route('about', {
        path: '/about',
        controller: AboutController,
        fastRender: true
    });

    this.route('new', {
        path: '/new',
        controller: NewController,
        fastRender: true
    });

    this.route('admin', {
        path: '/admin',
        controller: AdminController,
        fastRender: true
    });

    this.route('show', {
        path: '/boons/:_id',
        controller: ShowController,
        fastRender: true
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
        var $deletePassword = $('#deletePassword');
        var _id = $deleteFire.data('id');
        var _password: any = BoonsCollection.findOne(_id).eventPassword;

        if(_.isEqual(_password, $deletePassword.val())) {
            $('#deleteModal').modal('hide').on('hidden.bs.modal', function(e) {
                BoonsCollection.remove(_id);
            });
        } else {
            Session.set('deletePassword', true);
        }
    },

    'click #sendMail': function(e) {
        Meteor.call("sendMail");
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

            var boon: ViewModel.Boon = new ViewModel.Boon($inputEventTitle.val(),
                                                          $infoArea.val(),
                                                          $inputPassword.val(),
                                                          $selectDate.val(),
                                                          $selectStartTime.val(),
                                                          $selectEndTime.val(),
                                                          (new Date()).getTime());

            var _id = BoonsCollection.insert(boon, ()=> {
                Router.go('show', {_id: _id});
            });

        }

    }

});
