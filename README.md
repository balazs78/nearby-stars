# Nearby Stars

**Version:** 1.0.0

Nearby Stars is an interactive 3D visualization of 28,800 stars within 100 parsecs (about 326 light-years) of the Sun. The visualization uses real astronomical data from the SIMBAD database and can simulate stellar motion over time using real motion data.

## Features

- Explore the stars in a rotatable, zoomable 3D scene.
- Adjust the absolute-magnitude limit and star disk size.
- Select a star to view its available information.
- Run, pause, reset, and adjust the speed of the motion simulation.
- View a scale bar in light-years and parsecs.

## Controls

| Action | Control |
| --- | --- |
| Rotate the scene | Drag with the left mouse button |
| Pan the scene | Drag with the right mouse button |
| Zoom in or out | Mouse wheel |
| View star information | Ctrl + click a star |
| Start or pause the simulation | Play/pause button |
| Return to the starting positions | Reset button |
| Change simulation speed | Speed slider |
| Filter stars by absolute magnitude | Absolute magnitude slider |
| Change star disk size | Star disk size slider |

Use the **About** and **Help** buttons in the lower-right corner for an overview and an in-app controls guide.

## Run locally

Requires [Node.js](https://nodejs.org/) and npm.

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the development server:

   ```sh
   npm run dev
   ```

3. Open the local URL printed by Vite in your browser.

To create a production build, run:

```sh
npm run build
```

To preview the production build locally, run:

```sh
npm run preview
```

## Data

The application loads the star catalog from [`stars.csv`](./stars.csv). The scene and interaction controls are implemented with
[Three.js](https://threejs.org/), and [Vite](https://vite.dev/) provides the development server and production build.
