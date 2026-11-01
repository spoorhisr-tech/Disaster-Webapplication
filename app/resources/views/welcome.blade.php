<!DOCTYPE html>
<html>

<head>
    <title>Disaster Event Test</title>
</head>

<body>
    <h2>Create Disaster Event</h2>

    <form id="disasterForm">
        <label>Title:</label>
        <input name="title" value="Bengaluru Flood Test" required><br><br>

        <label>Slug:</label>
        <input name="slug" value="delete-test-001" required>
        <label>Type:</label>
        <input name="type" value="Flood" required><br><br>

        <label>Severity:</label>
        <input name="severity" value="high" required><br><br>

        <label>Status:</label>
        <input name="status" value="resolved" required>
        <label>Description:</label>
        <input name="description" value="Sample disaster event"><br><br>

        <label>Location:</label>
        <input name="location_name" value="Bengaluru" required><br><br>
        <label>Latitude:</label>
        <input name="latitude" type="number" step="any" value="12.9716" required>
        <br><br>

        <label>Longitude:</label>
        <input name="longitude" type="number" step="any" value="77.5946" required>
        <br><br>

        <label>Radius (km):</label>
        <input name="radius_km" type="number" step="any" value="5">
        <br><br>

        <label>Affected population:</label>
        <input name="affected_population" type="number" value="100"><br><br>

        <button type="submit">Create Event</button>
    </form>

    <pre id="result"></pre>

    <script>
        document.getElementById('disasterForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(this).entries());

            data.affected_population = Number(data.affected_population);
            data.latitude = Number(data.latitude);
            data.longitude = Number(data.longitude);
            data.radius_km = Number(data.radius_km);
            try {
                const response = await fetch('/api/disaster-events/4', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                document.getElementById('result').textContent =
                    'Status: ' + response.status + '\n' +
                    JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('result').textContent = error.message;
            }
        });
    </script>
</body>

</html>