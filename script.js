// Alustetaan pelin rahamäärä ja kuvavaihtoehdot
let rahat = 100;
const kuvat = [
    'images/faarao.png',
    'images/kielo.png',
    'images/iris.png',
    'images/markka.png',
    'images/balto.png'
];
let lukitut = [false, false, false, false]; // lukittujen rullien tilat
const rullat = document.querySelectorAll('.rulla img');

// Päivitetään alkutilanne
document.getElementById('rahat').innerText = rahat;
document.getElementById('pelaa').addEventListener('click', pyoraytaRullat);

// Lukitaan tai vapautetaan rulla klikkaamalla
rullat.forEach((rulla, i) => {
    rulla.addEventListener('click', () => {
        lukitut[i] = !lukitut[i]; // Vaihdetaan lukitus
        rulla.parentElement.style.border = lukitut[i] ? '3px solid red' : '2px solid black';
    });
});

function pyoraytaRullat() {
    let panos = parseInt(document.getElementById('panos').value);
    
    // Tarkistetaan, ettei panos ole suurempi kuin käytössä olevat rahat
    if (panos > rahat) {
        document.getElementById('viesti').innerText = 'Ei tarpeeksi rahaa.';
        return;
    }

    // Päivitetään rahamäärä
    rahat -= panos;
    document.getElementById('rahat').innerText = rahat;
    document.getElementById('viesti').innerText = '';

    // Arvotaan kuvat rullille, ellei rulla ole lukittu
    rullat.forEach((rulla, i) => {
        if (!lukitut[i]) {
            let randomIndex = Math.floor(Math.random() * kuvat.length);
            rulla.src = kuvat[randomIndex];
        }
    });

    // Tarkistetaan mahdollinen voitto
    tarkistaVoitto(panos);
    
    // Vapautetaan lukitut rullat seuraavaa pelikierrosta varten
    lukitut = [false, false, false, false];
    rullat.forEach(rulla => rulla.parentElement.style.border = '2px solid black');
}

function tarkistaVoitto(panos) {
    const tulokset = Array.from(rullat).map(rulla => rulla.src);
    
    const voittoKertoimet = {
        'balto': 6,
        'faarao': 4,
        'markka': 5,
        'iris': 3,
        'kielo': 10
    };

    let voitto = 0;

    // Neljä samaa
    if (tulokset.every(src => src === tulokset[0])) {
        let hedelma = tulokset[0].split('/').pop().split('.')[0]; // Haetaan kuvan nimi
        voitto = voittoKertoimet[hedelma] * panos;
    }
    // Kolme 7
    else if (tulokset.filter(src => src.includes('numero7')).length === 3) {
        voitto = 5 * panos;
    }

    // Ilmoitetaan pelaajalle voitto ja päivitetään rahamäärä
    if (voitto > 0) {
        document.getElementById('viesti').innerText = `Voitit ${voitto}€!`;
        rahat += voitto;
    } else {
        document.getElementById('viesti').innerText = 'Ei voittoa tällä kertaa.';
    }

    // Päivitetään rahamäärä
    document.getElementById('rahat').innerText = rahat;
}
