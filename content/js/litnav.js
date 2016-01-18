// ----------------------------------------------
// Beispiel lit-8
// litnav.js
// ----------------------------------------------

// ----------------------------------------------
LITAPP.Nav_cl = Class.create({
// ----------------------------------------------
   initialize: function () {
      // zur Vereinfachung hier direkt den Inhalt des
      // Navigationsbereichs anzeigen und die Ereignisverarbeitung einrichten
      this.render_px();
      this.initHandler_p();
   },
   render_px: function (data_opl) {
      // Parameter data_opl wird hier nicht benötigt
      // feste Voragben berücksichtigen
      var markup_s = '<a href="#" data-action="list">Liste</a> ' +
                     '<a href="#" data-action="add">Hinzufügen</a>';
      $('#idNav').html(markup_s);
   },
   initHandler_p: function () {
      // Ereignisverarbeitung für die Schalter einrichten

      $("#idNav").on("click", "a", function (event_opl) {
         var action_s = $(event_opl.target).attr('data-action');
         // Weiterleitung! Das Nav-Objekt ist nicht für die Bearbeitung direkt verantwortlich
         LITAPP.es_o.publish_px('app', [action_s, null]);

         // Weiterleitung und Standardbearbeitung unterbinden
         event_opl.stopPropagation();
         event_opl.preventDefault();
      });
   }
});

// EOF