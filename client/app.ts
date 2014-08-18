///<reference path="../packages/typescript-libs/lib.d.ts"/>
///<reference path="../packages/typescript-libs/meteor.d.ts"/>
///<reference path="../packages/typescript-libs/underscore.d.ts"/>
///<reference path="../packages/typescript-libs/jquery.d.ts"/>
///<reference path="../packages/typescript-libs/ironrouter.d.ts"/>

///<reference path="../collections.d.ts"/>

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

    export class RequiredChecker {

        private required: boolean = false;

        isRequired(): boolean {
            return this.required;
        }

        ok() {
            this.required = true;
        }

        ng() {
            this.required = false;
        }

        check(str): boolean {

            if(_.isEmpty(str)) {
                this.ng();
                return this.required;
            }

            if(/^\s+$/.test(str)) {
                this.ng();
                return this.required;
            }

            this.ok();
            return this.required;

        }

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
            return Util.createTimeOptions();
        }
    });

    this.route('admin', {
        path: '/admin',
        template: 'admin',
        data: function() {
            var _result: any = BoonsCollection.find({}, {sort: {created_at: -1}});
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
            return {
                thisUrl: location.href,
                result: BoonsCollection.findOne(this.params._id)
            }
        }
    });

});

var deleteEvent = function() {
    BoonsCollection.remove($('#delete').data('id'));
    Router.go('list');
}

Template['admin'].events({
    'click #delete': deleteEvent
});

Template['show'].events({

    'click #delete': deleteEvent,

    'click #copyTargetUrl': function() {
        $('#copyTargetUrl').select();
    }

});

var inputTitleRequiredChecker: Util.RequiredChecker = new Util.RequiredChecker();
var infoAreaRequiredChecker: Util.RequiredChecker = new Util.RequiredChecker();
var inputPasswordRequiredChecker: Util.RequiredChecker = new Util.RequiredChecker();
var selectDateRequiredChecker: Util.RequiredChecker = new Util.RequiredChecker();

Template['new'].events({

    'click #postEntry' : function(e) {

        var $inputEventTitle = $('#inputEventTitle');
        var $infoArea = $('#infoArea');
        var $inputPassword = $('#inputPassword');

        var $selectDate = $('#select-date');
        var $selectStartTime = $('#select-start-time');
        var $selectEndTime = $('#select-end-time');

        if(inputTitleRequiredChecker.check($inputEventTitle.val())) {
            $('#inputEventTitleIsRequired').addClass('hide');
            $('#eventTitleGroup').removeClass('has-warning');
            inputTitleRequiredChecker.ok();
        } else {
            $('#inputEventTitleIsRequired').removeClass('hide');
            $('#eventTitleGroup').addClass('has-warning');
            inputTitleRequiredChecker.ng();
        }

        if(infoAreaRequiredChecker.check($infoArea.val())) {
            $('#infoAreaIsRequired').addClass('hide');
            $('#infoAreaGroup').removeClass('has-warning');
            infoAreaRequiredChecker.ok();
        } else {
            $('#infoAreaIsRequired').removeClass('hide');
            $('#infoAreaGroup').addClass('has-warning');
            infoAreaRequiredChecker.ng();
        }

        if(inputPasswordRequiredChecker.check($inputPassword.val())) {
            $('#inputPasswordIsRequired').addClass('hide');
            $('#inputPasswordGroup').removeClass('has-warning');
            inputPasswordRequiredChecker.ok();
        } else {
            $('#inputPasswordIsRequired').removeClass('hide');
            $('#inputPasswordGroup').addClass('has-warning');
            inputPasswordRequiredChecker.ng();
        }

        if(selectDateRequiredChecker.check($selectDate.val())) {
            $('#selectDateIsRequired').addClass('hide');
            $('#selectDateGroup').removeClass('has-warning');
            selectDateRequiredChecker.ok();
        } else {
            $('#selectDateIsRequired').removeClass('hide');
            $('#selectDateGroup').addClass('has-warning');
            selectDateRequiredChecker.ng();
        }

        if(inputTitleRequiredChecker.isRequired() &&
           infoAreaRequiredChecker.isRequired() &&
           inputPasswordRequiredChecker.isRequired() &&
           selectDateRequiredChecker.isRequired()) {

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
