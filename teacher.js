// Логика для личного кабинета учителя
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    if (!checkAuth()) return;
    
    // Инициализация страницы
    initTeacherPage();
    
    // Навигация по разделам
    setupNavigation();
    
    // Кнопки добавления
    setupAddButtons();
    
    // Загрузка данных
    loadStudents();
    loadSubjects();
    loadSchedule();
    loadGrades();
    loadHomeworks();
    
    // Инициализация модального окна
    initModal();
});

// Инициализация страницы учителя
function initTeacherPage() {
    // Установка имени учителя
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const teacherNameElement = document.getElementById('teacherName');
    if (teacherNameElement && currentUser) {
        teacherNameElement.textContent = `Добро пожаловать, ${currentUser.fullName}!`;
    }
}

// Настройка навигации по разделам
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Удаляем активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Добавляем активный класс к текущей ссылке
            this.classList.add('active');
            
            // Получаем ID секции
            const sectionId = this.getAttribute('data-section');
            
            // Скрываем все секции
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Показываем выбранную секцию
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
}

// Настройка кнопок добавления
function setupAddButtons() {
    // Добавление ученика
    const addStudentBtn = document.getElementById('addStudentBtn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            showAddStudentModal();
        });
    }
    
    // Добавление предмета
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', function() {
            showAddSubjectModal();
        });
    }
    
    // Добавление оценки
    const addGradeBtn = document.getElementById('addGradeBtn');
    if (addGradeBtn) {
        addGradeBtn.addEventListener('click', function() {
            showAddGradeModal();
        });
    }
    
    // Добавление домашнего задания
    const addHomeworkBtn = document.getElementById('addHomeworkBtn');
    if (addHomeworkBtn) {
        addHomeworkBtn.addEventListener('click', function() {
            showAddHomeworkModal();
        });
    }
    
    // Добавление занятия в расписание
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', function() {
            showAddScheduleModal();
        });
    }
}

// Инициализация модального окна
function initModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Закрытие модального окна по кнопке
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            modalOverlay.classList.add('hidden');
        });
    }
    
    // Закрытие модального окна по клику вне его
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    });
}

// Показать модальное окно
function showModal(title, content) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.remove('hidden');
}

// Закрыть модальное окно
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('hidden');
}

// Загрузка учеников
function loadStudents() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Фильтруем учеников текущего учителя
    const teacherStudents = students.filter(student => student.teacherId === currentUser.id);
    
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (teacherStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Нет добавленных учеников</td>
            </tr>
        `;
        return;
    }
    
    teacherStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.fullName}</td>
            <td>${student.username}</td>
            <td>${student.password}</td>
            <td>${student.class || 'Не указан'}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Загрузка предметов
function loadSubjects() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем предметы текущего учителя
    const teacherSubjects = subjects.filter(subject => subject.teacherId === currentUser.id);
    
    const subjectsGrid = document.getElementById('subjectsGrid');
    const subjectFilter = document.getElementById('subjectFilter');
    
    if (subjectFilter) {
        // Очищаем фильтр предметов для оценок
        subjectFilter.innerHTML = '<option value="all">Все предметы</option>';
        
        teacherSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectFilter.appendChild(option);
        });
    }
    
    if (!subjectsGrid) return;
    
    subjectsGrid.innerHTML = '';
    
    if (teacherSubjects.length === 0) {
        subjectsGrid.innerHTML = '<p class="text-center">Нет добавленных предметов</p>';
        return;
    }
    
    teacherSubjects.forEach(subject => {
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.style.borderLeftColor = subject.color;
        subjectCard.innerHTML = `
            <div class="subject-info">
                <h3>${subject.name}</h3>
                <div class="subject-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editSubject(${subject.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSubject(${subject.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        subjectsGrid.appendChild(subjectCard);
    });
}

// Загрузка расписания
function loadSchedule() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем расписание текущего учителя
    const teacherSchedule = schedule.filter(item => item.teacherId === currentUser.id);
    
    const tbody = document.getElementById('scheduleTableBody');
    if (!tbody) return;
    
    // Временные слоты
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    tbody.innerHTML = '';
    
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        let rowHtml = `<td>${time}</td>`;
        
        days.forEach(day => {
            const scheduleItem = teacherSchedule.find(item => item.day === day && item.time === time);
            
            if (scheduleItem) {
                const subject = subjects.find(s => s.id === scheduleItem.subjectId);
                rowHtml += `<td class="schedule-cell">${subject ? subject.name : 'Неизвестно'} (${scheduleItem.class})</td>`;
            } else {
                rowHtml += '<td class="schedule-cell empty">-</td>';
            }
        });
        
        row.innerHTML = rowHtml;
        tbody.appendChild(row);
    });
}

// Загрузка оценок
function loadGrades() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем оценки текущего учителя
    const teacherGrades = grades.filter(grade => grade.teacherId === currentUser.id);
    
    // Получаем выбранные фильтры
    const studentFilter = document.getElementById('studentFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    
    const selectedStudent = studentFilter ? studentFilter.value : 'all';
    const selectedSubject = subjectFilter ? subjectFilter.value : 'all';
    
    // Применяем фильтры
    let filteredGrades = teacherGrades;
    
    if (selectedStudent !== 'all') {
        filteredGrades = filteredGrades.filter(grade => grade.studentId === parseInt(selectedStudent));
    }
    
    if (selectedSubject !== 'all') {
        filteredGrades = filteredGrades.filter(grade => grade.subjectId === parseInt(selectedSubject));
    }
    
    const tbody = document.getElementById('gradesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredGrades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Нет оценок</td>
            </tr>
        `;
        return;
    }
    
    // Обновляем фильтр учеников
    if (studentFilter) {
        studentFilter.innerHTML = '<option value="all">Все ученики</option>';
        
        const teacherStudents = students.filter(student => student.teacherId === currentUser.id);
        teacherStudents.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.fullName;
            if (selectedStudent === student.id.toString()) {
                option.selected = true;
            }
            studentFilter.appendChild(option);
        });
    }
    
    filteredGrades.forEach(grade => {
        const student = students.find(s => s.id === grade.studentId);
        const subject = subjects.find(s => s.id === grade.subjectId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(grade.date)}</td>
            <td>${student ? student.fullName : 'Неизвестно'}</td>
            <td>${subject ? subject.name : 'Неизвестно'}</td>
            <td><span class="grade-badge grade-${grade.grade}">${grade.grade}</span></td>
            <td>${grade.comment || ''}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editGrade(${grade.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteGrade(${grade.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Загрузка домашних заданий
function loadHomeworks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем домашние задания текущего учителя
    const teacherHomeworks = homeworks.filter(hw => hw.teacherId === currentUser.id);
    
    const tbody = document.getElementById('homeworkTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (teacherHomeworks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Нет домашних заданий</td>
            </tr>
        `;
        return;
    }
    
    teacherHomeworks.forEach(hw => {
        const subject = subjects.find(s => s.id === hw.subjectId);
        const today = new Date();
        const dueDate = new Date(hw.dueDate);
        const isOverdue = dueDate < today;
        
        row = document.createElement('tr');
        row.innerHTML = `
            <td>${subject ? subject.name : 'Неизвестно'}</td>
            <td>${hw.title}</td>
            <td>${formatDate(hw.assignedDate)}</td>
            <td>${formatDate(hw.dueDate)}</td>
            <td>${hw.class}</td>
            <td><span class="status ${isOverdue ? 'overdue' : 'active'}">${isOverdue ? 'Просрочено' : 'Активно'}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editHomework(${hw.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteHomework(${hw.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Показать модальное окно добавления ученика
function showAddStudentModal() {
    const content = `
        <form id="addStudentForm">
            <div class="form-group">
                <label for="studentFullName">ФИО ученика</label>
                <input type="text" id="studentFullName" required>
            </div>
            <div class="form-group">
                <label for="studentUsername">Логин</label>
                <input type="text" id="studentUsername" required>
            </div>
            <div class="form-group">
                <label for="studentPassword">Пароль</label>
                <input type="text" id="studentPassword" required>
            </div>
            <div class="form-group">
                <label for="studentClass">Класс</label>
                <input type="text" id="studentClass" required>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Добавить ученика</button>
            </div>
        </form>
    `;
    
    showModal('Добавить ученика', content);
    
    // Обработка формы
    const form = document.getElementById('addStudentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const students = JSON.parse(localStorage.getItem('students')) || [];
        
        const newStudent = {
            id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
            fullName: document.getElementById('studentFullName').value,
            username: document.getElementById('studentUsername').value,
            password: document.getElementById('studentPassword').value,
            class: document.getElementById('studentClass').value,
            teacherId: currentUser.id
        };
        
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        
        closeModal();
        loadStudents();
        
        // Показываем сообщение об успехе
        alert('Ученик успешно добавлен!');
    });
}

// Показать модальное окно добавления предмета
function showAddSubjectModal() {
    const content = `
        <form id="addSubjectForm">
            <div class="form-group">
                <label for="subjectName">Название предмета</label>
                <input type="text" id="subjectName" required>
            </div>
            <div class="form-group">
                <label for="subjectColor">Цвет предмета</label>
                <input type="color" id="subjectColor" value="#3498db" required>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Добавить предмет</button>
            </div>
        </form>
    `;
    
    showModal('Добавить предмет', content);
    
    // Обработка формы
    const form = document.getElementById('addSubjectForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        
        const newSubject = {
            id: subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
            name: document.getElementById('subjectName').value,
            color: document.getElementById('subjectColor').value,
            teacherId: currentUser.id
        };
        
        subjects.push(newSubject);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        
        closeModal();
        loadSubjects();
        
        // Показываем сообщение об успехе
        alert('Предмет успешно добавлен!');
    });
}

// Показать модальное окно добавления оценки
function showAddGradeModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем учеников текущего учителя
    const teacherStudents = students.filter(student => student.teacherId === currentUser.id);
    const teacherSubjects = subjects.filter(subject => subject.teacherId === currentUser.id);
    
    let studentsOptions = '';
    teacherStudents.forEach(student => {
        studentsOptions += `<option value="${student.id}">${student.fullName}</option>`;
    });
    
    let subjectsOptions = '';
    teacherSubjects.forEach(subject => {
        subjectsOptions += `<option value="${subject.id}">${subject.name}</option>`;
    });
    
    const today = new Date().toISOString().split('T')[0];
    
    const content = `
        <form id="addGradeForm">
            <div class="form-group">
                <label for="gradeStudent">Ученик</label>
                <select id="gradeStudent" required>
                    <option value="">Выберите ученика</option>
                    ${studentsOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="gradeSubject">Предмет</label>
                <select id="gradeSubject" required>
                    <option value="">Выберите предмет</option>
                    ${subjectsOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="gradeValue">Оценка</label>
                <select id="gradeValue" required>
                    <option value="5">5 (Отлично)</option>
                    <option value="4">4 (Хорошо)</option>
                    <option value="3">3 (Удовлетворительно)</option>
                    <option value="2">2 (Неудовлетворительно)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="gradeDate">Дата</label>
                <input type="date" id="gradeDate" value="${today}" required>
            </div>
            <div class="form-group">
                <label for="gradeComment">Комментарий (необязательно)</label>
                <textarea id="gradeComment" rows="3"></textarea>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Добавить оценку</button>
            </div>
        </form>
    `;
    
    showModal('Добавить оценку', content);
    
    // Обработка формы
    const form = document.getElementById('addGradeForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        
        const newGrade = {
            id: grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1,
            studentId: parseInt(document.getElementById('gradeStudent').value),
            subjectId: parseInt(document.getElementById('gradeSubject').value),
            grade: parseInt(document.getElementById('gradeValue').value),
            date: document.getElementById('gradeDate').value,
            comment: document.getElementById('gradeComment').value,
            teacherId: currentUser.id
        };
        
        grades.push(newGrade);
        localStorage.setItem('grades', JSON.stringify(grades));
        
        closeModal();
        loadGrades();
        
        // Показываем сообщение об успехе
        alert('Оценка успешно добавлена!');
    });
}

// Показать модальное окно добавления домашнего задания
function showAddHomeworkModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем предметы текущего учителя
    const teacherSubjects = subjects.filter(subject => subject.teacherId === currentUser.id);
    
    let subjectsOptions = '';
    teacherSubjects.forEach(subject => {
        subjectsOptions += `<option value="${subject.id}">${subject.name}</option>`;
    });
    
    const today = new Date().toISOString().split('T')[0];
    
    const content = `
        <form id="addHomeworkForm">
            <div class="form-group">
                <label for="hwSubject">Предмет</label>
                <select id="hwSubject" required>
                    <option value="">Выберите предмет</option>
                    ${subjectsOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="hwTitle">Название задания</label>
                <input type="text" id="hwTitle" required>
            </div>
            <div class="form-group">
                <label for="hwDescription">Описание задания</label>
                <textarea id="hwDescription" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label for="hwClass">Класс</label>
                <input type="text" id="hwClass" required placeholder="Например: 8А">
            </div>
            <div class="form-group">
                <label for="hwAssignedDate">Дата выдачи</label>
                <input type="date" id="hwAssignedDate" value="${today}" required>
            </div>
            <div class="form-group">
                <label for="hwDueDate">Срок сдачи</label>
                <input type="date" id="hwDueDate" required>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Добавить задание</button>
            </div>
        </form>
    `;
    
    showModal('Добавить домашнее задание', content);
    
    // Обработка формы
    const form = document.getElementById('addHomeworkForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
        
        const newHomework = {
            id: homeworks.length > 0 ? Math.max(...homeworks.map(hw => hw.id)) + 1 : 1,
            subjectId: parseInt(document.getElementById('hwSubject').value),
            title: document.getElementById('hwTitle').value,
            description: document.getElementById('hwDescription').value,
            assignedDate: document.getElementById('hwAssignedDate').value,
            dueDate: document.getElementById('hwDueDate').value,
            class: document.getElementById('hwClass').value,
            teacherId: currentUser.id
        };
        
        homeworks.push(newHomework);
        localStorage.setItem('homeworks', JSON.stringify(homeworks));
        
        closeModal();
        loadHomeworks();
        
        // Показываем сообщение об успехе
        alert('Домашнее задание успешно добавлено!');
    });
}

// Показать модальное окно добавления занятия в расписание
function showAddScheduleModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем предметы текущего учителя
    const teacherSubjects = subjects.filter(subject => subject.teacherId === currentUser.id);
    
    let subjectsOptions = '';
    teacherSubjects.forEach(subject => {
        subjectsOptions += `<option value="${subject.id}">${subject.name}</option>`;
    });
    
    const content = `
        <form id="addScheduleForm">
            <div class="form-group">
                <label for="scheduleDay">День недели</label>
                <select id="scheduleDay" required>
                    <option value="monday">Понедельник</option>
                    <option value="tuesday">Вторник</option>
                    <option value="wednesday">Среда</option>
                    <option value="thursday">Четверг</option>
                    <option value="friday">Пятница</option>
                </select>
            </div>
            <div class="form-group">
                <label for="scheduleTime">Время</label>
                <select id="scheduleTime" required>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                </select>
            </div>
            <div class="form-group">
                <label for="scheduleSubject">Предмет</label>
                <select id="scheduleSubject" required>
                    <option value="">Выберите предмет</option>
                    ${subjectsOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="scheduleClass">Класс</label>
                <input type="text" id="scheduleClass" required placeholder="Например: 8А">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block">Добавить занятие</button>
            </div>
        </form>
    `;
    
    showModal('Добавить занятие в расписание', content);
    
    // Обработка формы
    const form = document.getElementById('addScheduleForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const schedule = JSON.parse(localStorage.getItem('schedule')) || [];
        
        const newScheduleItem = {
            id: schedule.length > 0 ? Math.max(...schedule.map(item => item.id)) + 1 : 1,
            day: document.getElementById('scheduleDay').value,
            time: document.getElementById('scheduleTime').value,
            subjectId: parseInt(document.getElementById('scheduleSubject').value),
            class: document.getElementById('scheduleClass').value,
            teacherId: currentUser.id
        };
        
        schedule.push(newScheduleItem);
        localStorage.setItem('schedule', JSON.stringify(schedule));
        
        closeModal();
        loadSchedule();
        
        // Показываем сообщение об успехе
        alert('Занятие успешно добавлено в расписание!');
    });
}

// Функции для работы с данными
function editStudent(id) {
    alert('Функция редактирования ученика в разработке');
}

function deleteStudent(id) {
    if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const updatedStudents = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        loadStudents();
    }
}

function editSubject(id) {
    alert('Функция редактирования предмета в разработке');
}

function deleteSubject(id) {
    if (confirm('Вы уверены, что хотите удалить этот предмет?')) {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        const updatedSubjects = subjects.filter(subject => subject.id !== id);
        localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        loadSubjects();
    }
}

function editGrade(id) {
    alert('Функция редактирования оценки в разработке');
}

function deleteGrade(id) {
    if (confirm('Вы уверены, что хотите удалить эту оценку?')) {
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        const updatedGrades = grades.filter(grade => grade.id !== id);
        localStorage.setItem('grades', JSON.stringify(updatedGrades));
        loadGrades();
    }
}

function editHomework(id) {
    alert('Функция редактирования домашнего задания в разработке');
}

function deleteHomework(id) {
    if (confirm('Вы уверены, что хотите удалить это домашнее задание?')) {
        const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
        const updatedHomeworks = homeworks.filter(hw => hw.id !== id);
        localStorage.setItem('homeworks', JSON.stringify(updatedHomeworks));
        loadHomeworks();
    }
}

// Обновление данных при изменении фильтров
document.addEventListener('DOMContentLoaded', function() {
    const studentFilter = document.getElementById('studentFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    
    if (studentFilter) {
        studentFilter.addEventListener('change', loadGrades);
    }
    
    if (subjectFilter) {
        subjectFilter.addEventListener('change', loadGrades);
    }
});