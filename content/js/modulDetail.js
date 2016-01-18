LITAPP.ModulDetailView_cl = Class.create({
    initialize: function () {
        $("#detail-modul").hide();
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
        $("#detail-modul").hide();
    },
    render_px: function (modul_id) {
        console.log(modul_id);
        if( typeof( modul_id ) != "undefined" && modul_id !== null )
        {
            this.modul_id = modul_id;
            var that = this;
            LITAPP.GET("/modul/"+modul_id, function(data){
                that.doRender_p(data)
            });
        }
        else
        {
            this.modul_id = null;
            this.doRender_p(null)
        }
    },
    doRender_p: function (data) {
        if( data !== null ) {
            data.id = this.modul_id;
        }
        var html = LITAPP.tm_o.execute_px("detail-modul", data);
        $("#detail-modul").remove();
        $("body .content").append(html);
        this.initHandler_p();
        this.storeFormContent_p();
        $("#detail-modul").show();
    },
    initHandler_p: function () {
        $("#detail-modul").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case "back":
                LITAPP.es_o.publish_px('app', ["list-modul", null]);
                break;
            case "save":
                if (this.isModified_p()) {
                    if (this.checkContent_p()) {
                        var that = this;
                        var data = $("#detail-modul").serializeArray();
                        if( this.modul_id === null )
                        {
                            LITAPP.PUT("/modul", data, function(data){
                                that.modul_id = data.id;
                                that.storeFormContent_p();
                                alert("Speichern ausgeführt!");
                            });
                        }
                        else
                        {
                            LITAPP.POST("/modul/" + this.modul_id, data, function(){
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
        return this.FormContentOrg_s != $("#detail-modul").serialize();
    },
    checkContent_p: function () {
        return true;
    },
    storeFormContent_p: function () {
        this.FormContentOrg_s = $("#detail-modul").serialize();
    }
});
// EOF