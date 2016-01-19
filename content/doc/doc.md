# Dokumentation Praktikumsprojekt Modulhandbuch
Dokumentation vom 19.01.2016
Praktikumsgruppe: E \
Team: Lukas Quast, Frederic Wagner \


## Inhalt:
1. Einleitung
2. Implementierung des Servers
    1. REST-Interface
    2. Module
    3. Datenhaltung
3. Implementierung des Clients
    1. Klassen
    2. Eventservice
    3. Templateverarbeitung
4. Prüfung Markup und Stilregeln


## 1. Einleitung
Das Projekt "Modulhandbuch" ist eine Webanwendung mit der die Beschreibungen der Studiengänge bearbeitet und gepflegt werden können. \
Für die Bereitstellung des Servers wird das Framework **_cherrypy_** genutzt. Die Präsentation des Projektes erfolgt per **_CSS_**. \
Zum Speichern der Daten der Anwendung (Studiengänge, Module) und der Konten der Benutzer werden **_JSON_**-Dateien genutzt. \
Der Austausch von Formulardaten zwischen Client und Server erfolgt per **_AJAX_**. \
Die Anwendung berücksichtigt die Architekturprinzipien *REST* und *Single-Page-Application*. \


## 2. Implementierung des Servers
### i. REST-Interface
- Veröffentlichte Klassen mit cherrypy
- MethodDispatcher in cherrypy
- Methoden GET, POST, PUT, DELETE

####  Standardmethoden Beispiel login:
```python
class Ressource(object):
    def __init__(self, application):
        self.application = application
        self.data_file = self.application.application_dir + "/data/users.json"
        self.list = list()
        self.load()
    exposed = True

# "PUT /login"
 def PUT(self, username, password, **data):
        for user in self.list:
            if user["username"] == username:
                if user["password"] != password:
                    Validator.fail("The username or password is wrong!")
                return json.dumps(user)
        Validator.fail("The username or password is wrong!")
```

### ii. Module
#### login.py
+ Beschreibung: Stellt Login bereit und es wird überprüft ob der User über die erforderlichen Berechtigungen verfügt.
+ #### Klassen:
    -  Ressource: Klasse die die Methoden für den Login enthält.
+ #### Methoden:
    - load: Lädt die users.json-Datei zur weiteren Verarbeitung
    - PUT: Schreibt den User in die json-Datei
    - is_admin: Überprüft die Rolle des Nutzers
    - proof_admin: Überprüft, ob der Benutzer Admin-Berechtigungen besitzt.
    - is_module_admin: Überprüft die Rolle des Benutzers
    - proof_module_admin: Überprüft,ob der Benutzer Module verändern kann.

#### modul.py
+ Beschreibung: Stellt die Operationen für die Module bereit.
+ #### Klassen:
    -  Ressource: Klasse die die Methoden für die Module enthält.
+ #### Methoden:
    - load: Lädt die module.json-Datei zur weiteren Verarbeitung.
    - save: Speichert die module.json-Datei ab.
    - PUT: Ändert ein Modul.
    - GET: Ruft die Module ab.
    - POST: Fügt ein Modul hinzu.
    - DELETE: Löscht ein Modul.

#### modulhandbuch.py
+ Beschreibung: Stellt die Operationen für die Modulhandbücher bereit.
+ #### Klassen:
    -  Ressource: Klasse die die Methoden für das Modulhandbuch enthält.
+ #### Methoden:
    - GET: Ruft das Modulhandbuch ab.

#### studiengang.py
+ Beschreibung: Stellt die Operationen für die Studiengänge bereit.
+ #### Klassen:
    -  Ressource: Klasse die die Methoden für die Studiengänge enthält.
+ #### Methoden:
    - load: Lädt die coursse_of_study.json_datei zur weiteren Verarbeitung.
    - save: Speichert die course_of_study.json-Datei.
    - PUT: Ändert einen Studiengang.
    - GET: Ruft die Studiengänge ab.
    - POST: Erstellt einen Studiengang.
    - DELETE: Löscht einen Studiengang.

#### lehrveranstaltung.py
+ Beschreibung: Stellt die Operationen für die Lehrveranstaltungen bereit.
+ #### Klassen:
    -  Ressource: Klasse die die Methoden für die Lehrveranstaltungen enthält.
+ #### Methoden:
    - PUT: Ändert eine Lehrveranstaltung.
    - GET: Ruft die Lehrveranstaltungen ab.
    - POST: Erstellt eine Lehrveranstaltung.
    - DELETE: Löscht eine Lehrveranstaltung.

#### template.py
+ Beschreibung: Stellt die Operationen für die Templates bereit
+ #### Klassen:
    -  Ressource: Klasse die die Methoden für die Templates enthält.
+ #### Methoden:
    - load: Lädt die Dateien zur weiteren Verarbeitung.
    - GET: Ruft das Template ab.

#### application.py
+ Beschreibung: Stellt weitere Operationen für die Anwendung bereit.
+ #### Klassen:
    -  Application: Klasse die weitere Methoden für die Anwendung enthält.
+ #### Methoden:
    - is_admin: Weitergeleitete Methode von login.
    - proof_admin: Weitergeleitete Methode von login.
    - is_module_admin: Weitergeleitete Methode von login.
    - proof_module_admin: Weitergeleitete Methode von login.
    - response: Erstellt Daten.
    - handle_error: Methode zur eigenen Fehlerbehandlung.
    - default: Default-Methode, die eine unbekannte Anforderung verarbeitet.

#### validator.py
+ Beschreibung:Stellt Operationen zum Validieren der Eingaben bereit.
+ #### Klassen:
    - Validator: Stellt Methoden zur Überprüfung bereit.
+ #### Methoden:
    - require: Überprüft den Inhalt eines Feldes
    - fail: Gibt den Fehler zurück.
    - fail_found: Gibt den HTTP-Fehlercode zurück.

#### Zusammenwirken der Module:
+ Methoden von Login werden an die Application weitergeleitet. Mit Validator werden die Feldeingaben überprüft. \
Die Studiengänge setzen sich aus den Lehrvveranstaltungen mit Modulen zusammen. \


### iii. Datenhaltung
**_In JSON-Datei als Dictionary-Struktur wie folgt:_**

#### Module:
```json
[
    {
        "alias": "VSY",
        "coursecount": 2,
        "creditpoints": 1,
        "deleted": false,
        "description": "",
        "id": 18,
        "name": "Verteilte Systeme"
    },
    {
        "alias": "WEB",
        "coursecount": 3,
        "creditpoints": 1,
        "deleted": false,
        "description": "",
        "id": 19,
        "name": "Web-Engineering"
    }
 ]
```

#### Studiengänge:
```json
[
  {
        "alias": "BaE",
        "courses": [
            {
                "modul_id": 3,
                "name": "E",
                "semester": 1
            },
            {
                "modul_id": 5,
                "name": "E",
                "semester": 1
            }
        ],
        "deleted": false,
        "id": 1,
        "name": "Bachelor Elektrotechnik",
        "semesters": 5
  }
]
```

#### User:
```json
[
    {
        "username": "admin",
        "password": "012345",
        "role": "ADMIN"
    },
    {
        "username": "mod_1",
        "password": "012345",
        "role": "MODULE_ADMIN",
        "module": [1]
    }
]
```
## 3. Implementierung des Clients

### i. Klassen
- EventService_cl: \
    Klasse des EventService, wo Funktionen zum abonnieren und deabonnieren, sowie verbreiten an alle Abonnenten implementiert sind.
- LehrveranstaltungDetailView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern der Einzelansicht der Lehrveranstaltungen nötig sind und die Aktionen auf der Seite verwalten.
- LehrveranstaltungListView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern der Übersicht der Lehrveranstaltungen nötig sind und die Aktionen auf der Seite verwalten.
- LoginView_cl: \
    Die Klasse stellt die Methoden zum hunzufügen des Login-Bereiches bereit und verwaltet die Login-beogenenen Aktionen
- ModulDetailView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern der Einzelansicht der Module nötig sind und die Aktionen auf der Seite verwalten.
- ModulhandbuchView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern des Modulhandbuchs nötig sind und die Aktionen auf der Seite verwalten.
- ModulListView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern der Modulübersicht nötig sind und die Aktionen auf der Seite verwalten.
- Application_cl: \
    Die Klasse stellt Methoden für die Fallunterscheidung der Events bereit sowie die Bereitstellung des Contents.
- StudiengangDetailView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern der Einzelansicht des jeweiligen Studiengangs nötig sind und die Aktionen auf der Seite verwalten.
- StudiengangListView_cl: \
    Die Klasse stellt die Methoden bereit, die zum rendern der Übersicht der Studiengänge nötig sind und die Aktionen auf der Seite verwalten.

### ii. Eventservice
Der Event-Service ist der asynchrone, Clientseitige Austausch von Daten bzw. Events zwischen Javascript-Komponenten. \
Die Fallunterscheidung dient dazu, je nach Aufruf die richtige Aktion auszuführen und eventuell Daten zu parsen. \

#### Beispiel:
```javascript
case 'templates.loaded':
    LITAPP.es_o.publish_px('app', ["login"]);
    break;
case 'login':
    self.setContent_p(self.loginView_o, null);
    break;
case 'list-studiengang':
    self.setContent_p(self.studiengangListView_o, null);
    break;
```

### iii. Templateverarbeitung
Die verwendeten Templates werden durch javascript gerendert und befüllt.

#### Beispiel Rendern eines Template:
```javascript
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
    }
```

## 4. Prüfung Markup und Stilregeln
- Überprüfung des Markups mittels der w3c-Validator-Dienste: **Erfolgreich**
- Überprüfung des CSS mittels der w3c-Validator-Dienste: **Erfolgreich**