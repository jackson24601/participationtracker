class ParticipationTracker {
    constructor() {
        this.students = [];
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

    saveToLocalStorage() {
        localStorage.setItem('participationTracker', JSON.stringify(this.students));
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
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const tracker = new ParticipationTracker();
