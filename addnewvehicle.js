<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Vehicle Listing</title>
    <link rel="stylesheet" href="styles.css">
    <script type="module">
        import { supabase } from './supabaseClient.js';

        async function fetchInitialData() {
            // Fetch years
            const { data: years, error: yearsError } = await supabase.from('years').select('*');
            if (yearsError) console.error('Error fetching years:', yearsError);
            const yearSelect = document.getElementById('year');
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year.id;
                option.textContent = year.year;
                yearSelect.appendChild(option);
            });

            // Fetch makes
            const { data: makes, error: makesError } = await supabase.from('makes').select('*');
            if (makesError) console.error('Error fetching makes:', makesError);
            const makeSelect = document.getElementById('make');
            makes.forEach(make => {
                const option = document.createElement('option');
                option.value = make.id;
                option.textContent = make.make;
                makeSelect.appendChild(option);
            });

            // Fetch locations
            const { data: locations, error: locationsError } = await supabase.from('locations').select('*');
            if (locationsError) console.error('Error fetching locations:', locationsError);
            const locationSelect = document.getElementById('location');
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = location.location;
                locationSelect.appendChild(option);
            });
        }

        async function fetchModels() {
            const makeId = document.getElementById('make').value;
            const { data: models, error: modelsError } = await supabase.from('models').select('*').eq('make_id', makeId);
            if (modelsError) console.error('Error fetching models:', modelsError);
            const modelSelect = document.getElementById('model');
            modelSelect.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.model;
                modelSelect.appendChild(option);
            });
        }

        async function fetchGenerations() {
            const modelId = document.getElementById('model').value;
            const { data: generations, error: generationsError } = await supabase.from('generations').select('*').eq('model_id', modelId);
            if (generationsError) console.error('Error fetching generations:', generationsError);
            const generationSelect = document.getElementById('generation');
            generationSelect.innerHTML = '';
            generations.forEach(generation => {
                const option = document.createElement('option');
                option.value = generation.id;
                option.textContent = generation.generation;
                generationSelect.appendChild(option);
            });
        }

        async function createListing(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const listingData = {
                year_id: formData.get('year'),
                make_id: formData.get('make'),
                model_id: formData.get('model'),
                trim_id: formData.get('trim'),
                vin: formData.get('vin'),
                description: formData.get('description'),
                location_id: formData.get('location'),
                price: formData.get('price'),
                market_price: formData.get('market_price'),
                main_image: formData.get('main_image')
            };

            const { data, error } = await supabase.from('vehicle_listings').insert([listingData]);
            if (error) {
                console.error('Error creating listing:', error);
            } else {
                console.log('Listing created:', data);
                // Redirect or show success message
            }
        }

        window.onload = function() {
            fetchInitialData();
            document.getElementById('make').addEventListener('change', fetchModels);
            document.getElementById('model').addEventListener('change', fetchGenerations);
            document.getElementById('listing-form').addEventListener('submit', createListing);
        }
    </script>
</head>
<body>
    <h1>Create Vehicle Listing</h1>
    <form id="listing-form">
        <label for="year">Year:</label>
        <select id="year" name="year" required></select>

        <label for="make">Make:</label>
        <select id="make" name="make" required></select>

        <label for="model">Model:</label>
        <select id="model" name="model" required></select>

        <label for="generation">Generation:</label>
        <select id="generation" name="generation" required></select>

        <label for="vin">VIN:</label>
        <input type="text" id="vin" name="vin" required>

        <label for="description">Description:</label>
        <textarea id="description" name="description" required></textarea>

        <label for="location">Location:</label>
        <select id="location" name="location" required></select>

        <label for="price">Price:</label>
        <input type="number" id="price" name="price" required>

        <label for="market_price">Market Price:</label>
        <input type="number" id="market_price" name="market_price" required>

        <label for="main_image">Main Image URL:</label>
        <input type="text" id="main_image" name="main_image" required>

        <button type="submit">Create Listing</button>
    </form>
</body>
</html>
