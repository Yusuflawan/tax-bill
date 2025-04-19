document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#example tbody");

    // const agentId = localStorage.getItem("agentId");

    try {
        // Make GET request to fetch business owners
        const response = await fetch(`http://localhost:8080/tax-backend/admin/blacklist-businesses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners");
        }

        const result = await response.json();
        const businesses = result.data; // Access the 'data' array from the response

        // console.log(businesses);

        const dataTable = $(".display").DataTable();

        businesses.forEach((business, index) => {
            dataTable.row.add([
                index + 1,
                business.businessOwner || "N/A",
                business.businessName || "N/A",
                business.phone || "N/A",
                business.email || "N/A",
                business.address || "N/A",
                (business.firstName || "N/A") + " " +( business.lastName || "N/A"),
                business.createdAt || "N/A",
                business.reason || "N/A"
            ]).draw(false); // Add the row and redraw the table
        });

        console.log("Business owners loaded successfully");
    } catch (error) {
        console.error("Error fetching business owners:", error);
        // Optionally, display an error message to the user
    }
});