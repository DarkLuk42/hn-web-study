LITAPP.ModulhandbuchView_cl = Class.create({
    initialize: function () {
        this.initList_p();

        LITAPP.es_o.subscribe_px(this, 'modulhandbuch');
    },
    notify_px: function (self, message, data_arr) {
        // unused
    },
    canClose_px: function () {
        return true;
    },
    close_px: function () {
        $("#modulhandbuch").hide();
    },
    render_px: function (studiengang_id) {
        var that = this;
        LITAPP.GET("/modulhandbuch/" + studiengang_id,function (data) {
            that.doRender_p(data)
        });
    },
    doRender_p: function (data) {
        var html = LITAPP.tm_o.execute_px("modulhandbuch", data);
        $("#modulhandbuch").remove();
        $("body .content").append(html);
        this.initList_p();
        console.log("[ModulhandbuchView_cl] doRender");
    },
    initList_p: function () {
        this.initHandler_p();
    },
    initHandler_p: function () {
        $("#modulhandbuch").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case 'back':
                LITAPP.es_o.publish_px('app', ["list-studiengang", null]);
                break;
        }
        event_opl.stopPropagation();
        event_opl.preventDefault();

    }
});
// EOF