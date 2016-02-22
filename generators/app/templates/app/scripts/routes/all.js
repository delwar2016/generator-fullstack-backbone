/*global define*/

define([
    'jquery',
    'backbone',
    'common'
], function ($, Backbone, Common) {
    'use strict';
    var AllRouter = Backbone.Router.extend({
        routes: {
            '':'main'
        },
        initialize:function(){
            this.back=$("#backBtn");
        },
        execute: function(callback, args, name) {
            if(Common.currentView) {
                Common.currentView.remove();
            }
            if (callback) callback.apply(this, args);
        },
        main: function () {
            this.back.hide();
        }
    });

    return AllRouter;
});
