const eyedropperButton = document.querySelector("button#eyedropper");
const selectedColorDiv = document.querySelector("#selected-color");
const shadeCardContainers = document.querySelectorAll('.shade-card-container');
const shadeCards = document.querySelectorAll('.shade-card');
const shadeCardLabels = document.querySelectorAll('.shade-card-container p')
const hexInputField = document.querySelector('#hex');

window.addEventListener('load', () => {
    const randomHexColor = chroma.random().hex();
    selectedColorDiv.style.backgroundColor = randomHexColor;
    setShades(generateShades(randomHexColor))
});

eyedropperButton.addEventListener('click', async () => {
    try {
        const eyeDropper = new EyeDropper();
        const selectedColor = await eyeDropper.open();
        selectedColorDiv.style.backgroundColor = selectedColor.sRGBHex;
        setShades(generateShades(selectedColor.sRGBHex));
        // alert("Selected color: " + selectedColor.sRGBHex);

    } catch (error) {
        console.error("Error while using the eyedropper:", error);
    }
});

function setSelectedHex(hex) {
    hexInputField.value = hex;
}

function setShades(shades) {
    shadeCardContainers.forEach((_, index) => {
        shadeCards[index].style.backgroundColor = shades[index];
        shadeCardLabels[index].innerText = shades[index];
    });

}

function RGBToHex(rgbArray) {
    // Destructure the array into individual components
    const [r, g, b] = rgbArray;
    
    // Ensure values are within the range [0, 255]
    const clamp = (value) => Math.min(255, Math.max(0, value));
    const clampedR = clamp(r);
    const clampedG = clamp(g);
    const clampedB = clamp(b);
    
    // Convert each component to hexadecimal and concatenate them
    const hexR = clampedR.toString(16).padStart(2, '0');
    const hexG = clampedG.toString(16).padStart(2, '0');
    const hexB = clampedB.toString(16).padStart(2, '0');
    
    return `#${hexR}${hexG}${hexB}`;
}

function hexToHSL(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;

    // Find max and min values for RGB
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2; // Calculate lightness

    if (max === min) {
        h = s = 0; // Achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h, s, l };
}

function generateShades(baseColor, numOfShades = 11) {
    setSelectedHex(baseColor)
    const shades = new Array(numOfShades).fill('');

    const labColor = chroma(baseColor).lab();
    const lightness = labColor[0];

    const initialIndex = Math.floor(numOfShades - ((lightness/100 * numOfShades)));
    const index =  initialIndex > 0 ? initialIndex : 0 // pwede na muna 'to

    shades[index] = baseColor;

    for(i = index; i<=numOfShades-1; i++) {
        if(i == index) {
            continue;
        }

        const color = new Values(shades[i-1]);
        shades[i] = RGBToHex(color.shade(25).rgb);
    }

    let innerCounter = 0;
    for(i = index; i >= 0; i--) {
        if(i == index) {
            continue;
        }
        
        const color = new Values(shades[i+1]);
        shades[i] = RGBToHex(color.tint(35).rgb);
        innerCounter++;
    }

    return shades;
}
