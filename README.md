# Disney Characters Dashboard

## Installation

1. **Clone or navigate to the project directory:**
```bash
cd disney-dashboard
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## Running Tests

```bash
npm test
# or
yarn test
```

Run tests with coverage:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## API Integration

The application uses the Disney REST API:
- **Base URL:** `https://api.disneyapi.dev/character`
- **Documentation:** https://disneyapi.dev/docs/

The API service automatically fetches all characters on app load to enable full-text search and filtering capabilities across all available data.

## Usage Guide

### Searching Characters
1. Type in the "Search Characters" input field
2. Results filter in real-time as you type
3. Search works across all character names

### Filtering by TV Show
1. Click the "Filter by TV Show" dropdown
2. Select a TV show from the list
3. Table updates to show only characters in that TV show

### Sorting
1. Click the sort icon button
2. Characters are sorted alphabetically by name
3. Click again to toggle ascending/descending order

### Viewing Character Details
1. Click any row in the table
2. A modal opens with detailed character information
3. View image, TV shows, video games, and films

### Changing Page Size
1. Use the "Characters per page" dropdown at the bottom of the table
2. Select 10, 20, 50, 100, 200, or 500
3. The table and chart update automatically
