# Vanshavali - Your DNA Story Explorer 🧬

Hey there! Welcome to Vanshavali, your super cool DNA analysis tool that helps you discover your genetic history. Let me explain what this project is all about in a way that's easy to understand!

## What is Vanshavali? 🤔

Imagine you could build a family tree that goes back thousands of years! That's what Vanshavali helps you do, but using science instead of just written records. It looks at your DNA (the special code that makes you who you are) and compares it with DNA from different groups of people, both modern and ancient.

## How Does It Work? 🔍

1. **You Pick a Population**: First, you choose a population you want to learn about (like "North Indian" or "Iranian")
2. **Choose a Time Period**: Then pick a time period you're interested in (like "Modern" or "Bronze Age")
3. **Magic Happens**: Our special computer program analyzes the DNA and shows you:
   - How similar your chosen population is to other groups
   - What percentage of their DNA comes from different ancient groups
   - Cool charts and maps showing where these groups lived

## The Cool Features 🌟

### 1. Interactive Map 🗺️
- Shows all the populations we know about
- Different colored markers for different time periods:
  - Blue = Modern populations
  - Red = Bronze Age populations
  - Green = Paleolithic populations
- Click on any marker to learn more about that group

### 2. DNA Analysis Tools 🧪
- **Admixture Calculator**: Figures out what percentage of your DNA comes from different ancient groups
- **PCA Analysis**: Makes a special map showing how different groups are related
- **FST Calculator**: Measures how different two populations are from each other

### 3. Beautiful Charts 📊
- Pie charts showing DNA percentages
- Tables with detailed numbers
- Easy-to-read results that you can share

## For the Tech-Savvy 🤓

### Frontend (Client)
- Built with Next.js and TypeScript
- Uses cool libraries:
  - shadcn-ui for beautiful components
  - Leaflet for interactive maps
  - Chart.js for pretty charts
  - Axios for talking to the server

### Backend (Server)
- Express.js with TypeScript
- MongoDB for storing population data
- Special calculations for:
  - Admixture analysis
  - Principal Component Analysis (PCA)
  - FST calculations

## How to Use It 📱

1. **Start the Program**:
   ```bash
   # Start the server
   cd server
   npm install
   npm run dev

   # Start the client
   cd client
   npm install
   npm run dev
   ```

2. **Load the Website**:
   - Open your web browser
   - Go to `http://localhost:3000`

3. **Start Exploring**:
   - Click around the map
   - Select populations
   - Run analyses
   - Share your results!

## For Developers 👩‍💻👨‍💻

### API Endpoints

All our API endpoints start with `http://localhost:5000/api`

#### Populations
- `GET /populations` - Get all populations
- `GET /populations/:id` - Get one population
- `POST /populations` - Add a new population
- `PUT /populations/:id` - Update a population
- `DELETE /populations/:id` - Remove a population

#### Analysis
- `POST /analysis/admixture` - Calculate admixture
- `POST /analysis/pca` - Run PCA analysis
- `POST /analysis/fst` - Calculate FST

### Example API Calls

Here's how to use our API with Postman:

```json
{
  "info": {
    "name": "Vanshavali API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Populations",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/populations"
      }
    },
    {
      "name": "Calculate Admixture",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/analysis/admixture",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": {
            "targetPopulation": "population_id_here",
            "sourceDataset": "bronze_age"
          }
        }
      }
    },
    {
      "name": "Calculate PCA",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/analysis/pca",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": {
            "geneticData": {
              "marker1": 0.5,
              "marker2": 0.3
            }
          }
        }
      }
    },
    {
      "name": "Calculate FST",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/analysis/fst",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": {
            "population1": "population_id_1",
            "population2": "population_id_2"
          }
        }
      }
    }
  ]
}
```

## Need Help? 🆘

If you get stuck or have questions:
1. Check if MongoDB is running
2. Make sure all npm packages are installed
3. Check the console for error messages
4. Make sure your .env files are set up correctly

## Fun Facts! 🎨

- We use real genetic data from scientific studies
- The map shows actual locations where ancient people lived
- The colors on the map have special meanings
- You can see how people moved around over thousands of years

## What's Next? 🚀

We're always making Vanshavali better! Here are some cool things we might add:
- More ancient populations
- 3D visualizations
- Time-travel view of population movements
- Family tree builder
- DNA file upload feature

Remember: Your DNA is like a history book that's been passed down through generations. Vanshavali helps you read that book! 📚✨ 