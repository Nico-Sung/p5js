const SIZE = 600;

function setup() {
    // créer un canevas en SVG (p5.svg) et donner l'id 'art' à l'élément SVG
    const cnv = createCanvas(SIZE, SIZE, SVG);
    if (cnv && cnv.elt) cnv.elt.id = "art";
    angleMode(DEGREES);
    noLoop();
}

function draw() {
    translate(width / 2, height / 2);

    let nombreDePetales = 120;
    let rayonRosace = 280;

    noFill();

    for (let i = 0; i < nombreDePetales; i++) {
        let angle = map(i, 0, nombreDePetales, 0, 360);

        // Changement de couleur progressif basé sur l'angle
        // On passe du bleu au vert clair
        let c1 = color(50, 150, 255, 150);
        let c2 = color(150, 255, 200, 150);
        // lerpColor mélange deux couleurs selon une valeur entre 0 et 1
        stroke(lerpColor(c1, c2, i / nombreDePetales));
        strokeWeight(1);

        push();
        rotate(angle);

        // On calcule des points de contrôle qui bougent
        // selon le cosinus de l'angle actuel pour créer une torsion.
        let ctrlX1 = rayonRosace * 0.3;
        let ctrlY1 = cos(angle * 3) * 100; // Le point de contrôle oscille

        let ctrlX2 = rayonRosace * 0.8;
        let ctrlY2 = -cos(angle * 2) * 80; // L'autre oscille en sens inverse

        // La courbe part du centre (0,0) et va vers l'extérieur (rayonRosace, 0)
        // Les points de contrôle tordent le chemin.
        bezier(
            0,
            0, // Point de départ (centre)
            ctrlX1,
            ctrlY1, // Point de contrôle 1
            ctrlX2,
            ctrlY2, // Point de contrôle 2
            rayonRosace,
            0 // Point d'arrivée
        );

        // Petite décoration au bout
        push();
        translate(rayonRosace, 0);
        rotate(angle * 2); // Rotation locale rapide
        ellipse(0, 0, 10, 5);
        pop();

        pop();
    }

    fill(255, 255, 200);
    noStroke();
    circle(0, 0, 15);
}

/* --- FONCTIONS D'EXPORT --- */
// Télécharge l'élément SVG avec l'id 'art'
function downloadSVG(filename = "dessin.svg") {
    const svg = document.getElementById("art");
    if (!svg) {
        alert("SVG introuvable (id 'art')");
        return;
    }
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    // Ajouter namespace si manquant
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(
            /^<svg/,
            '<svg xmlns="http://www.w3.org/2000/svg"'
        );
    }

    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Télécharge une version PNG rasterisée de l'SVG
function downloadPNG(filename = "dessin.png") {
    const svg = document.getElementById("art");
    if (!svg) {
        alert("SVG introuvable (id 'art')");
        return;
    }
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    // Ensure namespace
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(
            /^<svg/,
            '<svg xmlns="http://www.w3.org/2000/svg"'
        );
    }

    // Ensure width/height and viewBox so rasterization works reliably
    let sourceWithSize = source;
    if (!sourceWithSize.match(/\bwidth=\b/)) {
        sourceWithSize = sourceWithSize.replace(
            /^<svg/,
            `<svg width="${SIZE}" height="${SIZE}"`
        );
    }
    if (!sourceWithSize.match(/viewBox=/)) {
        sourceWithSize = sourceWithSize.replace(
            /^<svg([^>]*)/,
            `<svg$1 viewBox="0 0 ${SIZE} ${SIZE}"`
        );
    }

    // Use a data URL (avoids some objectURL/cors issues) and encode properly
    const dataUrl =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(sourceWithSize);
    const img = new Image();

    img.onload = function () {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = SIZE;
            canvas.height = SIZE;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function (blob) {
                if (!blob) {
                    alert("Impossible de générer le PNG (blob vide)");
                    return;
                }
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, "image/png");
        } catch (err) {
            console.error(err);
            alert(
                "Erreur lors de la conversion SVG→PNG : voir la console pour détails."
            );
        }
    };

    img.onerror = function (e) {
        console.error("SVG->PNG image load error", e);
        alert(
            "Erreur lors du chargement de l'image SVG pour la conversion en PNG. Vérifiez la console."
        );
    };

    img.src = dataUrl;
}
