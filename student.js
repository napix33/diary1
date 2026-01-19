// Логика для личного кабинета ученика
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    if (!checkAuth()) return;
    
    // Инициализация страницы
    initStudentPage();
    
    // Навигация по разделам
    setupNavigation();
    
    // Загрузка данных
    loadStudentSchedule();
    loadStudentGrades();
    loadStudentHomeworks();
    loadUpcomingEvents();
    
    // Инициализация графиков
    initCharts();
});

// Инициализация страницы ученика
function initStudentPage() {
    // Установка имени ученика
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const studentNameElement = document.getElementById('studentName');
    const studentClassElement = document.getElementById('studentClass');
    
    if (studentNameElement && currentUser) {
        studentNameElement.textContent = currentUser.fullName;
    }
    
    if (studentClassElement && currentUser.class) {
        studentClassElement.textContent = `Класс: ${currentUser.class}`;
    }
    
    // Настройка кнопок навигации по дням
    const prevDayBtn = document.getElementById('prevDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');
    const currentDayElement = document.getElementById('currentDay');
    
    if (prevDayBtn && nextDayBtn && currentDayElement) {
        let currentDayIndex = 0; // 0 = Понедельник
        const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
        
        // Устанавливаем текущий день
        const today = new Date().getDay(); // 0 = воскресенье, 1 = понедельник
        currentDayIndex = today >= 1 && today <= 5 ? today - 1 : 0;
        updateDayDisplay();
        
        prevDayBtn.addEventListener('click', function() {
            currentDayIndex = (currentDayIndex - 1 + days.length) % days.length;
            updateDayDisplay();
            loadDaySchedule(currentDayIndex);
        });
        
        nextDayBtn.addEventListener('click', function() {
            currentDayIndex = (currentDayIndex + 1) % days.length;
            updateDayDisplay();
            loadDaySchedule(currentDayIndex);
        });
        
        function updateDayDisplay() {
            const today = new Date();
            const dayOffset = currentDayIndex - (today.getDay() - 1);
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + dayOffset);
            
            const dateString = targetDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit'
            });
            
            currentDayElement.textContent = `${days[currentDayIndex]}, ${dateString}`;
        }
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
            
            // Инициализируем график при переходе на страницу статистики
            if (sectionId === 'statistics') {
                initCharts();
            }
        });
    });
}

// Загрузка расписания ученика
function loadStudentSchedule() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем расписание для класса ученика
    const studentSchedule = schedule.filter(item => item.class === currentUser.class);
    
    // Загружаем расписание на день (по умолчанию понедельник)
    loadDaySchedule(0);
    
    // Загружаем расписание на неделю
    loadWeekSchedule(studentSchedule, subjects);
}

// Загрузка расписания на день
function loadDaySchedule(dayIndex) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const schedule = JSON.parse(localStorage.getItem('schedule')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const currentDay = days[dayIndex];
    
    // Фильтруем расписание для класса ученика и текущего дня
    const daySchedule = schedule.filter(item => 
        item.class === currentUser.class && item.day === currentDay
    );
    
    // Сортируем по времени
    daySchedule.sort((a, b) => a.time.localeCompare(b.time));
    
    const dayScheduleElement = document.getElementById('daySchedule');
    if (!dayScheduleElement) return;
    
    if (daySchedule.length === 0) {
        dayScheduleElement.innerHTML = '<p class="text-center">На этот день занятий нет</p>';
        return;
    }
    
    let scheduleHtml = '';
    daySchedule.forEach(item => {
        const subject = subjects.find(s => s.id === item.subjectId);
        scheduleHtml += `
            <div class="schedule-item">
                <div class="schedule-time">${item.time}</div>
                <div class="schedule-subject">
                    <h3>${subject ? subject.name : 'Неизвестно'}</h3>
                    <p>${subject ? 'Урок' : ''}</p>
                </div>
            </div>
        `;
    });
    
    dayScheduleElement.innerHTML = scheduleHtml;
}

// Загрузка расписания на неделю
function loadWeekSchedule(studentSchedule, subjects) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
    
    const tbody = document.getElementById('weekScheduleBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    days.forEach((day, index) => {
        const dayItems = studentSchedule.filter(item => item.day === day);
        
        let subjectsList = '';
        if (dayItems.length > 0) {
            // Сортируем по времени
            dayItems.sort((a, b) => a.time.localeCompare(b.time));
            
            dayItems.forEach(item => {
                const subject = subjects.find(s => s.id === item.subjectId);
                if (subject) {
                    subjectsList += `<div>${item.time} - ${subject.name}</div>`;
                }
            });
        } else {
            subjectsList = '<div class="text-muted">Нет занятий</div>';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${dayNames[index]}</strong></td>
            <td>${subjectsList}</td>
        `;
        tbody.appendChild(row);
    });
}

// Загрузка оценок ученика
function loadStudentGrades() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем оценки текущего ученика
    const studentGrades = grades.filter(grade => grade.studentId === currentUser.id);
    
    // Получаем выбранные фильтры
    const subjectFilter = document.getElementById('gradeSubjectFilter');
    const periodFilter = document.getElementById('gradePeriodFilter');
    
    const selectedSubject = subjectFilter ? subjectFilter.value : 'all';
    const selectedPeriod = periodFilter ? periodFilter.value : 'all';
    
    // Применяем фильтры
    let filteredGrades = studentGrades;
    
    if (selectedSubject !== 'all') {
        filteredGrades = filteredGrades.filter(grade => grade.subjectId === parseInt(selectedSubject));
    }
    
    if (selectedPeriod !== 'all') {
        const today = new Date();
        let startDate;
        
        if (selectedPeriod === 'month') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (selectedPeriod === 'week') {
            // Начало недели (понедельник)
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            startDate = new Date(today.setDate(diff));
        }
        
        filteredGrades = filteredGrades.filter(grade => {
            const gradeDate = new Date(grade.date);
            return gradeDate >= startDate;
        });
    }
    
    // Обновляем фильтр предметов
    if (subjectFilter) {
        subjectFilter.innerHTML = '<option value="all">Все предметы</option>';
        
        // Получаем уникальные предметы ученика
        const studentSubjectIds = [...new Set(studentGrades.map(grade => grade.subjectId))];
        const studentSubjects = subjects.filter(subject => 
            studentSubjectIds.includes(subject.id)
        );
        
        studentSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            if (selectedSubject === subject.id.toString()) {
                option.selected = true;
            }
            subjectFilter.appendChild(option);
        });
    }
    
    // Обновляем статистику
    updateGradesSummary(studentGrades, subjects);
    
    // Отображаем оценки
    const tbody = document.getElementById('gradesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredGrades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">Нет оценок</td>
            </tr>
        `;
        return;
    }
    
    // Сортируем оценки по дате (сначала новые)
    filteredGrades.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredGrades.forEach(grade => {
        const subject = subjects.find(s => s.id === grade.subjectId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(grade.date)}</td>
            <td>${subject ? subject.name : 'Неизвестно'}</td>
            <td><span class="grade-badge grade-${grade.grade}">${grade.grade}</span></td>
            <td>${grade.comment || ''}</td>
        `;
        tbody.appendChild(row);
    });
}

// Обновление статистики оценок
function updateGradesSummary(grades, subjects) {
    if (grades.length === 0) {
        document.getElementById('averageGrade').textContent = '0';
        document.getElementById('totalGrades').textContent = '0';
        document.getElementById('bestSubject').textContent = 'Нет данных';
        document.getElementById('lastGrade').textContent = '0';
        return;
    }
    
    // Средний балл
    const average = grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length;
    document.getElementById('averageGrade').textContent = average.toFixed(1);
    
    // Всего оценок
    document.getElementById('totalGrades').textContent = grades.length;
    
    // Лучший предмет
    const subjectGrades = {};
    grades.forEach(grade => {
        if (!subjectGrades[grade.subjectId]) {
            subjectGrades[grade.subjectId] = { sum: 0, count: 0 };
        }
        subjectGrades[grade.subjectId].sum += grade.grade;
        subjectGrades[grade.subjectId].count += 1;
    });
    
    let bestSubjectId = null;
    let bestAverage = 0;
    
    Object.keys(subjectGrades).forEach(subjectId => {
        const avg = subjectGrades[subjectId].sum / subjectGrades[subjectId].count;
        if (avg > bestAverage) {
            bestAverage = avg;
            bestSubjectId = subjectId;
        }
    });
    
    const bestSubject = subjects.find(s => s.id === parseInt(bestSubjectId));
    document.getElementById('bestSubject').textContent = bestSubject ? bestSubject.name : 'Нет данных';
    
    // Последняя оценка
    const sortedGrades = [...grades].sort((a, b) => new Date(b.date) - new Date(a.date));
    document.getElementById('lastGrade').textContent = sortedGrades[0] ? sortedGrades[0].grade : '0';
}

// Загрузка домашних заданий ученика
function loadStudentHomeworks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем домашние задания для класса ученика
    const studentHomeworks = homeworks.filter(hw => hw.class === currentUser.class);
    
    // Получаем выбранные фильтры
    const subjectFilter = document.getElementById('hwSubjectFilter');
    const statusFilter = document.getElementById('hwStatusFilter');
    
    const selectedSubject = subjectFilter ? subjectFilter.value : 'all';
    const selectedStatus = statusFilter ? statusFilter.value : 'all';
    
    // Применяем фильтры
    let filteredHomeworks = studentHomeworks;
    
    if (selectedSubject !== 'all') {
        filteredHomeworks = filteredHomeworks.filter(hw => hw.subjectId === parseInt(selectedSubject));
    }
    
    if (selectedStatus !== 'all') {
        const today = new Date();
        
        filteredHomeworks = filteredHomeworks.filter(hw => {
            const dueDate = new Date(hw.dueDate);
            const isOverdue = dueDate < today;
            
            if (selectedStatus === 'active') {
                return !isOverdue;
            } else if (selectedStatus === 'completed') {
                // В реальном приложении здесь должна быть проверка выполнения задания
                return false;
            } else if (selectedStatus === 'overdue') {
                return isOverdue;
            }
            return true;
        });
    }
    
    // Обновляем фильтр предметов
    if (subjectFilter) {
        subjectFilter.innerHTML = '<option value="all">Все предметы</option>';
        
        // Получаем уникальные предметы с домашними заданиями
        const homeworkSubjectIds = [...new Set(studentHomeworks.map(hw => hw.subjectId))];
        const homeworkSubjects = subjects.filter(subject => 
            homeworkSubjectIds.includes(subject.id)
        );
        
        homeworkSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            if (selectedSubject === subject.id.toString()) {
                option.selected = true;
            }
            subjectFilter.appendChild(option);
        });
    }
    
    // Отображаем домашние задания
    const homeworkGrid = document.getElementById('homeworkGrid');
    if (!homeworkGrid) return;
    
    homeworkGrid.innerHTML = '';
    
    if (filteredHomeworks.length === 0) {
        homeworkGrid.innerHTML = '<p class="text-center">Нет домашних заданий</p>';
        return;
    }
    
    // Сортируем по дате сдачи (сначала ближайшие)
    filteredHomeworks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    filteredHomeworks.forEach(hw => {
        const subject = subjects.find(s => s.id === hw.subjectId);
        const today = new Date();
        const dueDate = new Date(hw.dueDate);
        const isOverdue = dueDate < today;
        
        const homeworkCard = document.createElement('div');
        homeworkCard.className = `homework-card ${isOverdue ? 'overdue' : 'active'}`;
        homeworkCard.innerHTML = `
            <h3>${hw.title}</h3>
            <div class="subject">${subject ? subject.name : 'Неизвестно'}</div>
            <div class="due-date">Срок сдачи: ${formatDate(hw.dueDate)}</div>
            <p>${hw.description}</p>
            <div class="homework-actions">
                <span class="status ${isOverdue ? 'overdue' : 'active'}">
                    ${isOverdue ? 'Просрочено' : 'Активно'}
                </span>
            </div>
        `;
        homeworkGrid.appendChild(homeworkCard);
    });
}

// Загрузка предстоящих событий
function loadUpcomingEvents() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем домашние задания для класса ученика
    const studentHomeworks = homeworks.filter(hw => hw.class === currentUser.class);
    
    // Берем ближайшие 3 задания
    const upcomingHomeworks = studentHomeworks
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);
    
    const upcomingEventsElement = document.getElementById('upcomingEvents');
    if (!upcomingEventsElement) return;
    
    upcomingEventsElement.innerHTML = '';
    
    if (upcomingHomeworks.length === 0) {
        upcomingEventsElement.innerHTML = '<p class="text-center">Нет предстоящих событий</p>';
        return;
    }
    
    upcomingHomeworks.forEach(hw => {
        const subject = subjects.find(s => s.id === hw.subjectId);
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-title">${subject ? subject.name : 'ДЗ'}: ${hw.title}</div>
            <div class="event-date">До: ${formatDate(hw.dueDate)}</div>
        `;
        upcomingEventsElement.appendChild(eventItem);
    });
}

// Инициализация графиков статистики
function initCharts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    
    // Фильтруем оценки текущего ученика
    const studentGrades = grades.filter(grade => grade.studentId === currentUser.id);
    
    if (studentGrades.length === 0) {
        return;
    }
    
    // Группируем оценки по предметам
    const subjectGrades = {};
    studentGrades.forEach(grade => {
        if (!subjectGrades[grade.subjectId]) {
            subjectGrades[grade.subjectId] = [];
        }
        subjectGrades[grade.subjectId].push(grade.grade);
    });
    
    // Подготавливаем данные для графика
    const subjectNames = [];
    const subjectAverages = [];
    const subjectColors = [];
    
    Object.keys(subjectGrades).forEach(subjectId => {
        const subject = subjects.find(s => s.id === parseInt(subjectId));
        if (subject) {
            const grades = subjectGrades[subjectId];
            const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
            
            subjectNames.push(subject.name);
            subjectAverages.push(average);
            subjectColors.push(subject.color);
        }
    });
    
    // Создаем график
    const ctx = document.getElementById('gradesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjectNames,
            datasets: [{
                label: 'Средний балл',
                data: subjectAverages,
                backgroundColor: subjectColors,
                borderColor: subjectColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Средний балл'
                    }
                }
            }
        }
    });
    
    // Обновляем детализацию по предметам
    updateSubjectDetails(subjectGrades, subjects);
}

// Обновление детализации по предметам
function updateSubjectDetails(subjectGrades, subjects) {
    const subjectDetailsElement = document.getElementById('subjectDetails');
    if (!subjectDetailsElement) return;
    
    let detailsHtml = '';
    
    Object.keys(subjectGrades).forEach(subjectId => {
        const subject = subjects.find(s => s.id === parseInt(subjectId));
        if (subject) {
            const grades = subjectGrades[subjectId];
            const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
            const maxGrade = Math.max(...grades);
            const minGrade = Math.min(...grades);
            
            detailsHtml += `
                <div class="subject-detail">
                    <div class="subject-header" style="color: ${subject.color}">
                        <h4>${subject.name}</h4>
                        <span class="subject-average">${average.toFixed(1)}</span>
                    </div>
                    <div class="subject-stats">
                        <div>Оценок: ${grades.length}</div>
                        <div>Лучшая: ${maxGrade}</div>
                        <div>Худшая: ${minGrade}</div>
                    </div>
                </div>
            `;
        }
    });
    
    subjectDetailsElement.innerHTML = detailsHtml;
}

// Обновление данных при изменении фильтров
document.addEventListener('DOMContentLoaded', function() {
    const gradeSubjectFilter = document.getElementById('gradeSubjectFilter');
    const gradePeriodFilter = document.getElementById('gradePeriodFilter');
    const hwSubjectFilter = document.getElementById('hwSubjectFilter');
    const hwStatusFilter = document.getElementById('hwStatusFilter');
    
    if (gradeSubjectFilter) {
        gradeSubjectFilter.addEventListener('change', loadStudentGrades);
    }
    
    if (gradePeriodFilter) {
        gradePeriodFilter.addEventListener('change', loadStudentGrades);
    }
    
    if (hwSubjectFilter) {
        hwSubjectFilter.addEventListener('change', loadStudentHomeworks);
    }
    
    if (hwStatusFilter) {
        hwStatusFilter.addEventListener('change', loadStudentHomeworks);
    }
});