# PROJECT NOTIFICATIONS
PROJECT_NOTIFICATIONS = {
    'created': {
        'title': "Utworzono nowy projekt - {project_name}",
        'message': "New project '{project_name}' has been created."
    },
    'status_changed': {
        'title': "Zmieniono status projektu [{project_name}]",
        'message': "Project status changed from {old_status} to {new_status}."
    }
}

# PHASE NOTIFICATIONS
PHASE_NOTIFICATIONS = {
    'created': {
        'title': "Utworzono nową fazę w projekcie - [{phase_name}]",
        'message': "New phase was created."
    },
    'status_changed': {
        'title': "Zmieniono status fazy [{phase_name}]",
        'message': "Phase status changed from {old_status} to {new_status}."
    }
}

# TASK NOTIFICATIONS
TASK_NOTIFICATIONS = {
    'created': {
        'title': "Utworzono nowe zadanie dla Ciebie - {task_name}",
        'message': "New task was created for user - {username}."
    },
    'status_changed': {
        'title': "Zmieniono status zadania {task_name}",
        'message': "Task status changed from {old_status} to {new_status}."
    }
}

# CLIENT NOTIFICATIONS
CLIENT_NOTIFICATIONS = {
    'created': {
        'title': "Utworzono nowego klienta - {client_name}",
        'message': "New client '{client_name}' has been created."
    },
    'updated': {
        'title': "Zaktualizowano dane klienta - {client_name}",
        'message': "Client data has been updated."
    }
}

# VACATION NOTIFICATIONS
VACATION_NOTIFICATIONS = {
    'created': {
        'title': "Utworzono nowy wniosek o urlop dla użytkownika - {username}",
        'message': "New vacation request has been created for user - {username}."
    },
    'confirmed': {
        'title': "Zatwierdzono twój wniosek o urlop. Data: {vacation_date}",
        'message': "Vacation request for user - {username} has been confirmed."
    },
    'rejected': {
        'title': "Odrzucono twój wniosek o urlop. Data: {vacation_date}",
        'message': "Vacation request for user - {username} has been rejected."
    }
}

# USER NOTIFICATIONS
USER_NOTIFICATIONS = {
    'created': {
        'title': "Utworzono nowego użytkownika - {username}",
        'message': "New user '{username}' has been created."
    },
    'updated': {
        'title': "Zaktualizowano dane użytkownika - {username}",
        'message': "User data has been updated."
    }
}