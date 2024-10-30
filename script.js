let rahat = 100;
const kuvat = [
    'images/faarao.png',
    'images/kielo.png',
    'images/iris.png',
    'images/markka.png',
    'images/balto.png'
];
let lukitut = [false, false, false, false]; // Lukittujen rullien tilat
let ensimmainenKierros = true; // Seuraa, onko kyseessä ensimmäinen kierros vai toinen
const rullat = document.querySelectorAll('.rulla img');

// Päivitetään alkutilanne
document.getElementById('rahat').innerText = rahat;
document.getElementById('pelaa').addEventListener('click', pyoraytaRullat);

// Lukitaan tai vapautetaan rulla klikkaamalla
rullat.forEach((rulla, i) => {
    rulla.addEventListener('click', () => {
        if (!ensimmainenKierros) { // Vain toisella kierroksella voi lukita kuvia
            lukitut[i] = !lukitut[i]; // Vaihdetaan lukitus
            rulla.parentElement.style.border = lukitut[i] ? '3px solid red' : '2px solid black';
        } else {
            document.getElementById('viesti').innerText = 'Tällä kierroksella et voi vielä lukita!';
        }
    });
});

function pyoraytaRullat() {
    let panos = parseInt(document.getElementById('panos').value);

    // Tarkistetaan, ettei panos ole suurempi kuin käytössä olevat rahat
    if (panos > rahat) {
        document.getElementById('viesti').innerText = 'Ei tarpeeksi rahaa.';
        return;
    }

    // Päivitetään rahamäärä vain ensimmäisellä kierroksella
    if (ensimmainenKierros) {
        rahat -= panos;
        document.getElementById('rahat').innerText = rahat;
    }

    document.getElementById('viesti').innerText = '';

    // Arvotaan kuvat rullille, ellei rulla ole lukittu
    rullat.forEach((rulla, i) => {
        if (!lukitut[i]) {
            let randomIndex = Math.floor(Math.random() * kuvat.length);
            rulla.src = kuvat[randomIndex];
        }
    });

    // Tarkistetaan mahdollinen voitto
    let voitto = tarkistaVoitto(panos);

    if (voitto > 0 || !ensimmainenKierros) {
        // Jos saatiin voitto tai toinen kierros on ohi, vapautetaan lukitut rullat seuraavaa pelikierrosta varten
        lukitut = [false, false, false, false];
        rullat.forEach(rulla => rulla.parentElement.style.border = '2px solid black');
        ensimmainenKierros = true; // Nollataan ensimmäinen kierros seuraavaa pelikierrosta varten
    } else {
        // Jos ei saatu voittoa ensimmäisellä kierroksella, siirrytään toiseen kierrokseen
        ensimmainenKierros = false;
        document.getElementById('viesti').innerText = 'Lukitse haluamasi rullat ja pelaa uudelleen!';
    }
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
        document.getElementById('rahat').innerText = rahat;
    } else {
        document.getElementById('viesti').innerText = 'Ei voittoa tällä kertaa.';
    }

    return voitto;
}
