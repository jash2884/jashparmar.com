# jashparmar.com · Assembly

My portfolio, live at **[jashparmar.com](https://jashparmar.com)**.

One kit of glossy parts does everything on the page:

- **Hero:** the parts lie in a physics pile under my name. Push them, click to shake them, or drag the ring of screens above.
- **Assembly:** scrolling lifts the pile into the frame of a ring of curved screens. Each screen lights up with a real, auto-scrolling screenshot of a project.
- **Projects:** the camera dives into the ring. In front of each screen the parts build that project's object (a turntable, a hanger, an hourglass, a scoreboard…). Press **F** or click it and the object comes apart into six labelled parts ("how it works") while the screen behind flips to its engineering notes.
- **Contact:** the ring comes apart and the parts rain into a pile beside the email.

Day or night follows the time in India, with a manual switch. Keys: arrows to turn, **1 to 9** to jump, **F** to take apart.

## Built with

Plain HTML, CSS and JavaScript modules, no framework or build step.

- [three.js](https://threejs.org) r170: custom GLSL for the curved screens (cover-fit, auto-scroll, ripple, bend, flip, reflections), MeshPhysical parts, soft shadows
- [cannon-es](https://github.com/pmndrs/cannon-es) for the two piles only
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling on mouse and trackpad

It adapts to the device: a lighter mode on phones, and a frame-time governor that lowers resolution, then shadows, then reflections, if a device struggles. There is a plain-text fallback without WebGL, focus outlines for keyboard users and a screen-reader list of the projects.

## Files

| File | What it does |
|---|---|
| `index.html`, `style.css` | Page, editorial layout, loader (a small ring of screens that fills as images load) |
| `app.js` | Scene, scroll story, camera, physics piles, labels, interaction |
| `screens.js` | Screen shader and the canvas-drawn backs of the screens |
| `forms.js` | Every project object, built from the same pool of parts |
| `content.js` | Projects, how-it-works steps, experience and links |

Run locally with any static server, for example `npx serve .`
