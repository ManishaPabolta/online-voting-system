const apiDocumentation = {
  title: "Online Voting System API",
  version: "1.0.0",
  description:
    "Secure Online Voting System Backend APIs",

  routes: [
    {
      method: "POST",
      endpoint: "/api/auth/register",
      description: "Register new user",
    },

    {
      method: "POST",
      endpoint: "/api/auth/verify-otp",
      description: "Verify OTP",
    },

    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Login user",
    },

    {
      method: "GET",
      endpoint: "/api/auth/me",
      description: "Get current user profile",
    },

    {
      method: "POST",
      endpoint: "/api/profile/create",
      description: "Create voter profile",
    },

    {
      method: "GET",
      endpoint: "/api/profile/me",
      description: "Get voter profile",
    },

    {
      method: "POST",
      endpoint: "/api/elections/create",
      description: "Create election",
    },

    {
      method: "GET",
      endpoint: "/api/elections",
      description: "Get all elections",
    },

    {
      method: "GET",
      endpoint: "/api/elections/:id",
      description: "Get single election",
    },

    {
      method: "POST",
      endpoint: "/api/candidates/create",
      description: "Create candidate",
    },

    {
      method: "GET",
      endpoint: "/api/candidates",
      description: "Get all candidates",
    },

    {
      method: "POST",
      endpoint: "/api/vote/cast",
      description: "Cast vote",
    },

    {
      method: "GET",
      endpoint: "/api/vote/status",
      description: "Get vote status",
    },

    {
      method: "POST",
      endpoint: "/api/link/generate",
      description: "Generate voting link",
    },

    {
      method: "POST",
      endpoint: "/api/location/capture",
      description: "Capture user location",
    },

    {
      method: "POST",
      endpoint: "/api/face/verify",
      description: "Verify user face",
    },

    {
      method: "GET",
      endpoint: "/api/report",
      description: "Generate reports",
    },

    {
      method: "POST",
      endpoint: "/api/feedback",
      description: "Submit feedback",
    },

    {
      method: "GET",
      endpoint: "/api/faqs",
      description: "Get FAQs",
    },

    {
      method: "POST",
      endpoint: "/api/support/chat",
      description: "Support chat",
    },

    {
      method: "GET",
      endpoint: "/api/notifications",
      description: "Get notifications",
    },
  ],
};

export default apiDocumentation;