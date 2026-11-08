# Website Rinalds – Inhaltspflege und Übergabe

> Entwurf für das Übergabegespräch. Die Angaben zu Hosting und Veröffentlichung am Ende sind noch zu ergänzen. Die Dateibeschreibungen beziehen sich auf den aktuellen Stand im Repository.

Diese Anleitung hilft Rinalds, auch später Inhalte ändern zu lassen oder selbst kleinere Änderungen vorzunehmen. Sie zeigt, wo Texte und Bilder liegen, welche Technologien verwendet werden und was ein anderer Entwickler für die Weiterarbeit benötigt.

## 1. Wo liegt die Website und wie ist sie aufgebaut?

Der Quellcode liegt im GitHub-Repository [website-rinalds](https://github.com/lekrau/website-rinalds). Ein Repository ist der Projektordner mit seiner Änderungshistorie. Der Zugriff für Rinalds wird bei der Übergabe geklärt.

Die Website besteht aus statischen Dateien:

| Technologie | Aufgabe | Bei der Inhaltspflege relevant? |
| --- | --- | --- |
| HTML (`.html`) | Texte, Überschriften, Bilder und Links sowie die Struktur der Seiten | Hier werden Inhalte geändert. |
| CSS (`.css`) | Farben, Abstände, Schriftgrößen und Anordnung auf großen und kleinen Bildschirmen | Bei reinen Text- oder Bildwechseln meist unverändert. |
| JavaScript (`script.js`) | Interaktionen wie mobiles Menü, FAQ-Wechsel, Kopieren von Kontaktdaten und Laden des Terminkalenders | Bei reiner Inhaltspflege normalerweise unverändert. |

HTML ist eine Auszeichnungssprache, CSS eine Stylesheet-Sprache und JavaScript die verwendete Programmiersprache. Es gibt derzeit kein Redaktionssystem (CMS), keinen administrativen Bearbeitungsbereich und kein eigenes Backend mit Datenbank. Inhalte werden direkt in den HTML-Dateien gepflegt.

## 2. Welche Datei enthält welchen Inhalt?

| Gewünschte Änderung | Datei und Suchbegriff im Code-Editor |
| --- | --- |
| Hauptüberschrift und großes Bild der Landingpage | [index.html](index.html), nach `class="hero"` suchen |
| Die drei Schritte auf der Landingpage | [index.html](index.html), nach `id="process"` suchen |
| Fragen und kurze Antworten auf der Landingpage | [index.html](index.html), nach `id="FAQ"` suchen |
| Kontaktbereich und eingebetteter Terminkalender | [index.html](index.html), nach `id="contact"` suchen |
| Einleitung der Blogübersicht | [blog.html](blog.html), nach `class="overview-intro"` suchen |
| Titel, Vorschaubilder und Kurztexte der Blogbeiträge | [blog.html](blog.html), nach `class="article-preview"` suchen |
| Artikel „Wie viel Geld bekomme ich?“ | [wie-viel-geld-bekomme-ich.html](wie-viel-geld-bekomme-ich.html), nach `class="article-body"` suchen |
| Artikel „Ist das legal?“ und „Wer sind wir?“ | [ist-das-legal.html](ist-das-legal.html) und [wer-sind-wir.html](wer-sind-wir.html); derzeit einfache TBD-Platzhalterseiten |
| Porträt, Name und Kontaktdaten in den Seitenleisten | [blog.html](blog.html) und [wie-viel-geld-bekomme-ich.html](wie-viel-geld-bekomme-ich.html), nach `class="overview-sidebar"` suchen |
| Impressum und Datenschutz | [impressum.html](impressum.html) und [datenschutz.html](datenschutz.html); derzeit Platzhalter |

Die Landingpage ist die Startseite `index.html`. Die Blogübersicht und die einzelnen Artikel sind eigenständige Seiten. Ihre Inhalte werden nicht automatisch miteinander abgeglichen.

## 3. Kleine Inhaltsänderungen durchführen

### Vorbereitung und Vorschau

1. Den aktuellen Projektordner beschaffen und vor der Bearbeitung eine Sicherung anlegen beziehungsweise mit Git einen nachvollziehbaren Ausgangsstand festhalten.
2. Den gesamten Ordner in einem Code-Editor öffnen. Nicht mit einem Textverarbeitungsprogramm wie Word bearbeiten.
3. `index.html` im Browser öffnen. Für eine erste Inhaltsvorschau reicht ein Doppelklick. Nach dem Speichern einer Änderung die Browserseite neu laden.
4. Nur die gewünschte Stelle bearbeiten und die Änderung anschließend prüfen. Das Veröffentlichen ist ein separater Schritt; lokal gespeicherte Änderungen sind dadurch noch nicht online.

Extern geladene Bilder und der Terminkalender benötigen eine Internetverbindung. Für die abschließende Funktionsprüfung die vom Entwickler eingerichtete lokale Vorschau oder die Testwebsite verwenden; einzelne Browserfunktionen können sich beim direkten Öffnen einer Datei anders verhalten.

### Texte auf der Landingpage ersetzen

In `index.html` nach dem sichtbaren Text oder dem Suchbegriff aus der Tabelle suchen. Beispielsweise steht unter einem der drei Schritte:

```html
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
```

Für einen neuen Absatztext nur den Inhalt zwischen `<p>` und `</p>` ersetzen:

```html
<p>Hier steht der neue Beschreibungstext für diesen Schritt.</p>
```

Die HTML-Markierungen und ihre Attribute bleiben bei einem reinen Textwechsel erhalten. Das gilt besonders für `class`, `id`, `aria-controls` und `aria-labelledby`: Sie verbinden Inhalte mit Gestaltung, Navigation und Bedienfunktionen. Ein `&` im normalen Text als `&amp;` schreiben, zum Beispiel `Fragen &amp; Antworten`.

Bei den Startseiten-FAQ stehen die Frage im jeweiligen `<button>` und die Antwort im zugehörigen Bereich mit `role="tabpanel"`. Bei einer Umbenennung auch die Überschrift im Antwortbereich prüfen. Die Antwortbereiche gehören über `aria-controls` und `id` zu ihren Tabs; diese Kennungen für reine Textänderungen beibehalten.

### Blogbeiträge bearbeiten

Für den vorhandenen Artikel „Wie viel Geld bekomme ich?“ gibt es mehrere getrennte Textstellen:

- **Artikel selbst:** In `wie-viel-geld-bekomme-ich.html` stehen der Titel bei `id="artikel-titel"`, die Einleitung bei `class="lead"` und die Abschnitte bei `class="article-body"`.
- **Vorschau in der Blogübersicht:** Titel und Kurzbeschreibung in `blog.html` separat anpassen.
- **Kurzantwort auf der Landingpage:** Falls dieselbe Aussage betroffen ist, den zugehörigen FAQ-Bereich in `index.html` ebenfalls anpassen.

Bei einer Titeländerung außerdem den Seitentitel zwischen `<title>` und `</title>` und die sichtbare Bezeichnung in der Brotkrümelnavigation prüfen. Das Inhaltsverzeichnis des Artikels ist manuell geschrieben. Bei geänderten Abschnittsüberschriften seine Beschriftungen mitpflegen; bei neuen oder entfernten Abschnitten auch die Verweise anpassen.

Für einen zusätzlichen Artikel kann ein Entwickler die bestehende Artikelseite als Vorlage verwenden, eine neue HTML-Datei anlegen und die Vorschau in `blog.html` ergänzen. Die einfachen TBD-Seiten enthalten noch kein vollständiges Artikellayout.

### Bilder ersetzen, ohne die Position zu ändern

Bilder werden über `<img>` eingebunden. Beispielsweise steht das Porträt auf den Blogseiten so im Code:

```html
<img class="advisor-portrait" src="https://up.picr.de/51383293hs.png"
    alt="Porträt-Platzhalter für Rinalds" width="320" height="360">
```

Für einen Bildwechsel `src` durch die Adresse des neuen Bildes ersetzen und `alt` als passende kurze Bildbeschreibung aktualisieren. Leere Beschreibungen (`alt=""`) bei rein dekorativen Bildern können leer bleiben. Klasse und umgebende HTML-Struktur erhalten die Position im Layout.

Die meisten Bilder liegen aktuell bei externen Bilddiensten, insbesondere auf `up.picr.de` und `images.unsplash.com`. Sie sind keine im Repository gespeicherten Bilddateien. Der neue `src`-Wert muss auf eine Bilddatei zeigen, nicht auf eine Freigabe- oder Vorschauseite.

Alternativ können Bilder im Projekt gespeichert werden, etwa als `images/portraet.jpg`; dann diesen relativen Pfad als `src` verwenden und den Bildordner mit veröffentlichen. Ein lokaler Pfad wie `/Users/...` funktioniert auf der veröffentlichten Website nicht.

Ein ähnliches Seitenverhältnis hilft, den vorgesehenen Bildausschnitt zu erhalten. Bei abweichenden Bildproportionen kann eine Anpassung der Größenangaben oder des Zuschnitts nötig werden. Anschließend auf großem und kleinem Bildschirm prüfen. Ein mehrfach verwendetes Bild, beispielsweise das Logo, muss an allen betroffenen Stellen ersetzt werden.

### Kontaktdaten und Terminlinks ändern

Kontaktdaten sind an mehreren Stellen direkt eingetragen: im Kontaktbereich und Footer der Landingpage, in den Seitenleisten der Blogseiten sowie gegebenenfalls auf den rechtlichen Seiten. Im Projekt nach dem alten Wert suchen und die Fundstellen einzeln prüfen.

Bei einem Kopierbutton müssen **sichtbarer Text**, **`data-copy-value`** und die anfängliche **`aria-label`-Beschriftung** zusammenpassen. Nur den sichtbaren Text zu ändern reicht nicht: Der Button würde sonst weiterhin den alten Wert kopieren.

- WhatsApp: Auch das Linkziel mit `https://wa.me/...` aktualisieren.
- E-Mail: Auch die Adresse nach `mailto:` im Linkziel aktualisieren.
- Calendly: Die Terminadresse steht in `index.html` sowohl in `data-url` des Widgets als auch im Ersatzlink. Bei einem Wechsel beide Stellen anpassen und die vorhandenen URL-Parameter des Widgets berücksichtigen.

## 4. Änderungen prüfen und veröffentlichen

Vor der Veröffentlichung die geänderten Seiten im Browser kontrollieren:

- Stimmen Texte, Bilder und Links? Sind auch Vorschautexte und wiederholte Angaben aktualisiert?
- Bleibt das Layout bei schmalem und breitem Browserfenster lesbar, insbesondere bei längeren Texten und neuen Bildern?
- Funktionieren mobiles Menü, FAQ-Wechsel, Inhaltsverzeichnis und Kopierbuttons weiterhin? Bei geänderten Kontaktdaten den tatsächlich kopierten Wert prüfen.
- Stimmen Terminlink und Kalenderziel? Falls der eingebettete Kalender nicht lädt, lässt sich der Ersatzlink öffnen?

Danach die Änderung nachvollziehbar in Git sichern und über den bei der Übergabe festgelegten Veröffentlichungsweg bereitstellen. Abschließend die tatsächlich veröffentlichte Website prüfen. Wie Dateien auf den Webserver gelangen, ist in diesem Repository derzeit nicht dokumentiert und muss vor der Übergabe ergänzt werden.

## 5. Technische Orientierung für einen nachfolgenden Entwickler

Das Projekt verwendet HTML, CSS und JavaScript ohne Framework, Paketinstallation oder Build-Schritt. Es kann von einem Webserver als statische Website ausgeliefert werden. Seitenübergreifend wiederholte Bereiche wie Header und Kontaktdaten sind direkt in den jeweiligen HTML-Dateien enthalten; es gibt derzeit keine gemeinsame Template-Datei.

### Gestaltung

| Datei | Zuständigkeit |
| --- | --- |
| [reset.css](reset.css) | Gemeinsame Browser-Grundformatierung |
| [styles.css](styles.css) | Zentrale Gestaltungsvariablen, gemeinsame Komponenten und Landingpage |
| [knowledge.css](knowledge.css) | Gemeinsame Gestaltung der Blog- und rechtlichen Seiten |
| [blog.css](blog.css) | Blogübersicht |
| [article.css](article.css) | Artikellayout |
| [legal.css](legal.css) | Rechtliche Seiten |
| [tbd.css](tbd.css) | Einfache Artikel-Platzhalterseiten |

[tbd.html](tbd.html) ist eine zusätzliche generische Platzhalterseite mit eigenem Inline-CSS.

### JavaScript

[script.js](script.js) wird auf den ausgebauten Seiten mit `defer` geladen. Die fünf Initialisierungsaufrufe stehen am Dateianfang; die Hilfsfunktionen liegen innerhalb des jeweiligen Bereichs:

| Funktion | Aufgabe |
| --- | --- |
| `setupCalendly()` | Kalender laden und bei Ladeproblemen den Ersatzlink anzeigen |
| `setupSectionNavigation()` | Aktiven Abschnitt in der Kopfzeilennavigation markieren und die gemessene Headerhöhe bereitstellen |
| `setupMobileMenu()` | Mobiles Menü einschließlich Escape-Taste und Zurücksetzen beim Größenwechsel |
| `setupFaqTabs()` | Startseiten-FAQ einschließlich Tastaturbedienung und Direktlinks |
| `setupClipboardButtons()` | Kontaktdaten kopieren und Rückmeldung anzeigen |

Der Menü-Breakpoint von 700 Pixeln steht sowohl im CSS als auch in `setupMobileMenu()` und muss bei einer Änderung abgestimmt werden. Calendly wird als externes Script von `assets.calendly.com` nachgeladen. Der Videobereich im vorhandenen Artikel ist derzeit eine verlinkte Vorschau zur YouTube-Startseite, kein eingebetteter Videoplayer.

### Lokale Vorschau und vorhandene Prüfungen

Optional kann im Projektordner mit installiertem Python 3 ein lokaler Webserver gestartet werden:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Die Vorschau ist anschließend unter `http://127.0.0.1:8000/` erreichbar. Beenden mit `Strg+C` im Terminal.

Für die vorhandenen automatisierten Prüfungen wird Node.js mit Unterstützung für `node:test` benötigt. Eine Paketinstallation ist nicht erforderlich:

```sh
node --check script.js
node --test tests/navigation.test.cjs
```

Die Tests prüfen die aktive Abschnittsnavigation in einer simulierten Browserumgebung. Sie ersetzen keine Browserprüfung von Layout, Menü, FAQ, Kopierfunktion und Calendly.

## 6. Vor der endgültigen Übergabe ergänzen

| Angabe | Übergabestand |
| --- | --- |
| Live-Adresse und gegebenenfalls Testwebsite | Noch einzutragen |
| Hostinganbieter und zuständiges Konto | Noch einzutragen |
| Domainanbieter und zuständiges Konto | Noch einzutragen |
| Zugriff von Rinalds auf Repository und aktuelle Projektdateien | Noch zu bestätigen |
| Veröffentlichungsweg einschließlich Rückkehr zum vorherigen Stand | Noch zu dokumentieren |
| Zuständiges Calendly-Konto und bestätigte Terminadresse | Noch zu bestätigen |
| Ablage und Zugriff auf finale Bilder beziehungsweise Originaldateien | Noch einzutragen |

Zugangsdaten über einen getrennten sicheren Weg übergeben; sie gehören nicht in diese README.

Der aktuelle Quellcode enthält noch Platzhaltertexte, externe Platzhalterbilder, zwei TBD-Artikelseiten sowie unvollständige Inhalte für Impressum und Datenschutz. Bei der endgültigen Übergabe den tatsächlichen Stand hier aktualisieren.

Für eine spätere Beauftragung genügt als technischer Einstieg: „Die Website ist eine statische HTML-/CSS-/JavaScript-Website ohne CMS und Build-Schritt. Texte und Bilder werden direkt in den HTML-Dateien gepflegt. Der Quellcode und die Pflegehinweise liegen im Repository website-rinalds.“ Dazu benötigt der neue Entwickler Zugriff auf den aktuellen Code und die Informationen zum Hosting und zur Veröffentlichung.
