class ParticipationTracker {
    constructor() {
        this.students = [];
        this.savedClassListsData = {};
        this.currentScreen = 'input';
        this.initializeElements();
        this.attachEventListeners();
        this.loadFromLocalStorage();
    }

    initializeElements() {
        this.inputScreen = document.getElementById('inputScreen');
        this.trackingScreen = document.getElementById('trackingScreen');
        this.studentNameInput = document.getElementById('studentNameInput');
        this.addStudentBtn = document.getElementById('addStudentBtn');
        this.studentList = document.getElementById('studentList');
        this.startTrackingBtn = document.getElementById('startTrackingBtn');
        this.participationGrid = document.getElementById('participationGrid');
        this.backBtn = document.getElementById('backBtn');
        this.resetPointsBtn = document.getElementById('resetPointsBtn');
        this.emailSummaryBtn = document.getElementById('emailSummaryBtn');
        this.summaryDisplay = document.getElementById('summaryDisplay');
        this.classListNameInput = document.getElementById('classListNameInput');
        this.saveClassListBtn = document.getElementById('saveClassListBtn');
        this.savedClassListsElement = document.getElementById('savedClassLists');
    }

    attachEventListeners() {
        this.addStudentBtn.addEventListener('click', () => this.addStudent());
        this.studentNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addStudent();
        });
        this.startTrackingBtn.addEventListener('click', () => this.showTrackingScreen());
        this.backBtn.addEventListener('click', () => this.showInputScreen());
        this.resetPointsBtn.addEventListener('click', () => this.resetPoints());
        this.emailSummaryBtn.addEventListener('click', () => this.emailSummary());
        this.saveClassListBtn.addEventListener('click', () => this.saveClassList());
        this.classListNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveClassList();
        });
        this.classListNameInput.addEventListener('input', () => this.updateSaveClassListButton());
    }

    addStudent() {
        const name = this.studentNameInput.value.trim();
        if (!name) return;

        if (this.students.find(s => s.name.toLowerCase() === name.toLowerCase())) {
            alert('This student is already in the list!');
            return;
        }

        this.students.push({
            name: name,
            points: 0,
            id: Date.now()
        });

        this.studentNameInput.value = '';
        this.studentNameInput.focus();
        this.renderStudentList();
        this.saveToLocalStorage();
    }

    removeStudent(id) {
        if (confirm('Are you sure you want to remove this student?')) {
            this.students = this.students.filter(s => s.id !== id);
            this.renderStudentList();
            this.saveToLocalStorage();
        }
    }

    renderStudentList() {
        if (this.students.length === 0) {
            this.studentList.innerHTML = '<div class="empty-state">No students added yet</div>';
            this.startTrackingBtn.disabled = true;
        } else {
            this.studentList.innerHTML = this.students.map(student => `
                <div class="student-item">
                    <span class="student-name">${this.escapeHtml(student.name)}</span>
                    <button class="btn btn-danger" onclick="tracker.removeStudent(${student.id})">Remove</button>
                </div>
            `).join('');
            this.startTrackingBtn.disabled = false;
        }
        this.updateSaveClassListButton();
    }

    showTrackingScreen() {
        this.currentScreen = 'tracking';
        this.inputScreen.classList.remove('active');
        this.trackingScreen.classList.add('active');
        this.renderParticipationGrid();
        this.updateSummary();
    }

    showInputScreen() {
        this.currentScreen = 'input';
        this.trackingScreen.classList.remove('active');
        this.inputScreen.classList.add('active');
    }

    renderParticipationGrid() {
        this.participationGrid.innerHTML = this.students.map(student => `
            <div class="student-card" onclick="tracker.addPoint(${student.id})">
                <h3>${this.escapeHtml(student.name)}</h3>
                <div class="points-display" id="points-${student.id}">${student.points}</div>
                <div class="points-label">Points</div>
            </div>
        `).join('');
    }

    addPoint(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            student.points++;
            const pointsElement = document.getElementById(`points-${id}`);
            if (pointsElement) {
                pointsElement.textContent = student.points;
                pointsElement.parentElement.classList.add('clicked');
                setTimeout(() => {
                    pointsElement.parentElement.classList.remove('clicked');
                }, 300);
            }
            this.updateSummary();
            this.saveToLocalStorage();
        }
    }

    updateSummary() {
        if (this.students.length === 0) {
            this.summaryDisplay.innerHTML = '<div class="empty-state">No students to display</div>';
            return;
        }

        const sortedStudents = [...this.students].sort((a, b) => b.points - a.points);
        this.summaryDisplay.innerHTML = sortedStudents.map(student => `
            <div class="summary-item">
                <span class="summary-name">${this.escapeHtml(student.name)}</span>
                <span class="summary-points">${student.points} pts</span>
            </div>
        `).join('');
    }

    resetPoints() {
        if (confirm('Are you sure you want to reset all points to zero?')) {
            this.students.forEach(student => student.points = 0);
            this.renderParticipationGrid();
            this.updateSummary();
            this.saveToLocalStorage();
        }
    }

    emailSummary() {
        if (this.students.length === 0) {
            alert('No students to send!');
            return;
        }

        const sortedStudents = [...this.students].sort((a, b) => b.points - a.points);
        const totalPoints = sortedStudents.reduce((sum, s) => sum + s.points, 0);
        const date = new Date().toLocaleDateString();

        let emailBody = `Student Participation Summary - ${date}\n`;
        emailBody += `${'='.repeat(50)}\n\n`;
        emailBody += `Total Students: ${this.students.length}\n`;
        emailBody += `Total Points Awarded: ${totalPoints}\n\n`;
        emailBody += `Individual Participation:\n`;
        emailBody += `${'-'.repeat(50)}\n`;

        sortedStudents.forEach((student, index) => {
            emailBody += `${index + 1}. ${student.name}: ${student.points} points\n`;
        });

        emailBody += `\n${'='.repeat(50)}\n`;
        emailBody += `Generated by Student Participation Tracker`;

        const subject = `Student Participation Summary - ${date}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        window.location.href = mailtoLink;
    }

    updateSaveClassListButton() {
        const hasStudents = this.students.length > 0;
        const hasClassName = this.classListNameInput.value.trim().length > 0;
        this.saveClassListBtn.disabled = !(hasStudents && hasClassName);
    }

    saveClassList() {
        const className = this.classListNameInput.value.trim();
        if (!className || this.students.length === 0) return;

        const studentNames = this.students.map(s => s.name);
        this.savedClassListsData[className] = {
            name: className,
            students: studentNames,
            savedDate: new Date().toISOString(),
            studentCount: studentNames.length
        };

        this.saveClassListsToLocalStorage();
        this.renderSavedClassLists();
        this.classListNameInput.value = '';
        this.updateSaveClassListButton();

        alert(`Class list "${className}" saved successfully!`);
    }

    loadClassList(className) {
        const classList = this.savedClassListsData[className];
        if (!classList) return;

        if (this.students.length > 0) {
            if (!confirm(`This will replace your current student list. Continue?`)) {
                return;
            }
        }

        this.students = classList.students.map(name => ({
            name: name,
            points: 0,
            id: Date.now() + Math.random()
        }));

        this.renderStudentList();
        this.saveToLocalStorage();
        
        alert(`Loaded "${className}" with ${classList.studentCount} students`);
    }

    deleteClassList(className) {
        if (!confirm(`Delete class list "${className}"? This cannot be undone.`)) {
            return;
        }

        delete this.savedClassListsData[className];
        this.saveClassListsToLocalStorage();
        this.renderSavedClassLists();
    }

    renderSavedClassLists() {
        const classListArray = Object.values(this.savedClassListsData);
        
        if (classListArray.length === 0) {
            this.savedClassListsElement.innerHTML = '<div class="empty-state">No saved class lists yet</div>';
            return;
        }

        this.savedClassListsElement.innerHTML = classListArray
            .sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate))
            .map(classList => {
                const savedDate = new Date(classList.savedDate).toLocaleDateString();
                return `
                    <div class="saved-class-item">
                        <div class="saved-class-info">
                            <div class="saved-class-name">${this.escapeHtml(classList.name)}</div>
                            <div class="saved-class-meta">${classList.studentCount} students • Saved ${savedDate}</div>
                        </div>
                        <div class="saved-class-actions">
                            <button class="btn btn-load" onclick="tracker.loadClassList('${this.escapeHtml(classList.name)}')">
                                Load
                            </button>
                            <button class="btn btn-delete" onclick="tracker.deleteClassList('${this.escapeHtml(classList.name)}')">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
    }

    saveToLocalStorage() {
        localStorage.setItem('participationTracker', JSON.stringify(this.students));
    }

    saveClassListsToLocalStorage() {
        localStorage.setItem('savedClassLists', JSON.stringify(this.savedClassListsData));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('participationTracker');
        if (saved) {
            try {
                this.students = JSON.parse(saved);
                this.renderStudentList();
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        }

        const savedLists = localStorage.getItem('savedClassLists');
        if (savedLists) {
            try {
                this.savedClassListsData = JSON.parse(savedLists);
                this.renderSavedClassLists();
            } catch (e) {
                console.error('Failed to load saved class lists:', e);
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const tracker = new ParticipationTracker();
