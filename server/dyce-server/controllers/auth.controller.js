const argon = require("argon2");
const crypto = require("crypto");

const { generateTokenAndSetCookie } = require("../utils/utils.js");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../nodemailer/emails.js");
const { PrismaClient } = require('../generated/prisma/client.js');

const prisma = new PrismaClient();

const signup = async (req, res) => {
  const { email, password,name,college } = req.body;

  try {
    if (!email || !password || !name || !college) {
      throw new Error("All fields are required");
    }
    console.log(email, password, name);
    
    const userAlreadyExists = await prisma.user.findUnique({where: { email }});

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await argon.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        college,
        password: hashedPassword,
        otpCode: verificationToken,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
      }
    })

    generateTokenAndSetCookie(res, user.id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        otpCode: code,
        otpExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification code",
        });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        otpCode: null,         // Prisma uses `null`, not `undefined`
        otpExpiresAt: null,
      },
    });

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await argon.verify(user.password, password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: resetTokenExpiresAt,
      },
    });

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link sent to your email",
      });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token", expired:true });
    }

    // update password
    const hashedPassword = await argon.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null, // Prisma uses `null`, not `undefined`
        resetPasswordExpiresAt: null, // Prisma uses `null`, not `undefined`
      },
    });

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    })

    if (!user || !user.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
};
