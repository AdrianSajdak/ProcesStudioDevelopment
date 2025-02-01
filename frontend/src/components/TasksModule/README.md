TasksModule/
│
├── Tasks.js
|
├── api/
│   └── tasksApi.js     // Funkcje API: pobieranie, tworzenie, aktualizacja, usuwanie
│
├── hooks/
│   └── useTasksData.js       // Custom hook do pobierania i zarządzania danymi (zadania, projekty, posty, urlopy, użytkownicy)
│
└── components/
    ├── Tabs/
    │   ├── TasksListTab.js   // Zakładka „Lista zadań”
    │   ├── CalendarTab.js    // Zakładka „Kalendarz”
    │   └── AddTaskTab.js     // Zakładka „Dodaj Zadanie”
    |
    ├── Calendar/
    │   └── Calendar.js       // Komponent Kalendarza
    |   └── Calendar.css      // Style dla komponentu Kalendarza
    │
    └── Dialogs/
        ├── TaskEditDialog.js       // Dialog edycji zadania
        ├── PostEditDialog.js       // Dialog edycji posta
        ├── DeletePostDialog.js     // Dialog potwierdzenia usunięcia posta
        ├── PostInfoDialog.js       // Dialog wyświetlania informacji o poście
        ├── AddPostDialog.js        // Dialog dodawania posta
        ├── AddVacationDialog.js    // Dialog dodawania urlopu
        ├── VacationEditDialog.js   // Dialog edycji urlopu
        └── VacationInfoDialog.js   // Dialog informacji o urlopie
