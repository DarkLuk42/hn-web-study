
var NAV = {
    "studiengang": {
        "type": "list",
        "template": "list-studiengang",
        "children": {
            "lehrveranstaltung": {
                "type": "list",
                "path": "%key%/%pid%"
            }
        }
    },
    "modulhandbuch": {
        "type": "list"
    },
    "modul": {
        "type": "list"
    }
};

var LITAPP = {};

LITAPP.Application_cl = Class.create({
    initialize: function () {
        this.content_o = null;
        this.nav_o = new LITAPP.Nav_cl();
        this.listView_o = new LITAPP.ListView_cl();
        this.detailView_o = new LITAPP.DetailView_cl();

        LITAPP.es_o.subscribe_px(this, 'app');
    },
    notify_px: function (self_opl, message_spl, data_apl) {
        switch (message_spl) {
            case 'app':
                switch (data_apl[0]) {
                    case 'init':
                        LITAPP.tm_o = new TELIB.TemplateManager_cl();
                        break;
                    case 'templates.loaded':
                        self_opl.setContent_p(self_opl.listView_o, data_apl[1]);
                        break;
                    case 'list':
                        self_opl.setContent_p(self_opl.listView_o, data_apl[1]);
                        break;
                    case 'add':
                        self_opl.setContent_p(self_opl.detailView_o, data_apl[1]);
                        break;
                    case 'edit':
                        self_opl.setContent_p(self_opl.detailView_o, data_apl[1]);
                        break;
                    case 'back':
                        self_opl.setContent_p(self_opl.listView_o, data_apl[1]);
                        break;
                    case 'error':
                        self_opl.showError(data_apl[1]);
                        break;
                    default:
                        console.warning('[Application_cl] unbekannte app-Notification: ' + data_apl[0]);
                        break;
                }
                break;
            default:
                console.warning('[Application_cl] unbekannte Notification: ' + message_spl);
                break;
        }
    },
    setContent_p: function (newContent_opl, data_opl) {
        if (this.content_o != null) {
            if (this.content_o === newContent_opl) {
                // wird bereits angezeigt, keine Änderung
            } else {
                if (this.content_o.canClose_px()) {
                    this.content_o.close_px();
                    this.content_o = newContent_opl;
                    this.content_o.render_px(data_opl);
                }
            }
        } else {
            this.content_o = newContent_opl;
            this.content_o.render_px(data_opl);
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
        }
    }
});



$(document).ready(function () {
    LITAPP.es_o = new EventService_cl();
    LITAPP.app_o = new LITAPP.Application_cl();

    LITAPP.es_o.publish_px('app', ['init', null]);

});