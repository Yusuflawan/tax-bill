document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#example6 tbody"); // Select the table body

    try {
        // Make GET request to fetch business owners
        const response = await fetch("http://localhost:8080/tax-backend/admin/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business owners");
        }

        const result = await response.json();
        const users = result.data; // Access the 'data' array from the response

        // console.log(users);

        // Populate the table with the business owners data
        users.forEach((user, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="whitesp-no p-0">
                    <div class="py-sm-3 py-1">
                        <div>
                            <h6 class="font-w500 fs-15 mb-0">${user.firstName} ${user.lastName || ""}</h6>
                            <span class="fs-14 font-w400">${user.email || "N/A"}</span>
                        </div>												
                    </div>
                </td>
                <td>${user.tin || "N/A"}</td> <!-- TIN -->
                <td>${user.createdAt || "N/A"}</td>
                <td>
                    <span class="btn light btn-${user.status === "active" ? "success" : "danger"} btn-sm">
                        ${user.status || "N/A"}
                    </span>
                </td> <!-- Status -->
                <td>${user.agent || "None"}</td>
                <td>
                    <button type="button" class="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#taxPayerInfo">
                        View
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        console.log("Business owners loaded successfully");
    } catch (error) {
        console.error("Error fetching business owners:", error);
        // Optionally, display an error message to the user
    }
});