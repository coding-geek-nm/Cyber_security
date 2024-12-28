import React, { useState } from "react";
import axios from "axios";

const Homepage = () => {
  const [formData, setFormData] = useState({
    Name: "",
    election_id: "",
    phone_no: "",
    email: "",
    party_name: "",  // Corrected field name to match the backend
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/form/submit", formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: "'Roboto', Arial, sans-serif",
      backgroundImage: "url('https://img.freepik.com/free-vector/vote-indian-election-background-with-india-map-design_1017-50103.jpg')",
      backgroundRepeat: "repeat",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    title: {
      fontSize: "24px",
      color: "#333",
      fontWeight: "bold",
      marginBottom: "20px",
      borderBottom: "2px solid #004085",
      paddingBottom: "10px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    formGroup: {
      marginBottom: "15px",
      textAlign: "left",
    },
    label: {
      fontSize: "16px",
      color: "#004085",
      fontWeight: "600",
      marginBottom: "5px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxSizing: "border-box",
    },
    button: {
      backgroundColor: "#004085",
      color: "white",
      padding: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      textTransform: "uppercase",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },
    message: {
      marginTop: "20px",
      fontSize: "16px",
      color: "green",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Election Form</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="Name" style={styles.label}>Name:</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="election_id" style={styles.label}>Election ID Number:</label>
            <input
              type="text"
              id="election_id"
              name="election_id"
              value={formData.election_id}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="phone_no" style={styles.label}>Phone Number:</label>
            <input
              type="tel"
              id="phone_no"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email ID:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="party_name" style={styles.label}>Party</label>
            <input
              type="text"
              id="party_name"
              name="party_name"  // Corrected field name to match the backend
              value={formData.party_name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Submit</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Homepage;
