const apiDocumentation = {
  title: "Online Voting System API",
  version: "1.0.0",
  description:
    "Secure Online Voting System Backend APIs for authentication, voter verification, elections, candidates, voting, notifications and administration.",

  routes: [
    // =========================
    // AUTHENTICATION
    // =========================

    {
      method: "POST",
      endpoint: "/api/auth/register",
      description: "Register a new user account.",
      access: "Public",
    },

    {
      method: "POST",
      endpoint: "/api/auth/verify-otp",
      description: "Verify the registration OTP.",
      access: "Public",
    },

    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Login a verified user.",
      access: "Public",
    },

    {
      method: "GET",
      endpoint: "/api/auth/me",
      description: "Get the currently authenticated user's account details.",
      access: "Authenticated",
    },

    // =========================
    // USER MANAGEMENT
    // =========================

    {
      method: "GET",
      endpoint: "/api/users",
      description: "Get all users with optional search, role and status filters.",
      access: "Admin",
    },

    {
      method: "GET",
      endpoint: "/api/users/:id",
      description: "Get a specific user's details.",
      access: "Admin",
    },

    {
      method: "PATCH",
      endpoint: "/api/users/:id/status",
      description: "Block or unblock a user account.",
      access: "Admin",
    },

    {
      method: "DELETE",
      endpoint: "/api/users/:id",
      description: "Delete a user account.",
      access: "Admin",
    },

    // =========================
    // VOTER PROFILE
    // =========================

    {
      method: "POST",
      endpoint: "/api/profile",
      description: "Create a voter profile with voter information and ID proof.",
      access: "Authenticated",
    },

    {
      method: "GET",
      endpoint: "/api/profile/me",
      description: "Get the authenticated user's voter profile.",
      access: "Authenticated",
    },

    {
      method: "PUT",
      endpoint: "/api/profile",
      description: "Update the authenticated user's voter profile.",
      access: "Authenticated",
    },

    // =========================
    // ELECTIONS
    // =========================

    {
      method: "GET",
      endpoint: "/api/elections/public",
      description: "Get published elections available to the public.",
      access: "Public",
    },

    {
      method: "GET",
      endpoint: "/api/elections",
      description: "Get all elections including administrative election data.",
      access: "Admin",
    },

    {
      method: "GET",
      endpoint: "/api/elections/:id",
      description: "Get details of a specific election.",
      access: "Public",
    },

    {
      method: "POST",
      endpoint: "/api/elections",
      description: "Create a new election.",
      access: "Admin",
    },

    {
      method: "PUT",
      endpoint: "/api/elections/:id",
      description: "Update an election.",
      access: "Admin",
    },

    {
      method: "PATCH",
      endpoint: "/api/elections/:id/publish",
      description: "Publish an election.",
      access: "Admin",
    },

    {
      method: "PATCH",
      endpoint: "/api/elections/:id/cancel",
      description: "Cancel an election.",
      access: "Admin",
    },

    {
      method: "DELETE",
      endpoint: "/api/elections/:id",
      description: "Delete an election when deletion is permitted.",
      access: "Admin",
    },

    // =========================
    // CANDIDATES
    // =========================

    {
      method: "GET",
      endpoint: "/api/candidates",
      description: "Get candidates, optionally filtered by election.",
      access: "Public",
    },

    {
      method: "GET",
      endpoint: "/api/candidates/:id",
      description: "Get details of a specific candidate.",
      access: "Public",
    },

    {
      method: "POST",
      endpoint: "/api/candidates",
      description: "Create a candidate for an election.",
      access: "Admin",
    },

    {
      method: "PUT",
      endpoint: "/api/candidates/:id",
      description: "Update candidate information.",
      access: "Admin",
    },

    {
      method: "DELETE",
      endpoint: "/api/candidates/:id",
      description: "Delete a candidate when permitted.",
      access: "Admin",
    },

    // =========================
    // VOTING
    // =========================

    {
      method: "POST",
      endpoint: "/api/vote/cast",
      description:
        "Cast a vote after voter profile, voting password, location and election security checks.",
      access: "Authenticated Voter",
    },

    {
      method: "GET",
      endpoint: "/api/vote/status",
      description: "Get the authenticated user's voting history/status.",
      access: "Authenticated",
    },

    {
      method: "GET",
      endpoint: "/api/vote/status/:electionId",
      description: "Check whether the authenticated user has voted in a specific election.",
      access: "Authenticated",
    },

    {
      method: "GET",
      endpoint: "/api/vote/results/:id",
      description: "Get election results calculated from recorded votes.",
      access: "Public",
    },

    // =========================
    // NOTIFICATIONS
    // =========================

    {
      method: "GET",
      endpoint: "/api/notifications",
      description: "Get notifications for the authenticated user.",
      access: "Authenticated",
    },

    {
      method: "PATCH",
      endpoint: "/api/notifications/:id/read",
      description: "Mark a notification as read.",
      access: "Authenticated",
    },

    {
      method: "PATCH",
      endpoint: "/api/notifications/read-all",
      description: "Mark all notifications as read.",
      access: "Authenticated",
    },

    {
      method: "DELETE",
      endpoint: "/api/notifications/:id",
      description: "Delete an authenticated user's notification.",
      access: "Authenticated",
    },
  ],
};

export default apiDocumentation;