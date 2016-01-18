LITAPP.ModulListView_cl = Class.create({
    initialize: function () {
        this.initList_p();

        LITAPP.es_o.subscribe_px(this, 'modul');
    },
    notify_px: function (self, message, data) {
        // unused
    },
    canClose_px: function () {
        return true;
    },
    close_px: function () {
        $("#list-modul").hide();
    },
    render_px: function () {
        var that = this;
        LITAPP.GET("/modul", function (data) {
            that.doRender_p(data)
        });
    },
    doRender_p: function (data) {
        var html = LITAPP.tm_o.execute_px("list-modul", data);
        $("#list-modul").remove();
        $("body .content").append(html);
        this.initList_p();
        console.log("[ModulListView_cl] doRender");
    },
    initList_p: function () {
        this.rowId_s = "";
        this.disableButtons_p();
        this.initHandler_p();
    },
    initHandler_p: function () {
        $("#list-modul").on("click", "td", $.proxy(this.onClickList_p, this));
        $("#list-modul").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickList_p: function (event_opl) {
        if (this.rowId_s != "") {
            $("#" + this.rowId_s).removeClass("active");
        }

        var newRowId_s = $(event_opl.target).parent().attr('id');
        if( this.rowId_s != newRowId_s )
        {
            this.rowId_s = newRowId_s;
            $("#" + this.rowId_s).addClass("active");
            this.enableButtons_p();
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
            case 'back':
                LITAPP.es_o.publish_px('app', ["list-studiengang", null]);
                break;
            case 'add':
                LITAPP.es_o.publish_px('app', ["add-modul", null]);
                break;
            case 'show':
            case 'edit':
                if (this.rowId_s != "") {
                    var active_id = $("#" + this.rowId_s).attr("data-id");
                    LITAPP.es_o.publish_px('app', ["edit-modul", active_id]);
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
        $("#list-modul button").each(function () {
            if ($(this).attr("data-action") != "add" && $(this).attr("data-action") != "back") {
                $(this).prop("disabled", false);
            }
        });
    },
    disableButtons_p: function () {
        $("#list-modul button").each(function () {
            if ($(this).attr("data-action") != "add" && $(this).attr("data-action") != "back") {
                $(this).prop("disabled", true);
            }
        });
    }
});
// EOF