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
    render_px: function (data) {
        console.log(data);
        var template = data.template;
        if( data.data.path )
        {
            var that = this;
            $.ajax({
                    dataType: "json",
                    url: data.data.path,
                    type: 'GET'
                })
                .done(function(data_result){
                    data.data.data = data_result;
                    that.doRender_p(template, data.data)
                })
                .fail(function (error) {
                    LITAPP.es_o.publish_px('app', ['error', error]);
                });
        }
        else
        {
            this.doRender_p(template, data.data)
        }
    },
    doRender_p: function (template, data) {
        var html = LITAPP.tm_o.execute_px(template, data);
        $("#idDetail").remove();
        $("body .content").append(html);
        this.initHandler_p();
        this.storeFormContent_p();
        $("#idDetail").show();
    },
    initHandler_p: function () {
        $("#idDetail").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case "back":
                LITAPP.es_o.publish_px('app', [action_s, null]);
                break;
            case "save":
                if (this.isModified_p()) {
                    if (this.checkContent_p()) {
                        var that = this;
                        $.ajax({
                                context: this,
                                dataType: "json",
                                data: $("#idDetail").serializeArray(),
                                url: $("#idDetail").attr("action"),
                                type: $("#idDetail").attr("method")
                            })
                            .done(function (data) {
                                if( $("#idDetail").attr("method").toUpperCase() == "PUT" )
                                {
                                    $("#idDetail").attr("method", "POST");
                                    $("#idDetail").attr("action", $("#idDetail").attr("action") + "/" + data.id)
                                }
                                that.storeFormContent_p();
                                alert("Speichern ausgeführt!");
                            })
                            .fail(function (error) {
                                LITAPP.es_o.publish_px('app', ['error', error]);
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
        return true;
    },
    storeFormContent_p: function () {
        this.FormContentOrg_s = $("#idDetail").serialize();
    }
});
// EOF