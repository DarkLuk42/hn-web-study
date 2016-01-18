LITAPP.LehrveranstaltungDetailView_cl = Class.create({
    initialize: function () {
        $("#detail-lehrveranstaltung").hide();
        this.studiengang_id = null;
        this.modul_id = null;
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
        $("#detail-lehrveranstaltung").hide();
    },
    render_px: function (studiengang_id, modul_id) {
        this.studiengang_id = studiengang_id;
        var that = this;
        LITAPP.GET("/studiengang/"+studiengang_id, function(studiengang){
            LITAPP.GET("/modul/", function(module){
                if( typeof( modul_id ) != "undefined" && modul_id != null )
                {
                    that.modul_id = modul_id;
                    LITAPP.GET("/lehrveranstaltung/"+studiengang_id+"/"+modul_id, function(data){
                        that.doRender_p({
                            "studiengang":studiengang,
                            "module":module,
                            "course": data
                        })
                    });
                }
                else
                {
                    that.modul_id = null;
                    that.doRender_p({
                        "studiengang":studiengang,
                        "module":module,
                        "course": null
                    })
                }
            });
        });
    },
    doRender_p: function (data) {
        var html = LITAPP.tm_o.execute_px("detail-lehrveranstaltung", data);
        $("#detail-lehrveranstaltung").remove();
        $("body .content").append(html);
        this.initHandler_p();
        this.storeFormContent_p();
        $("#detail-lehrveranstaltung").show();
    },
    initHandler_p: function () {
        $("#detail-lehrveranstaltung").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case "back":
                LITAPP.es_o.publish_px('app', ["list-lehrveranstaltung", this.studiengang_id]);
                break;
            case "save":
                if (this.isModified_p()) {
                    if (this.checkContent_p()) {
                        var that = this;
                        var data = $("#detail-lehrveranstaltung").serializeArray();
                        if( this.modul_id === null )
                        {
                            LITAPP.PUT("/lehrveranstaltung/"+this.studiengang_id, data, function(data){
                                that.modul_id = data.modul_id;
                                that.storeFormContent_p();
                                alert("Speichern ausgeführt!");
                            });
                        }
                        else
                        {
                            LITAPP.POST("/lehrveranstaltung/"+this.studiengang_id+"/" + this.modul_id, data, function(data){
                                that.modul_id = data.modul_id;
                                that.storeFormContent_p();
                                alert("Speichern ausgeführt!");
                            });
                        }
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
        return this.FormContentOrg_s != $("#detail-lehrveranstaltung").serialize();
    },
    checkContent_p: function () {
        return true;
    },
    storeFormContent_p: function () {
        this.FormContentOrg_s = $("#detail-lehrveranstaltung").serialize();
    }
});
// EOF