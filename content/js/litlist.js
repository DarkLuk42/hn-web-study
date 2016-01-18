LITAPP.ListView_cl = Class.create({
    initialize: function () {
        this.initList_p();

        LITAPP.es_o.subscribe_px(this, 'list');
    },
    notify_px: function (self_opl, message_spl, data_apl) {
        switch (message_spl) {
            case 'list':
                switch (data_apl[0]) {
                    case 'refresh':
                        self_opl.render_px(data_apl[1]);
                        break;
                    default:
                        console.warning('[ListView_cl] unbekannte list-Notification: ' + data_apl[0]);
                        break;
                }
                break;
            default:
                console.warning('[ListView_cl] unbekannte Notification: ' + message_spl);
                break;
        }
    },
    canClose_px: function () {
        return true;
    },
    close_px: function () {
        $("#idList").hide();
    },
    render_px: function (data_opl) {
        $.ajax({
            context: this,
            dataType: "json",
            url: "/studiengang",
            type: 'GET'
        })
            .done(function (data_opl) {
                this.doRender_p('list-studiengang', data_opl)
            })
            .fail(function (jqXHR_opl, textStatus_spl) {
                alert("[Liste] Fehler bei Anforderung: " + textStatus_spl);
            });
    },
    doRender_p: function (template, data) {
        var html = LITAPP.tm_o.execute_px(template, data);
        $("#idList").remove();
        $("body .content").append(html);
        this.initList_p();
        console.log("[ListView_cl] doRender");
    },
    initList_p: function () {
        this.rowId_s = "";
        this.disableButtons_p();
        this.initHandler_p();
    },
    initHandler_p: function () {
        $("#idList").on("click", "td", $.proxy(this.onClickList_p, this));
        $("#idList").on("click", "button", $.proxy(this.onClickButtons_p, this));
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
            case 'add':
                // weiterleiten
                LITAPP.es_o.publish_px('app', [action_s, {
                        "template": $(event_opl.target).attr("data-template"),
                        "data": {
                            "action": $(event_opl.target).attr("data-action-path"),
                            "method": "PUT"
                        }
                    }]);
                break;
            case 'edit':
                if (this.rowId_s != "") {
                    var action = this.rowId_s.replace(new RegExp("-","g"), "/");
                    if( $(event_opl.target).attr("data-action-path") )
                    {
                        action = $(event_opl.target).attr("data-action-path");
                        action = action.replace(RegExp("%id%", "gi"), $("#"+this.rowId_s).attr("data-id"));
                    }
                    LITAPP.es_o.publish_px('app', [ action_s, {
                        "template": $(event_opl.target).attr("data-template"),
                        "data": {
                            "path": action,
                            "action": action,
                            "method": "POST"
                        }
                    } ]);
                } else {
                    alert("Wählen Sie bitte einen Eintrag in der Tabelle aus!");
                }
                break;
            case 'delete':
                if (this.rowId_s != "") {
                    if (confirm("Soll der Datensatz gelöscht werden?")) {
                        $.ajax({
                                context: this,
                                dataType: "json",
                                url: this.rowId_s.replace(new RegExp("-","g"), "/"),
                                type: 'DELETE'
                            })
                            .done(function () {
                                $('#' + this.rowId_s).remove();
                                this.initList_p();
                            })
                            .fail(function (error) {
                                LITAPP.es_o.publish_px('app', ['error', error]);
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
        $("#idList button").each(function () {
            if ($(this).attr("data-action") != "add") {
                $(this).prop("disabled", false);
            }
        });
    },
    disableButtons_p: function () {
        $("#idList button").each(function () {
            if ($(this).attr("data-action") != "add") {
                $(this).prop("disabled", true);
            }
        });
    }
});
// EOF