const argon = require("argon2");
const { PrismaClient } = require("../generated/prisma/client.js");
const { sendAccountDeletedEmail } = require("../nodemailer/emails.js");

const prisma = new PrismaClient();

const updateSettings = async (req, res) => {
  try {
    const { userId } = req;
    const { theme, notifications, emailVisibility } = req.body;

    // First, check if user settings exist
    let userSettings = await prisma.settings.findUnique({
      where: { userId },
    });

    if (!userSettings) {
      // Create new settings if they don't exist
      userSettings = await prisma.settings.create({
        data: {
          userId,
          theme: theme || "LIGHT",
          notifications: notifications !== undefined ? notifications : true,
          emailVisibility:
            emailVisibility !== undefined ? emailVisibility : true,
        },
      });
    } else {
      // Update existing settings
      userSettings = await prisma.settings.update({
        where: { userId },
        data: {
          ...(theme && { theme }),
          ...(notifications !== undefined && { notifications }),
          ...(emailVisibility !== undefined && { emailVisibility }),
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: userSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

const getSettings = async (req, res) => {
  try {
    const { userId } = req;

    let userSettings = await prisma.settings.findUnique({
      where: { userId },
    });

    if (!userSettings) {
      // Create default settings if they don't exist
      userSettings = await prisma.settings.create({
        data: {
          userId,
          theme: "LIGHT",
          notifications: true,
          emailVisibility: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      settings: userSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await argon.verify(
      user.password,
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await argon.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// const changeEmail = async (req, res) => {
//   try {
//     const { userId } = req;
//     const { newEmail, password } = req.body;
//     if (!newEmail || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "New email and password are required",
//       });
//     }
//     // Get user
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     // Verify password
//     const isPasswordValid = await argon.verify(user.password, password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Password is incorrect",
//       });
//     }
//     // Update email
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { email: newEmail },
//       select: {
//         id: true,
//         email: true,
//       },
//     });
//     res.status(200).json({
//       success: true,
//       message: "Email updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error changing email:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to change email",
//     });
//   }
// };

const toggleNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const { notifications } = req.body;

    if (notifications === undefined) {
      return res.status(400).json({
        success: false,
        message: "Notifications setting is required",
      });
    }

    // Update or create settings
    const userSettings = await prisma.settings.upsert({
      where: { userId },
      update: { notifications },
      create: {
        userId,
        notifications,
        theme: "LIGHT",
        emailVisibility: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Notifications ${
        notifications ? "enabled" : "disabled"
      } successfully`,
      settings: userSettings,
    });
  } catch (error) {
    console.error("Error toggling notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification settings",
    });
  }
};

const toggleAnonymousComments = async (req, res) => {
  try {
    const { userId } = req;
    const { allowComments } = req.body;

    if (allowComments === undefined) {
      return res.status(400).json({
        success: false,
        message: "Allow comments setting is required",
      });
    }

    // Update user's allowComments field
    const user = await prisma.user.update({
      where: { id: userId },
      data: { allowComments },
      select: {
        id: true,
        allowComments: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Anonymous comments ${
        allowComments ? "enabled" : "disabled"
      } successfully`,
      user: user,
    });
  } catch (error) {
    console.error("Error toggling anonymous comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update anonymous comments setting",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { userId } = req;
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password confirmation is required",
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isPasswordValid = await argon.verify(user.password, confirmPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Delete user data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete related data first
      await tx.settings.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.comment.deleteMany({ where: { commenterId: userId } });
      await tx.comment.deleteMany({ where: { userId } });
      await tx.chat.deleteMany({ where: { senderId: userId } });
      await tx.chat.deleteMany({ where: { receiverId: userId } });
      await tx.like.deleteMany({ where: { likerId: userId } });
      await tx.like.deleteMany({ where: { likedId: userId } });
      await tx.match.deleteMany({ where: { user1Id: userId } });
      await tx.match.deleteMany({ where: { user2Id: userId } });
      await tx.blindDate.deleteMany({ where: { initiatorId: userId } });
      await tx.blindDate.deleteMany({ where: { receiverId: userId } });
      await tx.photo.deleteMany({ where: { userId } });

      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });

    // Send account deleted email
    try {
      await sendAccountDeletedEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Error sending account deleted email:", emailError);
      // Don't fail the request if email fails
    }

    // Clear cookie
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

module.exports = {
  updateSettings,
  getSettings,
  changePassword,
  toggleNotifications,
  toggleAnonymousComments,
  deleteAccount,
};
