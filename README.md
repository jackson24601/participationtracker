# 📚 Student Participation Tracker

A simple, beautiful web-based application for tracking student participation in class. Perfect for teachers who want an easy way to monitor and record student engagement.

## ✨ Features

### Two-Screen Workflow

1. **Setup Screen** - Add and manage your student list
2. **Tracking Screen** - Click student cards to award participation points

### Key Capabilities

- ✅ **Easy Student Management** - Quickly add or remove students
- ✅ **One-Click Point Tracking** - Simply click a student's card to add a point
- ✅ **Visual Feedback** - Smooth animations provide instant feedback
- ✅ **Real-Time Summary** - See participation rankings at a glance
- ✅ **Email Reports** - Send yourself a formatted summary via email
- ✅ **Data Persistence** - Student lists and points are automatically saved
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **No Installation Required** - Just open in any modern web browser

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Add student names on the first screen
3. Click "Start Tracking" to begin
4. Click on student cards to award participation points
5. Use "Email Summary" when class is finished

### Running Locally

If you need to serve the files (e.g., for testing):

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have npx)
npx serve
```

Then open http://localhost:8000 in your browser.

## 📖 Usage Guide

### Adding Students

1. On the initial screen, type a student's name in the input field
2. Press Enter or click "Add Student"
3. Repeat for all students in your class
4. Click "Start Tracking" when ready

### Tracking Participation

1. Click on any student's card to award one participation point
2. Points update instantly with visual feedback
3. The summary section shows current standings
4. Continue clicking throughout your class session

### Managing Points

- **Reset Points**: Click "Reset All Points" to start fresh (useful for a new class session)
- **View Summary**: The summary section automatically updates and sorts students by points
- **Email Summary**: Click "📧 Email Summary" to generate a report you can email to yourself

### Other Actions

- **Back to Setup**: Return to add or remove students
- **Auto-Save**: All data is automatically saved to your browser

## 🎨 Design Highlights

- Modern, clean interface with gradient backgrounds
- Smooth animations and transitions
- Color-coded sections for easy navigation
- Mobile-friendly responsive layout
- Professional card-based design

## 🔒 Privacy & Data

- All data is stored locally in your browser (localStorage)
- No data is sent to any server
- Email functionality uses your device's default email client
- No tracking or analytics
- Works completely offline (after initial load)

## 💻 Technical Details

### Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with Grid and Flexbox
- **JavaScript (ES6+)** - Class-based architecture
- **LocalStorage API** - Data persistence

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### No Dependencies

This project has zero external dependencies. No frameworks, no libraries, no build tools required!

## 📧 Email Format

When you click "Email Summary", a formatted report is generated containing:

- Date of the report
- Total number of students
- Total points awarded
- Individual participation breakdown (sorted by points)

The email opens in your default email client, ready to send to yourself or others.

## 🛠️ Customization

Feel free to customize the application by editing:

- `styles.css` - Colors, fonts, layouts, animations
- `script.js` - Behavior, point values, sorting logic
- `index.html` - Structure, text labels, button names

## 📝 License

This project is open source and available for educational use.

## 🤝 Contributing

Suggestions and improvements are welcome! Some ideas for future enhancements:

- Export to CSV
- Print-friendly view
- Multiple point values
- Session history
- Class roster import
- Participation trends over time

---

**Made with ❤️ for teachers everywhere**
