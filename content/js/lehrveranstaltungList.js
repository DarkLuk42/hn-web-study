LITAPP.LehrveranstaltungListView_cl = Class.create({
    initialize: function () {
        this.initList_p();
        this.studiengang_id = null;

        LITAPP.es_o.subscribe_px(this, 'list');
    },
    notify_px: function (self_opl, message_spl, data_apl) {
        // unused
    },
    canClose_px: function () {
        return true;
    },
    close_px: function () {
        $("#list-lehrveranstaltung").hide();
    },
    render_px: function (studiengang_id) {
        var that = this;
        this.studiengang_id = studiengang_id;
        LITAPP.GET("/lehrveranstaltung/" + studiengang_id,function (data) {
            that.doRender_p({
                "studiengang_id": studiengang_id,
                "list": data
            });
        });
    },
    doRender_p: function (data) {
        var html = LITAPP.tm_o.execute_px("list-lehrveranstaltung", data);
        $("#list-lehrveranstaltung").remove();
        $("body .content").append(html);
        this.initList_p();
        console.log("[LehrveranstaltungListView_cl] doRender");
    },
    initList_p: function () {
        this.rowId_s = "";
        this.disableButtons_p();
        this.initHandler_p();
    },
    initHandler_p: function () {
        $("#list-lehrveranstaltung").on("click", "td", $.proxy(this.onClickList_p, this));
        $("#list-lehrveranstaltung").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickList_p: function (event_opl) {
        if (this.rowId_s != "") {
            $("#" + this.rowId_s).removeClass("active");
        }

        var newRowId_s = $(event_opl.target).parent().attr('id');
        if( this.rowId_s != newRowId_s )
        {
            this.rowId_s = newRowId_s;
            if( this.rowId_s ) {
                $("#" + this.rowId_s).addClass("active");
                this.enableButtons_p();
            }
            else
            {
                this.disableButtons_p();
            }
        }
        else
        {
            this.rowId_s = "";
            this.disableButtons_p();
        }
    },
    onClickButtons_p: function (event_opl) {

        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case 'add':
                LITAPP.es_o.publish_px('app', ["add-lehrveranstaltung", this.studiengang_id]);
                break;
            case 'back':
                LITAPP.es_o.publish_px('app', ["list-studiengang", null]);
                break;
            case "show":
            case 'edit':
                if (this.rowId_s != "") {
                    var $tr =$("#" + this.rowId_s);
                    var modul_id = $tr.attr("data-modul_id");
                    LITAPP.es_o.publish_px('app', ["edit-lehrveranstaltung", this.studiengang_id, modul_id]);
                } else {
                    alert("Wählen Sie bitte einen Eintrag in der Tabelle aus!");
                }
                break;
            case 'delete':
                if (this.rowId_s != "") {
                    if (confirm("Soll der Datensatz gelöscht werden?")) {
                        var that = this;
                        LITAPP.DELETE( this.rowId_s.replace(new RegExp("-","g"), "/"), function () {
                            $('#' + that.rowId_s).remove();
                            that.disableButtons_p();
                        });
                    }
                } else {
                    alert("Wählen Sie bitte einen Eintrag in der Tabelle aus!");
                }
                break;
        }
        event_opl.stopPropagation();
        event_opl.preventDefault();

    },
    enableButtons_p: function () {
        $("#list-lehrveranstaltung button").each(function () {
            if ($(this).attr("data-action") != "add" && $(this).attr("data-action") != "back") {
                $(this).prop("disabled", false);
            }
        });
    },
    disableButtons_p: function () {
        $("#list-lehrveranstaltung button").each(function () {
            if ($(this).attr("data-action") != "add" && $(this).attr("data-action") != "back") {
                $(this).prop("disabled", true);
            }
        });
    }
});
// EOF