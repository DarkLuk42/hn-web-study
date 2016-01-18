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

### ii. Module

### iii. Datenhaltung
**_In JSON-Datei als Dictionary-Struktur wie folgt:_**

### Module:
```json
{

}
```

### Studiengänge:
```json
{

}
```

### User:
```json
{
  "user": {
      "name": "User",
      "password": "012345",
      "role": "USER"
  }
}
```
## 3. Implementierung des Clients

### i. Klassen

### ii. Eventservice

### iii. Templateverarbeitung

## 4. Prüfung Markup und Stilregeln
- Überprüfung des Markups mittels der w3c-Validator-Dienste: **Erfolgreich**
- Überprüfung des CSS mittels der w3c-Validator-Dienste: **Erfolgreich**

## API:
+ `/login`
    - required parameters - (`user`, `password`)
+ `/logout`
+ `/create_user`
    - required parameters - (`alias`, `role`, `name`, `password`)
+ `/update_user`
    - required parameters - (`alias`, `role`, `name`)
    - optional parameters - (`password`)
+ `/delete_user`
    - required parameters - (`alias`)
+ `/create_theme`
    - required parameters - (`name`)
+ `/create_discussion`
    - required parameters - (`theme`, `title`, `article_title`, `content_title`)
+ `/update_discussion`
    - required parameters - (`theme`, `discussion`, `title`)
+ `/delete_discussion`
    - required parameters - (`theme`, `discussion`)
+ `/create_article`
    - required parameters - (`theme`, `discussion`, `title`, `content`)
+ `/update_article`
    - required parameters - (`theme`, `discussion`, `article`, `title`, `content`)
+ `/delete_article`
    - required parameters - (`theme`, `discussion`, `article`)

## Server-Konfiguration
- Statisches Verzeichnis
- Sessions erlaubt, Session-Storage, Session Verzeichnis
- Kodierung: UTF-8

```python
{
 '/': {

            'tools.staticdir.root': current_dir,
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './content',
            'tools.sessions.on': True,
            'tools.sessions.storage_type': "File",
            'tools.sessions.storage_path': './data/sessions',
            'tools.sessions.timeout': 10,
            'tools.encode.on': True,
            'tools.encode.encoding': "utf-8",
            'request.error_response': Application.handle_error,
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
      }
}
```

