document.addEventListener("DOMContentLoaded", async () => {
    const agentId = localStorage.getItem("agentId"); // Get agent ID from localStorage

    if (!agentId) {
        console.error("Agent ID not found in localStorage");
        return;
    }

    try {
        // Make GET request to fetch payment history
        const response = await fetch(`http://localhost:8080/tax-backend/agent/${agentId}/payment-history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payment history");
        }

        const result = await response.json();
        const paymentHistory = result.data; // Access the 'data' array from the response

        console.log(paymentHistory);

        // Initialize DataTable
        const dataTable = $(".display").DataTable();

        // Populate the table with the payment history data
        paymentHistory.forEach((payment, index) => {
            dataTable.row.add([
                index + 1, // Add the index (row number), starting from 1
                `${payment.firstName} ${payment.lastName}` || "N/A", // Full Name
                payment.TIN || "N/A", // Taxpayer Identification Number
                payment.amount || "N/A", // Payment Amount
                payment.paymentMethod || "N/A", // Payment Method
                payment.paidOn || "N/A", // Payment Date
                payment.noticeId || "N/A", // Notice ID
                payment.status || "N/A", // Payment Status
            ]).draw(false); // Add the row and redraw the table
        });

        console.log("Payment history loaded successfully");
    } catch (error) {
        console.error("Error fetching payment history:", error);
        // Optionally, display an error message to the user
    }
});