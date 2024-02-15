import MyAccountTabs from "@/components/myAccount/tabs/tabs";
import RequireAuth from "@/components/requireAuth";

import React from "react";

const Profile = () => {
  return (
    <RequireAuth>
      <div className="bg-theme pt-20">
        <div className="mx-auto px-2 sm:px-6 lg:px-16 pb-28 xl:pb-8 py-8">
          <MyAccountTabs />
        </div>
      </div>
    </RequireAuth>
  );
};

export default Profile;
