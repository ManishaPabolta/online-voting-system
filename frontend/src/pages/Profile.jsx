import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import UserProfileCard from "../components/profile/UserProfileCard";

import ProfileForm from "../components/profile/ProfileForm";



import Loader from "../components/common/Loader";

import {
  getProfile,
} from "../api/profileApi";

const Profile = () => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const response =
          await getProfile();

        setUser(
          response.profile
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading)
    return <Loader />;

  return (
    <DashboardLayout>

      {user ? (
        <>
          <UserProfileCard
            user={user}
          />

          <ProfileForm
            user={user}
          />

        </>
      ) : (
        <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center">

          <h1 className="text-4xl font-bold">
            Complete Your Profile
          </h1>

          <p className="text-gray-400 mt-4">
            Your profile is not
            created yet. Please add
            your information.
          </p>

          <div className="mt-10">
            <ProfileForm />
          </div>

        </div>
      )}

    </DashboardLayout>
  );
};

export default Profile;