// Основной скрипт для всего приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация данных в localStorage если их нет
    initializeData();
    
    // Обработка страницы входа
    if (document.getElementById('loginForm')) {
        setupLoginPage();
    }
    
    // Обработка страницы регистрации
    if (document.getElementById('registerForm')) {
        setupRegisterPage();
    }
    
    // Общая кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentRole');
            window.location.href = 'index.html';
        });
    }
    
    // Установка имени текущего пользователя
    setCurrentUserName();
});

// Инициализация данных в localStorage
function initializeData() {
    // Данные учителей
    if (!localStorage.getItem('teachers')) {
        const defaultTeachers = [
            {
                id: 1,
                fullName: 'Иванова Мария Петровна',
                username: 'teacher1',
                password: 'password123'
            }
        ];
        localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
    }
    
    // Данные учеников
    if (!localStorage.getItem('students')) {
        const defaultStudents = [
            {
                id: 1,
                fullName: 'Смирнов Алексей Иванович',
                username: 'student1',
                password: 'student123',
                class: '8А',
                teacherId: 1
            },
            {
                id: 2,
                fullName: 'Петрова Анна Сергеевна',
                username: 'student2',
                password: 'student123',
                class: '8А',
                teacherId: 1
            }
        ];
        localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
    
    // Данные предметов
    if (!localStorage.getItem('subjects')) {
        const defaultSubjects = [
            { id: 1, name: 'Математика', color: '#3498db', teacherId: 1 },
            { id: 2, name: 'Русский язык', color: '#9b59b6', teacherId: 1 },
            { id: 3, name: 'Физика', color: '#e74c3c', teacherId: 1 },
            { id: 4, name: 'История', color: '#f39c12', teacherId: 1 },
            { id: 5, name: 'Английский язык', color: '#2ecc71', teacherId: 1 }
        ];
        localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
    }
    
    // Данные оценок
    if (!localStorage.getItem('grades')) {
        const defaultGrades = [
            { 
                id: 1, 
                studentId: 1, 
                subjectId: 1, 
                grade: 5, 
                date: '2023-10-10', 
                comment: 'Отлично!',
                teacherId: 1
            },
            { 
                id: 2, 
                studentId: 1, 
                subjectId: 2, 
                grade: 4, 
                date: '2023-10-12', 
                comment: 'Хорошо, но можно лучше',
                teacherId: 1
            },
            { 
                id: 3, 
                studentId: 2, 
                subjectId: 1, 
                grade: 3, 
                date: '2023-10-11', 
                comment: 'Нужно повторить материал',
                teacherId: 1
            }
        ];
        localStorage.setItem('grades', JSON.stringify(defaultGrades));
    }
    
    // Данные домашних заданий
    if (!localStorage.getItem('homeworks')) {
        const defaultHomeworks = [
            {
                id: 1,
                subjectId: 1,
                title: 'Решение уравнений',
                description: 'Решить уравнения на странице 45, №1-10',
                assignedDate: '2023-10-10',
                dueDate: '2023-10-17',
                class: '8А',
                teacherId: 1
            },
            {
                id: 2,
                subjectId: 2,
                title: 'Сочинение',
                description: 'Написать сочинение на тему "Мое лето"',
                assignedDate: '2023-10-12',
                dueDate: '2023-10-19',
                class: '8А',
                teacherId: 1
            }
        ];
        localStorage.setItem('homeworks', JSON.stringify(defaultHomeworks));
    }
    
    // Данные расписания
    if (!localStorage.getItem('schedule')) {
        const defaultSchedule = [
            { id: 1, day: 'monday', time: '09:00', subjectId: 1, class: '8А', teacherId: 1 },
            { id: 2, day: 'monday', time: '10:00', subjectId: 2, class: '8А', teacherId: 1 },
            { id: 3, day: 'tuesday', time: '09:00', subjectId: 3, class: '8А', teacherId: 1 },
            { id: 4, day: 'wednesday', time: '09:00', subjectId: 1, class: '8А', teacherId: 1 },
            { id: 5, day: 'thursday', time: '09:00', subjectId: 5, class: '8А', teacherId: 1 },
            { id: 6, day: 'friday', time: '09:00', subjectId: 4, class: '8А', teacherId: 1 }
        ];
        localStorage.setItem('schedule', JSON.stringify(defaultSchedule));
    }
}

// Настройка страницы входа
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const roleNameElement = document.getElementById('role-name');
    const registerLinkText = document.getElementById('register-link-text');
    const studentLoginNotice = document.getElementById('student-login-notice');
    
    // Получаем роль из URL
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'teacher';
    
    // Устанавливаем название роли на странице
    if (role === 'teacher') {
        roleNameElement.textContent = 'Учителя';
        studentLoginNotice.classList.add('hidden');
        registerLinkText.classList.remove('hidden');
    } else {
        roleNameElement.textContent = 'Ученика';
        registerLinkText.classList.add('hidden');
        studentLoginNotice.classList.remove('hidden');
    }
    
    // Обновляем ссылку регистрации
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.href = `register.html?role=${role}`;
    }
    
    // Обработка формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (role === 'teacher') {
            // Проверка учителя
            const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
            const teacher = teachers.find(t => t.username === username && t.password === password);
            
            if (teacher) {
                // Сохраняем текущего пользователя
                localStorage.setItem('currentUser', JSON.stringify(teacher));
                localStorage.setItem('currentRole', 'teacher');
                
                // Перенаправляем в личный кабинет учителя
                window.location.href = 'teacher.html';
            } else {
                showMessage(loginMessage, 'Неверный логин или пароль', 'error');
            }
        } else {
            // Проверка ученика
            const students = JSON.parse(localStorage.getItem('students')) || [];
            const student = students.find(s => s.username === username && s.password === password);
            
            if (student) {
                // Сохраняем текущего пользователя
                localStorage.setItem('currentUser', JSON.stringify(student));
                localStorage.setItem('currentRole', 'student');
                
                // Перенаправляем в личный кабинет ученика
                window.location.href = 'student.html';
            } else {
                showMessage(loginMessage, 'Неверный логин или пароль', 'error');
            }
        }
    });
}

// Настройка страницы регистрации
function setupRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    const roleNameElement = document.getElementById('role-name');
    
    // Получаем роль из URL
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role') || 'teacher';
    
    // Устанавливаем название роли на странице
    roleNameElement.textContent = role === 'teacher' ? 'Учителя' : 'Ученика';
    
    // Для учеников скрываем форму регистрации
    if (role === 'student') {
        registerForm.innerHTML = `
            <div class="registration-info">
                <i class="fas fa-info-circle" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                <h3>Регистрация учеников</h3>
                <p>Ученики не регистрируются самостоятельно. Для получения доступа к системе обратитесь к вашему учителю, чтобы он создал для вас учетную запись.</p>
                <a href="login.html?role=student" class="btn btn-primary" style="margin-top: 1.5rem;">Войти в систему</a>
            </div>
        `;
        return;
    }
    
    // Обработка формы регистрации (только для учителей)
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('registerFullName').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Проверка паролей
        if (password !== confirmPassword) {
            showMessage(registerMessage, 'Пароли не совпадают', 'error');
            return;
        }
        
        // Проверка длины пароля
        if (password.length < 6) {
            showMessage(registerMessage, 'Пароль должен содержать не менее 6 символов', 'error');
            return;
        }
        
        // Проверка, существует ли уже пользователь с таким логином
        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        const existingTeacher = teachers.find(t => t.username === username);
        
        if (existingTeacher) {
            showMessage(registerMessage, 'Пользователь с таким логином уже существует', 'error');
            return;
        }
        
        // Создание нового учителя
        const newTeacher = {
            id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
            fullName: fullName,
            username: username,
            password: password
        };
        
        // Добавление учителя в хранилище
        teachers.push(newTeacher);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        
        // Сохраняем текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(newTeacher));
        localStorage.setItem('currentRole', 'teacher');
        
        // Перенаправляем в личный кабинет
        window.location.href = 'teacher.html';
    });
}

// Показать сообщение
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `login-message ${type}`;
    element.classList.remove('hidden');
    
    // Скрыть сообщение через 5 секунд
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}

// Установка имени текущего пользователя
function setCurrentUserName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        const teacherNameElement = document.getElementById('teacherName');
        const studentNameElement = document.getElementById('studentName');
        const studentClassElement = document.getElementById('studentClass');
        
        if (teacherNameElement) {
            teacherNameElement.textContent = `Добро пожаловать, ${currentUser.fullName}!`;
        }
        
        if (studentNameElement) {
            studentNameElement.textContent = currentUser.fullName;
        }
        
        if (studentClassElement && currentUser.class) {
            studentClassElement.textContent = `Класс: ${currentUser.class}`;
        }
    }
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Получить название дня недели
function getDayName(day) {
    const days = {
        'monday': 'Понедельник',
        'tuesday': 'Вторник',
        'wednesday': 'Среда',
        'thursday': 'Четверг',
        'friday': 'Пятница',
        'saturday': 'Суббота',
        'sunday': 'Воскресенье'
    };
    return days[day] || day;
}

// Проверка авторизации для защищенных страниц
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentRole = localStorage.getItem('currentRole');
    
    // Если пользователь не авторизован, перенаправляем на главную
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    // Проверяем, что пользователь на правильной странице
    const isTeacherPage = window.location.pathname.includes('teacher.html');
    const isStudentPage = window.location.pathname.includes('student.html');
    
    if (isTeacherPage && currentRole !== 'teacher') {
        window.location.href = 'index.html';
        return false;
    }
    
    if (isStudentPage && currentRole !== 'student') {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}