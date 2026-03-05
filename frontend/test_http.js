const data = JSON.stringify({
    name: "Test User",
    email: `test${Date.now()}@test.com`,
    password: "password123",
});

async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/json' }
        });
        const cookie = res.headers.get('set-cookie');

        const putData = JSON.stringify({
            shippingAddress: {
                address: '123 Fake St',
                city: 'Testville',
                postalCode: '12345',
                country: 'Testland'
            }
        });

        const res2 = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            body: putData,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie ? cookie.split(';')[0] : ''
            }
        });

        const text = await res2.text();
        console.log('Status:', res2.status);
        console.log('Body:', text);
    } catch (e) {
        console.error(e);
    }
}
run();
