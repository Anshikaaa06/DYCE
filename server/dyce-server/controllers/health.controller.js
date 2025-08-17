const checkHealth = async (req, res) => {
  try {
    // Here you can add any health checks you want, like checking database connection, etc.
    res.status(200).json({ success: true, message: "API is healthy!" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ success: false, message: "API is not healthy!" });
  }
};

module.exports = {
  checkHealth,
};
