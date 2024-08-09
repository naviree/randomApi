import sqlite3 from "sqlite3";

async function getData() {
	const type = "beers";
	const url = `https://random-data-api.com/api/v2/${type}`;

	let params = new URLSearchParams();
	params.set("size", 100);

	try {
		const response = await fetch(`${url}?${params.toString()}`);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("There was a problem with your fetch operation:", error);
	}
}

async function addToDatabase(data) {
	// Ensure data is an array
	if (!Array.isArray(data)) {
		data = [data];
	}

	// Connect to the SQLite3 database
	const db = new sqlite3.Database("example.db");

	// Create a table (if necessary)
	db.serialize(() => {
		db.run(
			"CREATE TABLE IF NOT EXISTS api_data (id INTEGER PRIMARY KEY, uid TEXT, brand TEXT, name TEXT, style TEXT, hop TEXT, yeast TEXT, malts TEXT, ibu TEXT, alcohol TEXT, blg TEXT)"
		);

		// Insert data into the database
		const stmt = db.prepare(
			"INSERT INTO api_data (uid, brand, name, style, hop, yeast, malts, ibu, alcohol, blg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
		);
		data.forEach((item) => {
			stmt.run(
				item.uid,
				item.brand,
				item.name,
				item.style,
				item.hop,
				item.yeast,
				item.malts,
				item.ibu,
				item.alcohol,
				item.blg
			);
		});
		stmt.finalize();

		// Close the database connection
		db.close();
	});
}

async function main() {
	const data = await getData();
	if (data) {
		await addToDatabase(data);
		console.log("Data added to the SQLite3 database successfully.");
	}
}

// Call the main function
main();
