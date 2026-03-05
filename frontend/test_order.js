const data = {
    orderItems: [
        {
            name: "Test item",
            qty: 1,
            image: "test.jpg",
            price: 100,
            _id: "60dfddfdfdfdfdfdfdfdfdfd", // Some dummy product ID
            vendor: { _id: "60dfddfdfdfdfdfdfdfdfdfc", name: "Vendor" }
        }
    ],
    shippingAddress: {
        address: "123 Test",
        city: "Testville",
        postalCode: "12345",
        country: "India"
    },
    paymentMethod: "Razorpay"
};

async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name: "User", email: `test${Date.now()}@t.com`, password: "pwd" }),
            headers: { 'Content-Type': 'application/json' }
        });
        const cookie = res.headers.get('set-cookie');

        const res2 = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie ? cookie.split(';')[0] : ''
            }
        });

        const text = await res2.text();
        console.log('--- OUTPUT ---');
        console.log(text);
        console.log('--------------');
    } catch (e) {
        console.error(e);
    }
}
run();
