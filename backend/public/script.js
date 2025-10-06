const form = document.getElementById("studentForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    // Relative URL (single origin deployment)
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (response.ok) {
      message.style.color = "#00ff41"; // hacker green
      message.textContent = res.message || "Student data saved successfully!";
      form.reset();
    } else {
      message.style.color = "#ff0033";
      message.textContent = res.error || "Failed to save student.";
    }
  } catch (error) {
    console.error(error);
    message.style.color = "#ff0033";
    message.textContent = "Error connecting to the server.";
  }
});
