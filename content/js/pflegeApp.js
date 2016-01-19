var LITAPP = {};

LITAPP.REQUEST = function(type, url, data, callback){
    if( typeof(window.user_id) != "undefined" && window.user_id !== null )
    {
        if( data === null )
        {
            data = {};
        }

        if( data instanceof Array )
        {
            data[data.length] = {
                "name": "user_id",
                "value": window.user_id
            };
        }
        else
        {
            data.user_id = window.user_id;
        }
    }
    $.ajax({
        "context": this,
        "dataType": "json",
        "url": url,
        "type": type,
        "data": data
    })
    .done(callback)
    .fail(function (error) {
        LITAPP.es_o.publish_px('app', ["error", error]);
    });
};
LITAPP.GET = function(url, callback){
    LITAPP.REQUEST("GET", url, null, callback);
};
LITAPP.DELETE = function(url, callback){
    LITAPP.REQUEST("DELETE", url, null, callback);
};
LITAPP.PUT = function(url, data, callback){
    LITAPP.REQUEST("PUT", url, data, callback);
};
LITAPP.POST = function(url, data, callback){
    LITAPP.REQUEST("POST", url, data, callback);
};

LITAPP.Application_cl = Class.create({
    initialize: function () {
        this.content_o = null;
        this.loginView_o = new LITAPP.LoginView_cl();
        this.studiengangListView_o = new LITAPP.StudiengangListView_cl();
        this.modulListView_o = new LITAPP.ModulListView_cl();
        this.lehrveranstaltungListView_o = new LITAPP.LehrveranstaltungListView_cl();
        this.modulhandbuchView_o = new LITAPP.ModulhandbuchView_cl();
        this.studiengangDetailView_o = new LITAPP.StudiengangDetailView_cl();
        this.modulDetailView_o = new LITAPP.ModulDetailView_cl();
        this.lehrveranstaltungDetailView_o = new LITAPP.LehrveranstaltungDetailView_cl();

        LITAPP.es_o.subscribe_px(this, 'app');
    },
    notify_px: function (self, message, data_arr) {
        switch (message) {
            case 'app':
                switch (data_arr[0]) {
                    case 'init':
                        LITAPP.tm_o = new TELIB.TemplateManager_cl();
                        break;
                    case 'templates.loaded':
                        LITAPP.es_o.publish_px('app', ["login"]);
                        break;
                    case 'login':
                        self.setContent_p(self.loginView_o, null);
                        break;
                    case 'list-studiengang':
                        self.setContent_p(self.studiengangListView_o, null);
                        break;
                    case 'list-modul':
                        self.setContent_p(self.modulListView_o, data_arr[1]);
                        break;
                    case 'list-lehrveranstaltung':
                        self.setContent_p(self.lehrveranstaltungListView_o, data_arr[1]);
                        break;
                    case 'show-modulhandbuch':
                        self.setContent_p(self.modulhandbuchView_o, data_arr[1]);
                        break;
                    case 'add-studiengang':
                        self.setContent_p(self.studiengangDetailView_o, null);
                        break;
                    case 'edit-studiengang':
                        self.setContent_p(self.studiengangDetailView_o, data_arr[1]);
                        break;
                    case 'add-lehrveranstaltung':
                        self.setContent_p(self.lehrveranstaltungDetailView_o, data_arr[1], null);
                        break;
                    case 'edit-lehrveranstaltung':
                        self.setContent_p(self.lehrveranstaltungDetailView_o, data_arr[1], data_arr[2]);
                        break;
                    case 'add-modul':
                        self.setContent_p(self.modulDetailView_o, null);
                        break;
                    case 'edit-modul':
                        self.setContent_p(self.modulDetailView_o, data_arr[1]);
                        break;
                    case 'error':
                        self.showError(data_arr[1]);
                        break;
                    default:
                        console.warning('[Application_cl] unbekannte app-Notification: ' + data_arr[0]);
                        break;
                }
                break;
            default:
                console.warning('[Application_cl] unbekannte Notification: ' + message);
                break;
        }
    },
    setContent_p: function (newContent, data, data2) {
        if (this.content_o != null) {
            if (this.content_o === newContent) {
                this.content_o.render_px(data, data2);
            } else {
                if (this.content_o.canClose_px()) {
                    this.content_o.close_px();
                    this.content_o = newContent;
                    this.content_o.render_px(data, data2);
                }
            }
        } else {
            this.content_o = newContent;
            this.content_o.render_px(data, data2);
        }
    },
    showError: function (error) {
        if( error.responseJSON ) {
            console.log(error.responseJSON);
            if( error.responseJSON.message )
            {
                alert(error.responseJSON.message);
            }
        }
        else {
            console.log(error);
            if( error.statusText )
            {
                alert(error.statusText);
            }
        }
    }
});



$(document).ready(function () {
    LITAPP.es_o = new EventService_cl();
    LITAPP.app_o = new LITAPP.Application_cl();

    LITAPP.es_o.publish_px('app', ['init', null]);
});