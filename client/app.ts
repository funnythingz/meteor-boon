///<reference path="../definitions/lib.d.ts"/>
///<reference path="../definitions/meteor.d.ts"/>
///<reference path="../definitions/underscore.d.ts"/>
///<reference path="../definitions/jquery.d.ts"/>
///<reference path="../definitions/ironrouter.d.ts"/>
///<reference path="../definitions/bootstrap.datepicker.d.ts"/>
///<reference path="../definitions/bootstrap.d.ts"/>

///<reference path="../interface/collections.d.ts"/>

module Memory {

    export var dates: Array<string> = [];

}

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
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    }

    export class StatusCreator {

        static statusToBootstrapStatus(status) {

            switch(status) {
                case 'ok':
                    return 'success';
                case 'ng':
                    return 'danger';
                case 'pending':
                    return 'warning';
            }

        }

        static statusToBootstrapTextStatus(status) {

            switch(status) {
                case 'ok':
                    return 'text-success';
                case 'ng':
                    return 'text-danger';
                case 'pending':
                    return 'text-warning';
            }

        }

        static statusToBootstrapStatusIcon(status) {

            switch(status) {
                case 'ok':
                    return 'glyphicon-ok';
                case 'ng':
                    return 'glyphicon-remove';
                case 'pending':
                    return 'glyphicon-minus';
            }

        }

    }

    export class DatePickerApp {

        $dpCalendar = $('#dp-calendar');
        $inputDates = $('#input-dates');
        $datePicker = $('#date-picker');

        constructor() {
            this.ready();
        }

        ready() {

            var datepickerOptions = {
                language: "ja",
                multidate: true,
                todayHighlight: true,
                format: "dd/mm/yyyy"
            }

            this.$dpCalendar
                .datepicker(datepickerOptions)
                .on("changeDate", e => this.updateDate(e));
        }

        updateDate(e) {

            Memory.dates = e.dates;

            Session.set('selectDate', _.isEmpty(Memory.dates));

            this.$inputDates.html('');

            $.map(Memory.dates, (date)=> {

                var dateVal: string = createDate(new Date(date));

                var $formGroup = $('<div class="form-group has-feedback col-md-12 spacing">');

                var $input = $('<input class="form-control select-date" type="text" readonly="readonly">')
                    .val(dateVal).appendTo(this.$inputDates);

                var $deleteDate = $('<span class="glyphicon glyphicon-remove form-control-feedback tap" data-date="' + date + '"></span>')
                    .on('click', e => {
                        Memory.dates = _.reject(Memory.dates, arg => {return _.isEqual(arg, date)});
                        this.$dpCalendar.datepicker('setDates', Memory.dates);
                    });

                $formGroup.append($input, $deleteDate);

                this.$inputDates.append($formGroup);

            });

        }


    }

}

module ViewModel {

    export class Boon {
        constructor(public eventTitle: string,
                    public eventInfo: string,
                    public eventPassword: string,
                    public selectDates: Array<string>,
                    public selectStartTime: string,
                    public selectEndTime: string,
                    public createAt: number) {}
    }

    export class Comment {
        constructor(public boonId: string,
                    public nickname: string,
                    public selectDates: Array<any>,
                    public comment: string,
                    public commentPassword: string,
                    public createAt: number) {}
    }

}

Router.onBeforeAction('dataNotFound');

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
        }, 500);
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

var ShowController = RouteController.extend({

    template: 'show',

    onAfterAction: function() {
        setTimeout(function() {

            $('#deleteModal').on('hidden.bs.modal', function(e) {
                Session.set('deletePassword', false);
                $('#deletePassword').val('');
            });

            $('#addScheduleModal').on('hidden.bs.modal', function(e) {
                Session.set('inputNickName', false);
                Session.set('inputUserSchedulePassword', false);

                $('#inputNickName').val('');
                $('#inputUserComment').val('');
                $('#inputUserSchedulePassword').val('');
            });

            $('#deleteCommentModal').on('show.bs.modal', function(e) {
                Session.set('deleteComment', $(e.relatedTarget).data('id'))
            });

            $('#deleteCommentModal').on('hidden.bs.modal', function(e) {
                Session.set('deleteCommentPasswordError', false);
                $('#deleteCommentPassword').val('');
            });

        }, 500);
    },

    data: function() {

        var boon: any = BoonsCollection.findOne(this.params._id);
        var comments: any = CommentsCollection.find({boonId: this.params._id}, {sort: {createAt: -1}});

        if(_.isUndefined(boon)) {
            return;
        }

        return {
            thisUrl: location.href,
            boon: boon,
            comments: comments,
            deletePasswordError: Session.get('deletePassword'),
            inputNickNameError: Session.get('inputNickName'),
            inputUserSchedulePasswordError: Session.get('inputUserSchedulePassword')
        }
    }
});

Router.map(function() {

    this.route('home', {
        path: '/',
        controller: HomeController,
    });

    this.route('about', {
        path: '/about',
        controller: AboutController,
    });

    this.route('new', {
        path: '/new',
        controller: NewController,
    });

    this.route('show', {
        path: '/boons/:_id',
        controller: ShowController,
    });

});

Template['show'].events({

    'click #copyTargetUrl': function() {
        $('#copyTargetUrl').select();
    },

    'click #deleteBoon': function(e) {
        var $deleteBoon = $('#deleteBoon');
        var $deletePassword = $('#deletePassword');

        var _id = $deleteBoon.data('id');
        var _password: any = BoonsCollection.findOne(_id);

        var _comments: Array<string> = [];
        if(!_.isUndefined($deleteBoon.data('comments'))) {
            _.compact($deleteBoon.data('comments').split(","));
        }

        if(_.isEqual(_password.eventPassword, $deletePassword.val())) {
            $('#deleteModal').modal('hide').on('hidden.bs.modal', function(e) {

                BoonsCollection.remove(_id);

                $.each(_comments, (key, comment)=> {
                    CommentsCollection.remove(comment);
                });

                Router.go('home');
            });
        } else {
            Session.set('deletePassword', true);
        }
    },

    'click #deleteComment': function() {
        var $deleteCommentPassword = $('#deleteCommentPassword');

        var _id: string = Session.get('deleteComment');
        var _password: any = CommentsCollection.findOne(_id);

        if(_.isEqual(_password.commentPassword, $deleteCommentPassword.val())) {
            $('#deleteCommentModal').modal('hide').on('hidden.bs.modal', function(e) {
                CommentsCollection.remove(_id);
            });
        } else {
            Session.set('deleteCommentPasswordError', true);
        }
    }

});

Template['addSchedule'].events({

    'click #postComment': function(e) {

        var $boon = $('#boon');
        var $inputNickName = $('#inputNickName');
        var $selectStatus = $('.selectStatus');
        var $inputUserComment = $('#inputUserComment');
        var $inputUserSchedulePassword = $('#inputUserSchedulePassword');

        var boonId = $boon.data('id');

        var selectStatusList: Array<any> = $.map($selectStatus, (selectStatus)=> {

            return {
                date: $(selectStatus).data('date'),
                status: $(selectStatus).val()
            };

        });

        Session.set('inputNickName', Util.requiredCheck($inputNickName.val()));
        Session.set('inputUserSchedulePassword', Util.requiredCheck($inputUserSchedulePassword.val()));

        if(!Session.get('inputNickName') &&
           !Session.get('inputUserSchedulePassword')) {

            var comment: ViewModel.Comment = new ViewModel.Comment(boonId,
                                                                   $inputNickName.val(),
                                                                   selectStatusList,
                                                                   $inputUserComment.val(),
                                                                   $inputUserSchedulePassword.val(),
                                                                   (new Date()).getTime());

            var _id = CommentsCollection.insert(comment, ()=> {
                $("#addScheduleModal").modal("hide");
            });

        }

    },

    // TODO: 出欠席のステータス変更をわかりやすくしたい
    // ここで処理する
    "change .selectStatus": function(e) {
        console.log(e.target.value);
    }

});

Template['addSchedule']['dateToStr'] = function(date) {
    return Util.createDate(date);
}

Template['show']['dateToStr'] = function(date) {
    return Util.createDate(date);
}

Template['show']['statusState'] = function(status) {
    return Util.StatusCreator.statusToBootstrapStatus(status);
}

Template['show']['statusIcon'] = function(status) {
    return Util.StatusCreator.statusToBootstrapStatusIcon(status);
}

Template['show']['statusText'] = function(status) {
    return Util.StatusCreator.statusToBootstrapTextStatus(status);
}

Template['deleteComment']['deleteCommentPasswordError'] = function() {
    return Session.get('deleteCommentPasswordError');
}

Template['new'].events({

    'click #postEntry' : function(e) {

        var $inputEventTitle = $('#inputEventTitle');
        var $infoArea = $('#infoArea');
        var $inputPassword = $('#inputPassword');

        var $selectStartTime = $('#select-start-time');
        var $selectEndTime = $('#select-end-time');

        Session.set('inputEventTitle', Util.requiredCheck($inputEventTitle.val()));
        Session.set('infoArea', Util.requiredCheck($infoArea.val()));
        Session.set('inputPassword', Util.requiredCheck($inputPassword.val()));
        Session.set('selectDate', _.isEmpty(Memory.dates));

        if(!Session.get('inputEventTitle') &&
           !Session.get('infoArea') &&
           !Session.get('inputPassword') &&
           !Session.get('selectDate')) {

            var boon: ViewModel.Boon = new ViewModel.Boon($inputEventTitle.val(),
                                                          $infoArea.val(),
                                                          $inputPassword.val(),
                                                          Memory.dates,
                                                          $selectStartTime.val(),
                                                          $selectEndTime.val(),
                                                          (new Date()).getTime());

            var _id = BoonsCollection.insert(boon, ()=> {
                Router.go('show', {_id: _id});
            });

        }

    }

});
