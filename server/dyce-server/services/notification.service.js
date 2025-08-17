const { Novu } = require("@novu/api");

const novu = new Novu({ secretKey: process.env.NOVU_SECRET_KEY });

 const triggerNotification = async (userId, title,content) => {
  try {
    await novu.trigger({
      to: {
        subscriberId: userId,
      },
      payload: {
        title: title,
        content: content,
      },
      workflowId: "notifications",
    });
  } catch (error) {
    console.error("Error triggering notification:", error);
  }
};

module.exports = {
  triggerNotification,
};