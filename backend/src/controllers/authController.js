const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Token expires in 15 minutes
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000;

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
      isVerified: false,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires,
    });

    // Verification URL
    const verificationURL =
      `http://localhost:5173/verify-email/${verificationToken}`;

    // Email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        
        <h2>Verify Your Email</h2>

        <p>Hello ${user.name},</p>

        <p>
          Thanks for creating an account.
          Please verify your email address to activate your account.
        </p>

        <a
          href="${verificationURL}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Verify Email
        </a>

        <p style="margin-top: 20px; color: #666;">
          This verification link will expire in 15 minutes.
        </p>

        <p style="color: #666;">
          If you didn't create this account, you can safely ignore this email.
        </p>

      </div>
    `;

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html,
    });

    res.status(201).json({
      message:
        "Account created successfully. Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Make sure this is a local account
    if (user.provider !== "local") {
      return res.status(400).json({
        message: `This account uses ${user.provider} login`,
      });
    }

    if (!user.isVerified) {
        return res.status(403).json({
            message: "Please verify your email before logging in",
        });
    }

    // 4. Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id);

    // 6. Store JWT in HTTP-only cookie
    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Send response
    res.status(200).json({
    message: "Login successful",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        isVerified: user.isVerified,
    },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }

  
};


const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        provider: req.user.provider,
        isVerified: req.user.isVerified,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    // Don't reveal whether the email exists
    if (!user || user.provider !== "local") {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link will be sent.",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store hashed token in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token expires in 15 minutes
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset Your Password</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetURL}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 20px; color: #666;">
          This link will expire in 15 minutes.
        </p>

        <p style="color: #666;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });

    res.status(200).json({
      message:
        "If an account exists with this email, a password reset link will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // Remove reset token so it cannot be reused
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    // Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with a valid, non-expired token
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired",
      });
    }

    // Verify email
    user.isVerified = true;

    // Remove token so it cannot be reused
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    // Don't reveal whether the account exists
    if (!user) {
      return res.status(200).json({
        message:
          "If the account exists, a verification email will be sent.",
      });
    }

    if (user.provider !== "local") {
      return res.status(400).json({
        message: `This account uses ${user.provider} login.`,
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Your email is already verified.",
      });
    }

    // Generate a new verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token before storing
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.verificationToken = hashedVerificationToken;

    // New token expires in 15 minutes
    user.verificationTokenExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    // Create verification URL
    const verificationURL =
      `http://localhost:5173/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2>Verify Your Email</h2>

        <p>Hello ${user.name},</p>

        <p>
          Here is your new email verification link.
        </p>

        <a
          href="${verificationURL}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Verify Email
        </a>

        <p style="margin-top: 20px; color: #666;">
          This link will expire in 15 minutes.
        </p>

      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html,
    });

    res.status(200).json({
      message:
        "If the account exists, a verification email will be sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};