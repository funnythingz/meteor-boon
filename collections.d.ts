///<reference path="./packages/typescript-libs/lib.d.ts"/>
///<reference path="./packages/typescript-libs/meteor.d.ts"/>

interface IBoonsCollection {
    _id?: string;
    eventTitle: string;
    eventInfo: string;
    eventPassword: string;
    selectDate: string;
    selectStartTime: string;
    selectEndTime: string;
    createAt: number;
}

declare var BoonsCollection: Meteor.Collection<IBoonsCollection>;


interface ICommentsCollection {
    _id?: string;
    boonId: string;
    nickname: string;
    selectDates: string;
    comment: string;
    commentPassword: string;
    createAt: number;
}

declare var CommentsCollection: Meteor.Collection<ICommentsCollection>;
