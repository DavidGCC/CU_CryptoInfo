const API_KEY = "59de99c6-7ed0-4513-8310-831221f8bf11";
const COINS_API_ENDPOINT = "/v1/cryptocurrency/map";
const COIN_INFO_API_ENDPOINT = "/v1/cryptocurrency/quotes/latest";
const COIN_METADATA_API_ENDPOINT = "/v1/cryptocurrency/info";
const PROXY_URL = "https://powerful-atoll-78162.herokuapp.com"

const createRow = table => {
    // EMPTY ROW
    const row = table.insertRow(-1);
    // EMPTY CELLS
    for (let i = 0; i < 6; i++) {
        row.insertCell(i);
    }
    return row;
}

window.addEventListener("DOMContentLoaded", async () => {
    const table = document.getElementById("main-table");
    const addButton = document.getElementById("add-button");
    const coinInput = document.getElementById("coin-input");
    try {
        const response = await fetch(`${PROXY_URL}${COINS_API_ENDPOINT}?CMC_PRO_API_KEY=${API_KEY}`);
        const data = await response.json();
        data.data.forEach(coin => {
            const option = document.createElement("option");
            option.id = coin.id;
            option.value = coin.slug;
            option.text = coin.name;
            coinInput.add(option);
        });
    } catch (err) {
        console.log(err);
    }
    addButton.addEventListener("click", async (e) => {
        e.preventDefault();
        if (coinInput.value === "") {
            alert("Please Select Coin To Add");
            return;
        }
        try {
            const selectedId = coinInput.options[coinInput.selectedIndex].id;
            const [ quotes, meta ] = await Promise.all([
                fetch(`${PROXY_URL}${COIN_INFO_API_ENDPOINT}?CMC_PRO_API_KEY=${API_KEY}&id=${selectedId}`),
                fetch(`${PROXY_URL}${COIN_METADATA_API_ENDPOINT}?CMC_PRO_API_KEY=${API_KEY}&id=${selectedId}`)
            ]);
            const [ quotesJson, metaJson ] = await Promise.all([
                quotes.json(),
                meta.json()
            ]);
            const row = createRow(table);
            row.cells[0].innerHTML = `<a href=${metaJson.data[selectedId].urls.website} target="__blank"><img src=${metaJson.data[selectedId].logo} width="32" height="32"></a>`;
            row.cells[1].textContent = quotesJson.data[selectedId].name;
            row.cells[2].textContent = Math.round(100 * Number(quotesJson.data[selectedId].quote["USD"].price)) / 100;
            row.cells[3].textContent = quotesJson.data[selectedId].max_supply;
            row.cells[4].textContent = quotesJson.data[selectedId].total_supply;
            row.cells[5].textContent = quotesJson.data[selectedId].tags.includes("mineable") ? "Mineable" : "Non-Mineable";
        } catch (err) {
            console.log(err);
        }
    });

});

// TODO
// save added coin to localStorage
// add 1h 24h 7d 30d change with ability to toggle
// find select library with search
// add remove button to each added coin