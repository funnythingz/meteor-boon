///<reference path="../definitions/lib.d.ts"/>
///<reference path="../definitions/meteor.d.ts"/>

interface IBoonsCollection {
    _id?: string;
    eventTitle: string;
    eventInfo: string;
    eventPassword: string;
    selectDates: Array<string>;
    selectStartTime: string;
    selectEndTime: string;
    createAt: number;
}

declare var BoonsCollection: Mongo.Collection<IBoonsCollection>;


interface ICommentsCollection {
    _id?: string;
    boonId: string;
    nickname: string;
    selectDates: Array<any>;
    comment: string;
    commentPassword: string;
    createAt: number;
}

declare var CommentsCollection: Mongo.Collection<ICommentsCollection>;
