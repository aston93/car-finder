const carOffers = [
    {
        id: 1,
        make: "Toyota",
        model: "Camry",
        year: 2023,
        price: 28500,
        mileage: "32 MPG",
        transmission: "Automatic",
        fuel: "Gasoline"
    },
    {
        id: 2,
        make: "Honda",
        model: "Civic",
        year: 2023,
        price: 24500,
        mileage: "35 MPG",
        transmission: "Manual",
        fuel: "Gasoline"
    },
    {
        id: 3,
        make: "Tesla",
        model: "Model 3",
        year: 2023,
        price: 42000,
        mileage: "120 MPGe",
        transmission: "Single Speed",
        fuel: "Electric"
    },
    {
        id: 4,
        make: "Ford",
        model: "Mustang",
        year: 2023,
        price: 35000,
        mileage: "28 MPG",
        transmission: "Automatic",
        fuel: "Gasoline"
    },
    {
        id: 5,
        make: "BMW",
        model: "3 Series",
        year: 2023,
        price: 45000,
        mileage: "30 MPG",
        transmission: "Automatic",
        fuel: "Gasoline"
    },
    {
        id: 6,
        make: "Audi",
        model: "A4",
        year: 2023,
        price: 43000,
        mileage: "29 MPG",
        transmission: "Automatic",
        fuel: "Gasoline"
    }
];

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
}

function createCarCard(car) {
    return `
        <div class="car-card">
            <div class="car-image">
                <span>${car.make} ${car.model} Image</span>
            </div>
            <div class="car-info">
                <h3>${car.year} ${car.make} ${car.model}</h3>
                <div class="car-price">${formatPrice(car.price)}</div>
                <div class="car-details">
                    <p><strong>Mileage:</strong> ${car.mileage}</p>
                    <p><strong>Transmission:</strong> ${car.transmission}</p>
                    <p><strong>Fuel:</strong> ${car.fuel}</p>
                </div>
                <button class="view-button" onclick="viewCarDetails(${car.id})">View Details</button>
            </div>
        </div>
    `;
}

function loadCarOffers() {
    const carGrid = document.getElementById('carGrid');
    if (carGrid) {
        carGrid.innerHTML = carOffers.map(car => createCarCard(car)).join('');
    }
}

function viewCarDetails(carId) {
    const car = carOffers.find(c => c.id === carId);
    if (car) {
        alert(`Car Details:\n\n${car.year} ${car.make} ${car.model}\nPrice: ${formatPrice(car.price)}\nMileage: ${car.mileage}\nTransmission: ${car.transmission}\nFuel Type: ${car.fuel}`);
    }
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCarOffers();
    
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });
    
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            smoothScroll('#offers');
        });
    }
});

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

if (!isProduction) {
    console.log('Running in development mode');
    
    window.debugCarOffers = function() {
        console.table(carOffers);
    };
} else {
    console.log('Running in production mode');
}