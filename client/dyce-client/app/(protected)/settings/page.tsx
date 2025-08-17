"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Lock,
  Bell,
  MessageSquare,
  LogOut,
  Trash2,
  Shield,
  HelpCircle,
  ChevronRight,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "sonner";
import { axiosClient } from "@/lib/axios-client";
import { useAuthStore } from "@/stores/auth-store";
import InputModal from "@/components/InputModal";

const SettingsPage = () => {
  // const [settings, setSettings] = useState({
  //   allowAnonymousComments: true,
  //   pushNotifications: true,
  //   matchNotifications: true,
  //   messageNotifications: true,
  //   likeNotifications: false,
  // });
  const [allowAnonymousComments, setAllowAnonymousComments] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  // const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({
    password: "",
    showPassword: false,
  });

  const router = useRouter();
  const { logout, isLoading: logoutLoading } = useAuthStore();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  // const [emailForm, setEmailForm] = useState({
  //   newEmail: "",
  //   password: "",
  //   showPassword: false,
  // });

  // const toggleSetting = (key: keyof typeof settings) => {
  //   setSettings((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const resp = await axiosClient.put("/settings/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (resp.status === 200) {
        toast.success("Password changed successfully! 🔐");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });
    }
  };

  // const handleEmailChange = () => {
  //   // Handle email change logic here
  //   setShowEmailModal(false);
  //   setEmailForm({
  //     newEmail: "",
  //     password: "",
  //     showPassword: false,
  //   });
  //   alert(
  //     "Email change request sent! Check your new email for verification. 📧"
  //   );
  // };

  const handleLogout = async () => {
    try {
      await logout();
      if (!logoutLoading) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!deleteFormData.password) {
        toast.error("Please enter your password to confirm account deletion.");
        return;
      }
      const resp = await axiosClient.delete("/settings/delete-account", {
        data: {
          confirmPassword: deleteFormData.password,
        },
      });

      if (resp.status === 200) {
        toast.success(
          "Account deleted successfully. We're sad to see you go! 💔"
        );
        window.location.href = "/";
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setDeleteFormData({
        password: "",
        showPassword: false,
      });
    }
  };

  const handleUpdateAnonymousComments = async (value: boolean) => {
    try {
      setAllowAnonymousComments(value);
      await axiosClient.put("/settings/anonymous-comments", {
        allowComments: value,
      });
    } catch (error) {
      console.error("Error updating anonymous comments:", error);
      toast.error("Failed to update anonymous comments. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Header */}
      <div className="p-4 border-b border-light/10">
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-light/10 rounded-full transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-light/70" />
          </button>
          <h1 className="font-serif text-2xl text-primary">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Settings */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden">
          <div className="p-6 border-b border-light/10">
            <h2 className="font-sans font-bold text-lg text-light mb-1">
              Account Settings
            </h2>
            <p className="text-light/60 text-sm">
              Manage your account security and details
            </p>
          </div>

          <div className="divide-y divide-light/10">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-6 flex items-center gap-4 hover:bg-light/5 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-light">🔐 Change Password</h3>
                <p className="text-light/60 text-sm">
                  Update your account password
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-light/40" />
            </button>

            {/* <button
              onClick={() => setShowEmailModal(true)}
              className="w-full p-6 flex items-center gap-4 hover:bg-light/5 transition-colors"
            >
              <div className="w-10 h-10 bg-accent/20 rounded-2xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-light">
                  📧 Change College Email
                </h3>
                <p className="text-light/60 text-sm">
                  Update your verified college email
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-light/40" />
            </button> */}
          </div>
        </div>

        {/* Privacy Preferences */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden">
          <div className="p-6 border-b border-light/10">
            <h2 className="font-sans font-bold text-lg text-light mb-1">
              Privacy Preferences
            </h2>
            <p className="text-light/60 text-sm">
              Control who can interact with you and how
            </p>
          </div>

          <div className="divide-y divide-light/10">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emotional/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emotional" />
                </div>
                <div>
                  <h3 className="font-medium text-light">
                    🙈 Allow Anonymous Comments
                  </h3>
                  <p className="text-light/60 text-sm">
                    Let others leave anonymous feedback on your profile
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleUpdateAnonymousComments(!allowAnonymousComments);
                }}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  allowAnonymousComments ? "bg-primary" : "bg-light/20"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                    allowAnonymousComments ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-light">
                    🔕 Push Notifications
                  </h3>
                  <p className="text-light/60 text-sm">
                    Get notified about matches, messages, and likes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications((prev) => !prev)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  pushNotifications ? "bg-primary" : "bg-light/20"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                    pushNotifications ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Details */}
        {/* {settings.pushNotifications && (
          <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden">
            <div className="p-6 border-b border-light/10">
              <h2 className="font-sans font-bold text-lg text-light mb-1">
                Notification Types
              </h2>
              <p className="text-light/60 text-sm">
                Choose what you want to be notified about
              </p>
            </div>

            <div className="divide-y divide-light/10">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light">💜 New Matches</h3>
                  <p className="text-light/60 text-sm">
                    When someone matches with you
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("matchNotifications")}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.matchNotifications ? "bg-primary" : "bg-light/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.matchNotifications ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light">💬 New Messages</h3>
                  <p className="text-light/60 text-sm">
                    When you receive a new message
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("messageNotifications")}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.messageNotifications ? "bg-primary" : "bg-light/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.messageNotifications ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-light">❤️ Profile Likes</h3>
                  <p className="text-light/60 text-sm">
                    When someone likes your profile
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("likeNotifications")}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.likeNotifications ? "bg-primary" : "bg-light/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                      settings.likeNotifications ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* App Controls */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden">
          <div className="p-6 border-b border-light/10">
            <h2 className="font-sans font-bold text-lg text-light mb-1">
              App Controls
            </h2>
            <p className="text-light/60 text-sm">Manage your DYCE experience</p>
          </div>

          <div className="divide-y divide-light/10">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full p-6 flex items-center gap-4 hover:bg-emotional/5 transition-colors"
            >
              <div className="w-10 h-10 bg-emotional/20 rounded-2xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-emotional" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-emotional">🚪 Log Out</h3>
                <p className="text-light/60 text-sm">
                  Sign out of your DYCE account
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-light/40" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full p-6 flex items-center gap-4 hover:bg-red-500/5 transition-colors"
            >
              <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-red-400">
                  ❌ Delete My Account
                </h3>
                <p className="text-light/60 text-sm">
                  Permanently remove your account and data
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-light/40" />
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 overflow-hidden">
          <div className="p-6 border-b border-light/10">
            <h2 className="font-sans font-bold text-lg text-light mb-1">
              Help & Support
            </h2>
            <p className="text-light/60 text-sm">Get help when you need it</p>
          </div>

          <div className="divide-y divide-light/10">
            <button className="w-full p-6 flex items-center gap-4 hover:bg-light/5 transition-colors">
              <div className="w-10 h-10 bg-accent/20 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-light">❓ Help Center</h3>
                <p className="text-light/60 text-sm">
                  Find answers to common questions
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-light/40" />
            </button>

            <button className="w-full p-6 flex items-center gap-4 hover:bg-light/5 transition-colors">
              <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-light">🛡️ Safety & Privacy</h3>
                <p className="text-light/60 text-sm">
                  Learn about our safety features
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-light/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <InputModal
        title="Change Password"
        description="Keep your account secure with a strong password"
        btnLabel="Update Password"
        handleSubmit={handlePasswordChange}
        disabled={
          !passwordForm.currentPassword ||
          !passwordForm.newPassword ||
          !passwordForm.confirmPassword
        }
        classNameActive={
          passwordForm.currentPassword &&
          passwordForm.newPassword &&
          passwordForm.confirmPassword
        }
        setShowModal={setShowPasswordModal}
        showModal={showPasswordModal}
      >
        <PasswordInput
          label="Current Password"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
          isPasswordVisible={passwordForm.showCurrentPassword}
          onShowPasswordToggle={() =>
            setPasswordForm((prev) => ({
              ...prev,
              showCurrentPassword: !prev.showCurrentPassword,
            }))
          }
          placeholder="Enter current password"
        />
        <PasswordInput
          label="New Password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              newPassword: e.target.value,
            }))
          }
          isPasswordVisible={passwordForm.showNewPassword}
          onShowPasswordToggle={() =>
            setPasswordForm((prev) => ({
              ...prev,
              showNewPassword: !prev.showNewPassword,
            }))
          }
          placeholder="Enter new password"
        />
        <PasswordInput
          label="Confirm New Password"
          value={passwordForm.confirmPassword}
          onChange={(e) =>
            setPasswordForm((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          isPasswordVisible={passwordForm.showConfirmPassword}
          onShowPasswordToggle={() =>
            setPasswordForm((prev) => ({
              ...prev,
              showConfirmPassword: !prev.showConfirmPassword,
            }))
          }
          placeholder="Confirm new password"
        />

        {passwordForm.newPassword !== passwordForm.confirmPassword && (
          <p className="text-red-500 text-sm mt-2">
            Passwords do not match. Please try again.
          </p>
        )}
      </InputModal>

      {/* Email Change Modal */}
      {/* <InputModal
        title="Change College Email"
        description="Update your verified college email address"
        btnLabel="Update Email"
        handleSubmit={handleEmailChange}
        disabled={!emailForm.newEmail || !emailForm.password}
        classNameActive={emailForm.newEmail && emailForm.password}
        setShowModal={setShowEmailModal}
        showModal={showEmailModal}
      >
        <TextInput
          label="New College Email"
          type="email"
          value={emailForm.newEmail}
          onChange={(e) =>
            setEmailForm((prev) => ({
              ...prev,
              newEmail: e.target.value,
            }))
          }
        />
        <PasswordInput
          label="Confirm Password"
          value={emailForm.password}
          onChange={(e) =>
            setEmailForm((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          isPasswordVisible={emailForm.showPassword}
          onShowPasswordToggle={() =>
            setEmailForm((prev) => ({
              ...prev,
              showPassword: !prev.showPassword,
            }))
          }
        />
      </InputModal> */}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emotional/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-emotional" />
              </div>
              <h2 className="font-serif text-xl text-light mb-2">Log Out?</h2>
              <p className="text-light/70 text-sm mb-6">
                Are you sure you want to log out of DYCE? You&apos;ll need to
                sign in again to continue vibing.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded font-medium hover:bg-light/20 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 bg-emotional rounded-2xl text-white font-rounded font-medium hover:bg-emotional/80 transition-colors"
                >
                  Log Out{" "}
                  {logoutLoading && (
                    <Loader className="w-4 h-4 animate-spin inline-block" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-light/5 backdrop-blur-sm rounded-3xl border border-light/10 max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="font-serif text-xl text-light mb-2">
                Delete Account?
              </h2>
              <p className="text-light/70 text-sm mb-6">
                This action cannot be undone. All your matches, messages, and
                profile data will be permanently deleted.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                <p className="text-red-400 text-sm font-medium">
                  ⚠️ This will permanently delete your account
                </p>
              </div>
              <PasswordInput
                label="Confirm Password"
                value={deleteFormData.password}
                onChange={(e) =>
                  setDeleteFormData({
                    ...deleteFormData,
                    password: e.target.value,
                  })
                }
                isPasswordVisible={deleteFormData.showPassword}
                onShowPasswordToggle={() =>
                  setDeleteFormData({
                    ...deleteFormData,
                    showPassword: !deleteFormData.showPassword,
                  })
                }
                placeholder="Enter your password to confirm"
              />

              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded font-medium hover:bg-light/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-red-500 rounded-2xl text-white font-rounded font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
