
// !!! hier: 

// package.json aktualisieren
// Wortkomponente erstellen, einzelne Wortseite
// Wortsurfen
// Delete, Edit, Select-Button in Suchtabelle
// Satzsuche verbessern (Wortsuche verstehen, Wildcard *)
// Button alle Satze und Suchfeld
// Benutzerrollen (Admin, User, Guest)
// Benutzer in Suche einfügen
// merge resolvers
// AddSatz beschleunigen: Spinner, Optimistic Rendering, Network

// Satztypen als Collection, mehr Farben
// Satzüberschtift wie Satz formatieren

// Alle Komponenten faltbar
// Authentifizierung über middleware absichern
// Wechsel zwischen Suchtabelle und Wortsurfen
// Farbcode für Satztypen (Überblick hell, Details dunkel)
// ganzer Satz als Wort?, camelCase Wort trennen und wieder zusammenfügen
// embed Satz in Wort? https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/
// mit bspdaten testen
// bspdaten import
// WKR = Wort-Kettenreaktion, Selektion (Suche), Amplifikation + Mutation (Ausweitung auf ähnliche Wörter oder andere Satzmitglieder)
// Zahlfunktion

// Fehler:
// Promise als Argument schwierig -> Argument destrukturieren
// Set mit gleichen Object -> Set mmit primitiven Werten oder anderer Objektvergleich
// log von Promises nicht direkt möglich
// wenn etwas funktioniert, sofort (!) abspeichern
// ? import { getDefaultSettings } from "http2";

Korrespondierende Felder:

Satz - Wort
wort - satz (Überschrift, Überblick)
worte - satze (Inhalt, Details)
worteIf - satzeIf (Gültigkeitsbedingung)



Identische Felder:

Satz - Wort
_id - satz
wort.wort - wort
wort.typ - typ
wort - _id


Wort: 
Satzüberschrift (Satz.wort, Wort.satz) oder 
Satzinhalt (Satz.worte, Wort.satze) oder 
Bedingung (Satz.worteIf, Wort.satzeIf)

Wort in einem Satz die Überschrift, in anderem der Inhalt, im nächsten die Bedingung

keine Synonyme, jedes Wort ist einzigartig
Jeder Satz besteht aus mehreren Worten und ggf. einer Überschrift und besitzt einen Satztyp
