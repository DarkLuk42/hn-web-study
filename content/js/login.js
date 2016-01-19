LITAPP.LoginView_cl = Class.create({
    initialize: function () {
        this.initList_p();
    },
    canClose_px: function () {
        return true;
    },
    close_px: function () {
        $("#login").hide();
    },
    render_px: function () {
        this.doRender_p();
    },
    doRender_p: function () {
        var html = LITAPP.tm_o.execute_px("login");
        $("#login").remove();
        $("body .content").append(html);
        this.initList_p();
        console.log("[LoginView_cl] doRender");
    },
    initList_p: function () {
        this.initHandler_p();
    },
    initHandler_p: function () {
        $("#login").on("click", "button", $.proxy(this.onClickButtons_p, this));
    },
    onClickButtons_p: function (event_opl) {
        var action_s = $(event_opl.target).attr("data-action");
        switch (action_s) {
            case 'login':
                LITAPP.PUT( "/login", $("#login").serializeArray(), function(data){
                    window.user = data.role;
                    window.user_id = data.id;
                    LITAPP.es_o.publish_px('app', ["list-studiengang"]);
                    alert("Du hast dich erfolgreich eingeloggt!");
                });
                break;
        }
        event_opl.stopPropagation();
        event_opl.preventDefault();

    }
});
// EOF