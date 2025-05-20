# Vanshavali - Your DNA Story Explorer 🧬

Welcome to Vanshavali, an interactive DNA analysis tool that helps you discover your genetic history. This application allows you to explore population genetics and analyze DNA data through an intuitive web interface.

## Features 🌟

### 1. Interactive Population Map 🗺️
- View global population distribution
- Color-coded markers for different timeframes:
  - Modern populations (Blue)
  - Bronze Age populations (Red)
  - Paleolithic populations (Green)
- Click markers to view detailed population information

### 2. DNA Analysis Tools 🧪
- Upload and analyze your DNA data
- Calculate genetic distances to reference populations
- View ancestry breakdown and proportions
- Discover maternal and paternal haplogroups
- Compare populations using FST calculations

### 3. Visualization 📊
- Interactive charts showing ancestry proportions
- Population comparison tools
- Genetic distance visualizations
- PCA (Principal Component Analysis) plots

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vanshavali.git
cd vanshavali
```

2. Set up the client:
```bash
cd client
npm install
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Set up the server:
```bash
cd ../server
npm install
# Create .env with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/vanshavali
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
```

5. Run the application:
```bash
# In the server directory
npm run dev

# In the client directory (new terminal)
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Using the DNA Upload Feature 🧬

1. Prepare your DNA data file:
   - Supported formats: .txt or .csv
   - Each line should contain: marker_id,value
   - Example:
     ```
     rs4477212,0.72
     rs3094315,0.25
     rs3131972,0.48
     ```

2. Upload your file:
   - Click the "Upload DNA" tab
   - Select your DNA data file
   - Click "Upload and Analyze"

3. View your results:
   - Ancestry breakdown
   - Nearest populations
   - Haplogroup information
   - Population comparisons

## Technical Details 🔧

### Frontend (Next.js)
- TypeScript for type safety
- shadcn-ui components
- Leaflet for maps
- Chart.js for visualizations
- Axios for API communication

### Backend (Express)
- TypeScript
- MongoDB database
- File upload handling with Multer
- DNA analysis algorithms
- RESTful API endpoints

## Contributing 🤝

We welcome contributions! Please feel free to submit pull requests, create issues, or suggest new features.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Population data sourced from academic genetic studies
- Built with modern web technologies
- Inspired by genetic genealogy tools 