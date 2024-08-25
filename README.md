# Aero2Astro Assessment App

## Drone Pilot Finder

Drone Pilot Finder is a web application that helps you locate and match drone pilots based on their experience and proximity to a given location. The app uses React, Next.js, and React-Leaflet to provide an interactive map interface and pilot matching functionality.

## Features

- Interactive map display using React-Leaflet
- Pilot location mapping with information tooltips
- Admin (user) location detection and display
- Pilot matching based on experience and distance
- Filtration of pilots based on range from a given location
- Sorting functionality for matched pilots

## Screenshots
![Screenshot1](https://i.ibb.co/zXsm8w0/Screenshot-2024-08-25-061313.png)
![Screenshot2](https://i.ibb.co/m6Q0MHQ/Screenshot-2024-08-25-061354.png)
![Screenshot3](https://i.ibb.co/mqRwhm4/Screenshot-2024-08-25-061420.png)

## Tech Stack

- React
- Next.js
- React-Leaflet
- Leaflet
- TypeScript
- Tailwind CSS
- Bun

## Setup and Installation

1. Clone the repository:
   `git clone https://github.com/0xSalik/aero2astro-assessment`
2. Navigate to the project directory:
   `cd aero2astro-assessment`
3. Install dependencies:
   `bun install`
4. Run the development server:
   `bun run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter latitude and longitude coordinates in the search fields.
2. Adjust the range slider to set the search radius in kilometers.
3. Click "Search" to find pilots within the specified range.
4. Use the "Use My Location" button to use your current location for the search.
5. View matched pilots on the map and in the table below.
6. Sort the matched pilots table by clicking on the column headers.

## API

The application uses a mock API to fetch pilot data. In a production environment, you would replace this with a real backend API.

## Deployment

This application can be easily deployed on platforms like Vercel or Netlify. Follow the platform-specific instructions for deploying a Next.js application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
