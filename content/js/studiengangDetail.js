LITAPP.StudiengangDetailView_cl = Class.create({
    initialize: function () {
        $("#detail-studiengang").hide();
        this.studiengang_id = null;
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
        $("#detail-studiengang").hide();
    },
    render_px: function (studiengang_id) {
        if( typeof( studiengang_id ) != "undefined" && studiengang_id !== null )
        {
            this.studiengang_id = studiengang_id;
            var that = this;
            LITAPP.GET("/studiengang/"+studiengang_id, function(data){
                that.doRender_p(data)
            });
        }
        else
        {
            this.studiengang_id = null;
            this.doRender_p(null)
        }
    },
    doRender_p: function (data) {
        if( data !== null ) {
            data.id = this.studiengang_id;
        }
        var html = LITAPP.tm_o.execute_px("detail-studiengang", data);
        $("#detail-studiengang").remove();
        $("body .content").append(html);
        this.initHandler_p();
        this.storeFormContent_p();
        $("#detail-studiengang").show();
    },
    initHandler_p: function () {
        $("#detail-studiengang").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case "back":
                LITAPP.es_o.publish_px('app', ["list-studiengang", null]);
                break;
            case "save":
                if (this.isModified_p()) {
                    if (this.checkContent_p()) {
                        var that = this;
                        var data = $("#detail-studiengang").serializeArray();
                        if( this.studiengang_id === null )
                        {
                            LITAPP.PUT("/studiengang", data, function(data){
                                that.studiengang_id = data.id;
                                that.storeFormContent_p();
                                alert("Speichern ausgeführt!");
                            });
                        }
                        else
                        {
                            LITAPP.POST("/studiengang/" + this.studiengang_id, data, function(){
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
        return this.FormContentOrg_s != $("#detail-studiengang").serialize();
    },
    checkContent_p: function () {
        return true;
    },
    storeFormContent_p: function () {
        this.FormContentOrg_s = $("#detail-studiengang").serialize();
    }
});
// EOF