var LITAPP = {};

LITAPP.REQUEST = function(type, url, data, callback){
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
        this.studiengangListView_o = new LITAPP.StudiengangListView_cl();
        this.modulhandbuchView_o = new LITAPP.ModulhandbuchView_cl();
        this.studiengangDetailView_o = new LITAPP.StudiengangDetailView_cl();

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
                        LITAPP.es_o.publish_px('app', ["list-studiengang"]);
                        break;
                    case 'list-studiengang':
                        self.setContent_p(self.studiengangListView_o, null);
                        break;
                    case 'show-modulhandbuch':
                        self.setContent_p(self.modulhandbuchView_o, data_arr[1]);
                        break;
                    case 'edit-studiengang':
                        self.setContent_p(self.studiengangDetailView_o, data_arr[1]);
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
            console.log(error)
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