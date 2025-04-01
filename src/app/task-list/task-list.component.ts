// Importe: Wie Werkzeuge in die Werkstatt holen
import { Component, OnInit } from '@angular/core'; // Kern-Werkzeuge von Angular
import { FormsModule } from '@angular/forms';      // Spezielles Werkzeug für Formulare ([(ngModel)])
import { CommonModule } from '@angular/common';    // Werkzeugkiste für *ngIf, *ngFor (alte Syntax), Pipes, etc. (hier evtl. für [ngClass] o.ä. nützlich)

// Interface Task: Ein Bauplan für unsere Daten
interface Task { // Definiert, wie ein einzelnes "Task"-Objekt aussehen MUSS
  id: number;    // Eindeutige Nummer
  text: string;   // Der Text der Aufgabe
  completed: boolean; // Status: erledigt (true) oder nicht (false)
}
// -> Das hilft uns, Fehler zu vermeiden und macht den Code lesbarer.

@Component({ // @Component: Der Bauplan für die Angular-Komponente selbst
  selector: 'app-task-list', // CSS-Selektor: So wird die Komponente im HTML verwendet (<app-task-list></app-task-list>)
  standalone: true,         // Modernes Angular: Die Komponente ist eigenständig, braucht kein extra NgModule
  imports: [                // Welche Werkzeuge (Module) braucht DIESE Komponente direkt in ihrem Template?
    FormsModule,            // Benötigt für [(ngModel)] im Input-Feld
    CommonModule            // Sicher ist sicher, oft für Direktiven wie [ngClass] oder Pipes gebraucht
  ],
  templateUrl: './task-list.component.html', // Verweis auf die HTML-Datei (das Gesicht)
  styleUrls: ['./task-list.component.css']   // Verweis auf die CSS-Datei (spezielle Anpassungen)
})
// Die Klasse: Hier passiert die eigentliche Arbeit
export class TaskListComponent implements OnInit { // 'implements OnInit' verspricht: Wir haben eine ngOnInit-Methode

  // --- Eigenschaften (Properties): Die Daten der Komponente ---

  private localStorageKey = 'angularTasks_v1'; // Privater Schlüssel für den Speicherort im Browser
                                             // 'private' heißt: Nur innerhalb DIESER Klasse sichtbar

  tasks: Task[] = []; // Das Herzstück: Ein Array (Liste), das unsere Task-Objekte speichert.
                      // Startet leer, wird aus localStorage gefüllt. `Task[]` sagt: Hier dürfen nur Objekte rein, die dem Task-Interface entsprechen.

  newTaskText: string = ''; // Textvariable, die an das Input-Feld gebunden ist. Startet leer.

  private nextId: number = 1; // Zähler für die nächste freie ID. Startet bei 1.

  // --- Lebenszyklus-Hook: Ein besonderer Moment im Leben der Komponente ---

  ngOnInit(): void { // ngOnInit() wird EINMALIG ausgeführt, wenn Angular die Komponente "gebaut" und startklar gemacht hat.
    console.log('TaskListComponent wird initialisiert!'); // Gut für Debugging
    this.loadTasks();         // Lade gespeicherte Aufgaben, sobald die Komponente bereit ist.
    this.calculateNextId();   // Berechne die nächste ID basierend auf den geladenen Aufgaben.
  }

  // --- Private Methoden: Interne Hilfsfunktionen ---

  private loadTasks(): void { // Lädt Aufgaben aus dem Browser-Speicher
    if (typeof localStorage !== 'undefined') { // Sicherheitscheck: Gibt es localStorage überhaupt?
      const storedTasks = localStorage.getItem(this.localStorageKey); // Hole den String unter unserem Schlüssel
      if (storedTasks) { // Wurde etwas gefunden?
        try { // Versuche...
          this.tasks = JSON.parse(storedTasks); // ...den String in ein JavaScript-Array zurückzuverwandeln
          if (!Array.isArray(this.tasks)) { // Zusätzlicher Check: Ist es wirklich ein Array?
              console.warn('Geladene Daten aus localStorage sind kein Array. Setze zurück.');
              this.tasks = [];
          }
        } catch (e) { // Falls das Parsen fehlschlägt (z.B. Daten kaputt)...
          console.error('Fehler beim Parsen der Tasks aus localStorage:', e);
          this.tasks = []; // ...starte mit einer leeren Liste.
        }
      } else { // Nichts im Speicher gefunden...
        this.tasks = []; // ...starte mit leerer Liste.
      }
    } else { // localStorage nicht verfügbar...
        console.warn('localStorage ist nicht verfügbar.');
        this.tasks = []; // ...starte mit leerer Liste.
    }
  }

  private saveTasks(): void { // Speichert die aktuelle Aufgabenliste im Browser
     if (typeof localStorage !== 'undefined') { // Wieder der Sicherheitscheck
        try { // Versuche...
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks)); // Wandle das 'tasks'-Array in einen String um und speichere es.
        } catch (e) { // Falls Speichern fehlschlägt (z.B. Speicher voll)...
            console.error('Fehler beim Speichern der Tasks im localStorage:', e);
            // Hier könnte man den Nutzer informieren.
        }
     }
  }

  private calculateNextId(): void { // Findet die nächste freie ID
    if (this.tasks.length > 0) { // Nur wenn schon Aufgaben da sind...
      // 1. `this.tasks.map(t => t.id)`: Erzeugt ein neues Array nur mit den IDs [1, 5, 2]
      // 2. `Math.max(...[1, 5, 2])`: Findet die größte Zahl (5)
      // 3. `...` (Spread Operator): Entpackt das Array für Math.max
      const maxId = Math.max(...this.tasks.map(t => t.id));
      this.nextId = maxId + 1; // Die nächste ID ist die höchste + 1 (6)
    } else { // Wenn keine Aufgaben da sind...
      this.nextId = 1; // ...fangen wir bei 1 an.
    }
  }

  // --- Öffentliche Methoden: Reaktionen auf Benutzeraktionen (aus dem HTML aufgerufen) ---

  addTask(): void { // Fügt eine neue Aufgabe hinzu
    const text = this.newTaskText.trim(); // Holt Text aus der gebundenen Variable, entfernt Leerzeichen vorn/hinten
    if (text) { // Nur wenn Text vorhanden ist...
      this.tasks.push({ // Füge ein neues Task-Objekt zum 'tasks'-Array hinzu
        id: this.nextId++, // Weise die aktuelle 'nextId' zu UND erhöhe sie direkt für den nächsten Aufruf
        text: text,
        completed: false // Neue Aufgaben sind standardmäßig nicht erledigt
      });
      this.newTaskText = ''; // Setze das Input-Feld (über die gebundene Variable) zurück
      this.saveTasks();     // Speichere den neuen Zustand der Liste!
      console.log('Aufgabe hinzugefügt:', this.tasks); // Debugging
    }
  }

  toggleCompletion(id: number): void { // Ändert den Erledigt-Status einer Aufgabe
    const task = this.tasks.find(t => t.id === id); // Finde die Aufgabe mit der übergebenen ID im Array
    if (task) { // Wenn gefunden...
      task.completed = !task.completed; // Kehre den 'completed'-Wert um (true -> false, false -> true)
      this.saveTasks(); // Speichere den geänderten Zustand!
      console.log('Status geändert:', task); // Debugging
    }
  }

  deleteTask(id: number): void { // Löscht eine Aufgabe
    this.tasks = this.tasks.filter(t => t.id !== id); // Erzeugt ein NEUES Array, das alle Aufgaben enthält, AUSSER der mit der übergebenen ID
                                                     // Das neue Array wird dann 'this.tasks' zugewiesen.
    this.saveTasks(); // Speichere den Zustand ohne die gelöschte Aufgabe!
    // Optional: ID zurücksetzen, wenn Liste leer ist
    if (this.tasks.length === 0) {
        this.nextId = 1;
    }
    console.log('Aufgabe gelöscht. Übrig:', this.tasks); // Debugging
  }

  // --- Getter: Eine spezielle Methode, die sich wie eine Eigenschaft verhält ---

  get activeTasksCount(): number { // Berechnet die Anzahl der unerledigten Aufgaben
    // Wird jedes Mal neu berechnet, wenn 'activeTasksCount' im Template abgefragt wird.
    return this.tasks.filter(t => !t.completed).length; // Filtert alle unerledigten Aufgaben heraus und gibt deren Anzahl zurück.
  }
}
