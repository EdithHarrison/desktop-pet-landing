# Desktop Pet Landing Page

A beautiful, modern landing page for the Desktop Pet application. This landing page showcases the app's features, provides download links, and offers a professional presentation for potential users.

## 🚀 Features

- **Modern Design**: Clean, responsive design with smooth animations
- **Mobile-First**: Fully responsive across all device sizes
- **Interactive Elements**: Smooth scrolling, hover effects, and animations
- **Download Integration**: Ready for GitHub Actions artifact integration
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized CSS and JavaScript

## 📁 Project Structure

```
desktop-pet-landing/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Design Features

### Hero Section
- Gradient background with floating pet animation
- Call-to-action buttons for Windows and macOS
- Statistics display (users, rating, price)
- Responsive layout

### Features Section
- 6 key features with icons and descriptions
- Hover animations and card effects
- Grid layout that adapts to screen size

### Screenshots Section
- Placeholder areas for app screenshots
- Hover effects and descriptions
- Easy to replace with actual screenshots

### Download Section
- Platform-specific download cards
- System requirements
- File size and format information
- Download button integration ready

### Support Section
- Help resources and links
- Community and documentation access
- Contact information

## 🔧 Customization

### Colors
The main color scheme uses:
- Primary: `#6366f1` (Indigo)
- Secondary: `#fbbf24` (Amber)
- Background: `#f8fafc` (Slate)
- Text: `#1e293b` (Dark slate)

### Fonts
- Primary: Inter (Google Fonts)
- Fallback: System fonts

### Animations
- Smooth scrolling navigation
- Fade-in animations on scroll
- Hover effects on interactive elements
- Floating pet animation in hero

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🚀 Deployment

### GitHub Pages
1. Push this repository to GitHub
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/desktop-pet-landing`

### Custom Domain
1. Add a `CNAME` file with your domain name
2. Configure DNS settings to point to GitHub Pages
3. Update repository settings

## 🔗 Integration with Desktop Pet App

### Download Links
Update the download buttons in `index.html` to point to your actual download URLs:

```html
<!-- Windows Download -->
<a href="YOUR_WINDOWS_DOWNLOAD_URL" class="btn btn-download" id="download-windows">

<!-- macOS Download -->
<a href="YOUR_MACOS_DOWNLOAD_URL" class="btn btn-download" id="download-macos">
```

### Screenshots
Replace the placeholder screenshots in the screenshots section with actual app screenshots:

```html
<div class="screenshot-placeholder">
    <img src="path/to/your/screenshot.png" alt="Desktop Pet in action">
</div>
```

### GitHub Links
Update the GitHub and support links to point to your actual repositories and contact information.

## 🛠️ Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server: `python -m http.server 8000`

### Making Changes
- **HTML**: Edit `index.html` for content and structure
- **CSS**: Edit `styles.css` for styling and layout
- **JavaScript**: Edit `script.js` for interactive functionality

## 📄 License

This landing page is part of the Desktop Pet project. Please refer to the main project's license for usage terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices and browsers
5. Submit a pull request

## 📞 Support

For questions about this landing page or the Desktop Pet app, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for the Desktop Pet community**
