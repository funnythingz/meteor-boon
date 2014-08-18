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
