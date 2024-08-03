async function fetchVehicleData() {
    try {
        const listingId = 3;  // Replace this with dynamic ID if necessary

        // Fetch vehicle listing data
        const { data: vehicleListing, error: listingError } = await window.supabaseClient
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

        console.log('Vehicle Listing:', vehicleListing);

        // Update the HTML with the fetched data
        document.querySelector('#vehicle-title').textContent = `${vehicleListing.year.year} ${vehicleListing.make.make} ${vehicleListing.model.model} | $${vehicleListing.price}`;
        if (vehicleListing.main_image) {
            document.querySelector('.main-image img').src = vehicleListing.main_image;
        }
        document.querySelector('#asking-price').textContent = `$${vehicleListing.price}`;
        document.querySelector('#market-price').textContent = `$${vehicleListing.market_price}`;
        document.querySelector('#price-analysis').innerHTML = calculatePriceAnalysis(vehicleListing.price, vehicleListing.market_price);
        document.querySelector('.description').textContent = vehicleListing.description;
        document.querySelector('.location').textContent = vehicleListing.location.location;
        document.querySelector('.vin').textContent = vehicleListing.vin;
        document.querySelector('.year-make-model').textContent = `${vehicleListing.year.year} ${vehicleListing.make.make} ${vehicleListing.model.model}`;
        document.querySelector('.trim').textContent = vehicleListing.trim.trim;
        document.querySelector('.engine').textContent = vehicleListing.engine;
        document.querySelector('.transmission').textContent = vehicleListing.transmission;
        document.querySelector('.miles').textContent = vehicleListing.miles;
        document.querySelector('.color').textContent = vehicleListing.color;
        document.querySelector('.title').textContent = vehicleListing.title;
        document.querySelector('.registration').textContent = vehicleListing.registration;

        // Fetch and display images
        const { data: images, error: imagesError } = await window.supabaseClient
            .from('images')
            .select('*')
            .eq('listing_id', vehicleListing.id);

        if (imagesError) throw imagesError;

        console.log('Images:', images);

        displayImages(images, 'exterior');
        displayImages(images, 'interior');
        displayImages(images, 'misc');

        // Fetch and display common faults and their resolution status for this vehicle
        const { data: vehicleFaults, error: faultsError } = await window.supabaseClient
            .from('vehicle_faults')
            .select('*, common_faults!inner(description)')
            .eq('listing_id', vehicleListing.id);

        if (faultsError) throw faultsError;

        console.log('Vehicle Faults:', vehicleFaults);

        displayFaults(vehicleFaults);

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
    const isAboveMarket = percentage > 0;
    const analysisText = `<span style="color: ${isAboveMarket ? 'red' : 'green'};">${percentage.toFixed(2)}% ${isAboveMarket ? 'Above Market Price' : 'Below Market Price'}</span>`;
    return `${analysisText}<br><span class="tooltip">It is important to take price factors into consideration when analyzing the vehicle's price. Some vehicles have more desirable options and therefore priced higher than the average market price</span>`;
}

function displayImages(images, type) {
    const container = document.getElementById(type);
    if (!container) return;  // Ensure the container exists
    container.innerHTML = '';  // Clear existing images
    images.filter(img => img.type === type).forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.url;
        imgElement.alt = `${type} Image`;
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', () => {
            document.querySelector('.main-image img').src = img.url;
        });
        container.appendChild(imgElement);
    });
}

function displayFaults(vehicleFaults) {
    const problemsTable = document.getElementById('common-problems');
    vehicleFaults.forEach(fault => {
        const row = problemsTable.insertRow();
        const descriptionCell = row.insertCell(0);
        const resolvedCell = row.insertCell(1);
        const detailsCell = row.insertCell(2);
        descriptionCell.textContent = fault.common_faults.description;
        resolvedCell.textContent = fault.resolved ? 'Resolved' : 'Unresolved';
        detailsCell.textContent = fault.details;
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
