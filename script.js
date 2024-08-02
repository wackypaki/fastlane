import { supabase } from './supabaseClient.js';

async function fetchVehicleData() {
    try {
        const listingId = 1;  // Replace this with dynamic ID if necessary
        const { data: vehicleListing, error: listingError } = await supabase
            .from('vehicle_listings')
            .select(`
                id,
                price,
                market_price,
                main_image,
                description,
                location:locations(location),
                year:years(year),
                make:makes(make),
                model:models(model),
                trim:trims(trim),
                vin,
                body_style,
                engine,
                transmission,
                miles,
                color,
                title,
                registration
            `)
            .eq('id', listingId)
            .single();

        if (listingError) throw listingError;

        // Update the HTML with the fetched data
        document.querySelector('#vehicle-title').textContent = `${vehicleListing.year.year} ${vehicleListing.make.make} ${vehicleListing.model.model} | $${vehicleListing.price}`;
        document.querySelector('.main-image img').src = vehicleListing.main_image;
        document.querySelector('#asking-price').textContent = `$${vehicleListing.price}`;
        document.querySelector('#market-price').textContent = `$${vehicleListing.market_price}`;
        document.querySelector('#price-analysis').innerHTML = calculatePriceAnalysis(vehicleListing.price, vehicleListing.market_price);
        document.querySelector('.description').textContent = vehicleListing.description;
        document.querySelector('.location').textContent = vehicleListing.location.location;
        document.querySelector('.vin').textContent = vehicleListing.vin;
        document.querySelector('.year-make-model').textContent = `${vehicleListing.year.year} ${vehicleListing.make.make} ${vehicleListing.model.model}`;
        document.querySelector('.trim').textContent = vehicleListing.trim.trim;
        document.querySelector('.body_style').textContent = vehicleListing.body_style;
        document.querySelector('.engine').textContent = vehicleListing.engine;
        document.querySelector('.transmission').textContent = vehicleListing.transmission;
        document.querySelector('.miles').textContent = vehicleListing.miles;
        document.querySelector('.color').textContent = vehicleListing.color;
        document.querySelector('.title').textContent = vehicleListing.title;
        document.querySelector('.registration').textContent = vehicleListing.registration;

        // Fetch and display images
        const { data: images, error: imagesError } = await supabase
            .from('images')
            .select('*')
            .eq('listing_id', vehicleListing.id);

        if (imagesError) throw imagesError;

        displayImages(images, 'exterior');
        displayImages(images, 'interior');
        displayImages(images, 'engine');

        // Fetch and display common problems and their resolution status for this vehicle
        const { data: vehicleProblems, error: problemsError } = await supabase
            .from('vehicle_problems')
            .select('*, common_problems(description)')
            .eq('listing_id', vehicleListing.id);

        if (problemsError) throw problemsError;

        displayProblems(vehicleProblems);

        // Render price history chart
        const priceHistory = [
            { month: 'January', price: 32000 },
            { month: 'February', price: 34000 },
            { month: 'March', price: 33000 },
            { month: 'April', price: 35000 },
            { month: 'May', price: 36000 },
            { month: 'June', price: 37000 },
            { month: 'July', price: 35500 }
        ]; // Replace with actual data if available
        renderPriceHistoryChart(priceHistory);

    } catch (error) {
        console.error('Error fetching vehicle data:', error);
    }
}

function calculatePriceAnalysis(askingPrice, marketPrice) {
    const percentage = ((askingPrice - marketPrice) / marketPrice) * 100;
    const analysisText = `${percentage.toFixed(2)}% ${percentage > 0 ? 'Above Market Price' : 'Below Market Price'}`;
    const analysisClass = percentage > 0 ? 'above' : 'below';
    return `${analysisText}<span class="tooltip">It is important to take price factors into consideration when analyzing the vehicle's price. Some vehicles have more desirable options and therefore priced higher than the average market price</span>`;
}

function displayImages(images, type) {
    const container = document.getElementById(type);
    container.innerHTML = '';  // Clear existing images
    images.filter(img => img.type === type).forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.url;
        imgElement.alt = `${type} Image`;
        container.appendChild(imgElement);
    });
}

function displayProblems(vehicleProblems) {
    const problemsTable = document.getElementById('common-problems');
    vehicleProblems.forEach(problem => {
        const row = problemsTable.insertRow();
        const descriptionCell = row.insertCell(0);
        const resolvedCell = row.insertCell(1);
        descriptionCell.textContent = problem.common_problems.description;
        resolvedCell.textContent = problem.resolved ? 'Resolved' : 'Unresolved';
    });
}

function renderPriceHistoryChart(priceHistory) {
    const ctx = document.getElementById('priceHistoryChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: priceHistory.map(entry => entry.month),
            datasets: [{
                label: 'Sold Price',
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                data: priceHistory.map(entry => entry.price)
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price ($)'
                    }
                }
            }
        }
    });
}

window.onload = function() {
    fetchVehicleData();
}
