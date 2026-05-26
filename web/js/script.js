const API_URL = 'http://localhost:5000';

const form = document.getElementById('citaForm');
const missatge = document.getElementById('missatge');
const llistatCites = document.getElementById('llistatCites');
const btnCarregarCites = document.getElementById('btnCarregarCites');
const selectVehicle = document.getElementById('vehicle_id');


form.addEventListener('submit', async function (e) {

    e.preventDefault();

    const vehicle_id = document.getElementById('vehicle_id').value;
    const data_cita = document.getElementById('data_cita').value;
    const servei_sollicitat = document.getElementById('servei_sollicitat').value;

    try {

        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vehicle_id,
                data_cita,
                servei_sollicitat
            })
        });

        const result = await response.json();

        if (!response.ok) {

            missatge.textContent =
                result.error || 'Error en crear la cita';

            missatge.className = 'error';

            return;

        }

        missatge.textContent = result.message;
        missatge.className = 'success';

        form.reset();

        carregarCites();

    } catch (error) {

        missatge.textContent =
            'No s’ha pogut connectar amb l’API';

        missatge.className = 'error';

    }

});


btnCarregarCites.addEventListener('click', carregarCites);


async function carregarVehicles() {

    try {

        const response =
            await fetch(`${API_URL}/vehicles`);

        const vehicles =
            await response.json();

        vehicles.forEach(vehicle => {

            const option =
                document.createElement('option');

            option.value = vehicle.id;

            option.textContent =
                `${vehicle.matricula} - ${vehicle.model}`;

            selectVehicle.appendChild(option);

        });

    } catch (error) {

        console.error('Error carregant vehicles');

    }

}


async function carregarCites() {

    try {

        const response =
            await fetch(`${API_URL}/appointments`);

        const cites =
            await response.json();

        llistatCites.innerHTML = '';

        if (cites.length === 0) {

            llistatCites.innerHTML =
                '<p>No hi ha cites registrades.</p>';

            return;

        }

        cites.forEach(cita => {

            const div =
                document.createElement('div');

            div.className = 'cita';

            div.innerHTML = `
                <p><strong>ID cita:</strong> ${cita.id}</p>
                <p><strong>Vehicle:</strong> ${cita.matricula} - ${cita.model}</p>
                <p><strong>Data:</strong> ${cita.data_cita}</p>
                <p><strong>Servei:</strong> ${cita.servei_sollicitat}</p>
            `;

            llistatCites.appendChild(div);

        });

    } catch (error) {

        llistatCites.innerHTML =
            '<p class="error">No s’han pogut carregar les cites.</p>';

    }

}


carregarVehicles();
carregarCites();