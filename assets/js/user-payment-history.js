document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId"); // Get user ID from localStorage

    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    try {
        // Make GET request to fetch payment history
        const response = await fetch(`http://localhost:8080/tax-backend/user/payment-history/${userId}`, {
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
        paymentHistory.forEach((payment) => {
            dataTable.row.add([
                payment.id || "N/A",
                payment.paidOn || "N/A",
                payment.noticeId || "N/A",
                payment.amount || "N/A",
                `<span class="btn light btn-success btn-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.50912 14.5C5.25012 14.5 4.99413 14.4005 4.80013 14.2065L1.79362 11.2C1.40213 10.809 1.40213 10.174 1.79362 9.78302C2.18512 9.39152 2.81913 9.39152 3.21063 9.78302L5.62812 12.2005L12.9306 7.18802C13.3866 6.87502 14.0106 6.99102 14.3236 7.44702C14.6371 7.90352 14.5211 8.52702 14.0646 8.84052L6.07613 14.324C5.90363 14.442 5.70612 14.5 5.50912 14.5Z" fill="#1EBA62"/>
                        <path d="M5.50912 8.98807C5.25012 8.98807 4.99413 8.88857 4.80013 8.69457L1.79362 5.68807C1.40213 5.29657 1.40213 4.66207 1.79362 4.27107C2.18512 3.87957 2.81913 3.87957 3.21063 4.27107L5.62812 6.68857L12.9306 1.67607C13.3866 1.36307 14.0106 1.47907 14.3236 1.93507C14.6371 2.39157 14.5211 3.01507 14.0646 3.32857L6.07613 8.81257C5.90363 8.93057 5.70612 8.98807 5.50912 8.98807Z" fill="#1EBA62"/>
                    </svg>
                    ${payment.amount || "N/A"}
                </span>`,
            ]).draw(false); // Add the row and redraw the table
        });

        console.log("Payment history loaded successfully");
    } catch (error) {
        console.error("Error fetching payment history:", error);
        // Optionally, display an error message to the user
    }
});