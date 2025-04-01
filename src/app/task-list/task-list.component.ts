import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Interface umbenannt von Todo zu Task
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-list', // Selektor geändert
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './task-list.component.html', // Pfad zur HTML-Datei geändert
  styleUrls: ['./task-list.component.css']   // Pfad zur CSS-Datei geändert
})
// Klassenname geändert
export class TaskListComponent implements OnInit {

  // localStorage Key angepasst
  private localStorageKey = 'angularTasks_v1';

  // Array umbenannt von todos zu tasks
  tasks: Task[] = [];

  // Variable für das Input-Feld (Name kann bleiben oder z.B. newTaskText)
  newTaskText: string = '';

  private nextId: number = 1;

  ngOnInit(): void {
    this.loadTasks(); // Methode umbenannt
    this.calculateNextId();
  }

  // --- Methoden zum Laden und Speichern (umbenannt) ---
  private loadTasks(): void {
    if (typeof localStorage !== 'undefined') {
      const storedTasks = localStorage.getItem(this.localStorageKey);
      if (storedTasks) {
        try {
          this.tasks = JSON.parse(storedTasks); // In tasks speichern
          if (!Array.isArray(this.tasks)) {
              this.tasks = [];
          }
        } catch (e) {
          console.error('Fehler beim Parsen der Tasks aus localStorage:', e);
          this.tasks = [];
        }
      } else {
        this.tasks = [];
      }
    } else {
        console.warn('localStorage ist nicht verfügbar.');
        this.tasks = [];
    }
  }

  private saveTasks(): void { // Methode umbenannt
     if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks)); // tasks speichern
        } catch (e) {
            console.error('Fehler beim Speichern der Tasks im localStorage:', e);
        }
     }
  }

  // --- Methode zum Berechnen der nächsten ID (logisch angepasst an tasks) ---
  private calculateNextId(): void {
    if (this.tasks.length > 0) {
      // Finde die höchste vorhandene ID im tasks Array
      const maxId = Math.max(...this.tasks.map(t => t.id));
      this.nextId = maxId + 1;
    } else {
      this.nextId = 1;
    }
  }

  // --- Methoden zum Bearbeiten der Tasks (umbenannt und angepasst) ---
  addTask(): void { // Methode umbenannt
    const text = this.newTaskText.trim();
    if (text) {
      this.tasks.push({ // In tasks pushen
        id: this.nextId++,
        text: text,
        completed: false
      });
      this.newTaskText = '';
      this.saveTasks(); // saveTasks aufrufen
    }
  }

  toggleCompletion(id: number): void {
    const task = this.tasks.find(t => t.id === id); // Task finden
    if (task) {
      task.completed = !task.completed;
      this.saveTasks(); // saveTasks aufrufen
    }
  }

  deleteTask(id: number): void { // Methode umbenannt
    this.tasks = this.tasks.filter(t => t.id !== id); // Aus tasks filtern
    this.saveTasks(); // saveTasks aufrufen
    if (this.tasks.length === 0) {
        this.nextId = 1;
    }
  }

  // Getter umbenannt für Konsistenz
  get activeTasksCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }
}
