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
        this.doRender_p(data_opl)
    },
    doRender_p: function (data_opl) {
        $("#idList").remove();
        $("body").append(LITAPP.tm_o.execute_px('list', data_opl));
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
                LITAPP.es_o.publish_px('app', [action_s, null]);
                break;
            case 'edit':
                if (this.rowId_s != "") {
                    // Weiterleiten
                    LITAPP.es_o.publish_px('app', [action_s, this.rowId_s]);
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
                                url: this.rowId_s,
                                type: 'DELETE'
                            })
                            .done(function (data_opl) {
                                // Auswertung der Rückmeldung
                                // der umständliche Weg:
                                // - Liste neu darstellen, hier vereinfacht durch neue Anforderung
                                //LITAPP.es_o.publish_px('list', ['refresh', null]);

                                // einfacher mit direktem Entfernen der Zeile aus der Tabelle
                                // (id des gelöschten Eintrags wird in der Antwort geliefert)
                                $('#' + data_opl['id']).remove();
                                this.initList_p();
                            })
                            .fail(function (jqXHR_opl, textStatus_spl) {
                                alert("[Liste] Fehler bei Anforderung: " + textStatus_spl);
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
        $("#idListContent #idButtonArea button").each(function () {
            if ($(this).attr("data-action") != "add") {
                $(this).prop("disabled", false);
            }
        });
    },
    disableButtons_p: function () {
        $("#idListContent #idButtonArea button").each(function () {
            if ($(this).attr("data-action") != "add") {
                $(this).prop("disabled", true);
            }
        });
    }
});
// EOF