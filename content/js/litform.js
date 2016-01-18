// ----------------------------------------------
// Beispiel lit-8
// litform.js
// ----------------------------------------------

// ----------------------------------------------
LITAPP.DetailView_cl = Class.create({
// ----------------------------------------------
    initialize: function () {
        $("#idDetail").hide();
        this.initHandler_p();
        this.storeFormContent_p();
    },
    canClose_px: function () {
        var canClose_b = true;
        if ( this.isModified_p() ) {
            canClose_b = confirm("Es gibt nicht gespeicherte Änderungen - verwerfen?");
        }
        return canClose_b;
    },
    close_px: function () {
        $("#idDetail").hide();
    },
    render_px: function (data_opl) {
        var path_s;
        if (data_opl != null) {
            path_s = data_opl;
        } else {
            path_s = '/';
        }
        $.ajax({
                dataType: "json",
                url: path_s,
                type: 'GET'
            })
            .done($.proxy(this.doRender_p, this))
            .fail(function (jqXHR_opl, textStatus_spl) {
                alert("[Form] Fehler bei Anforderung: " + textStatus_spl);
            });
    },
    doRender_p: function (data_opl) {
        // in das Formular übertragen
        var data_o = data_opl['data'];
        $('#id_s').val(data_o['id']);
        $('#name_s').val(data_o['name']);
        $('#typ_s').val(data_o['typ']);
        $('#referenz_s').val(data_o['referenz']);

        this.storeFormContent_p();

        $("#idDetail").show();
    },
    initHandler_p: function () {
        // Ereignisverarbeitung für das Formular einrichten
        $("#idDetail").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var do_b = false;
        var path_s;
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case "back":
                // Weiterleiten
                LITAPP.es_o.publish_px('app', [action_s, null]);
                break;
            case "save":
                // Formularinhalt prüfen
                if (this.isModified_p()) {
                    if (this.checkContent_p()) {
                        // kein klassisches submit, es wird auch keine neue Anzeige vorgenommen
                        var path_s = '/lit';
                        var data_s = $("#idDetail").serialize();
                        var type_s = 'POST';
                        var id_s = $('#id_s').val();
                        if (id_s == '') {
                            type_s = 'PUT';
                        } else {
                            path_s += '/' + id_s;
                        }
                        //var that = this;
                        $.ajax({
                                context: this,
                                dataType: "json",
                                data: data_s,
                                url: path_s,
                                type: type_s
                            })
                            .done(function (data_opl) {
                                // Umwandlung der JSON-Daten vom Server bereits erfolgt
                                $('#id_s').val(data_opl['id']);
                                // aktuellen Formularinhalt speichern
                                // (das Formular wird ja nicht mehr neu geladen!)
                                this.storeFormContent_p();
                                alert("Speichern ausgeführt!");
                            })
                            .fail(function (jqXHR_opl, textStatus_spl) {
                                alert("Fehler bei Anforderung: " + textStatus_spl);
                            });

                    } else {
                        alert("Bitte prüfen Sie die Eingaben in den Formularfeldern!")
                    }
                }
                break;
        }

        event_opl.stopPropagation();
        event_opl.preventDefault();
    },
    isModified_p: function () {
        return this.FormContentOrg_s != $("#idDetail").serialize();
    },
    checkContent_p: function () {
        // hier nur zur Demonstration Prüfung des Typs gegen eine Werteliste
        // (das realisiert man besser mit einer Liste)
        var status_b = true;
        var typ_s = $("#typ_s").val();
        if ((typ_s != "Typ1") && (typ_s != "Typ2")) {
            status_b = false;
        }
        return status_b;
    },
    storeFormContent_p: function () {
        this.FormContentOrg_s = $("#idDetail").serialize();
    }
});
// EOF