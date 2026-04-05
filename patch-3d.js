const fs = require('fs');
let s = fs.readFileSync('src/lib/templateEngine.js', 'utf8');

const sOld = \            createScene('hero-3d-canvas', 0); // Always use TorusKnot for Hero  
            createScene('about-3d-canvas', \\\);
        })();\;

const sNew = \            const initScenes = () => {
                createScene('hero-3d-canvas', 0);
                createScene('about-3d-canvas', \\\);
                
                // Backup check to resize if dimensions were 0 initially
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 500);
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initScenes);
            } else {
                initScenes();
            }
        })();\;

s = s.replace(sOld, sNew);

fs.writeFileSync('src/lib/templateEngine.js', s);
console.log('patched 3d');
