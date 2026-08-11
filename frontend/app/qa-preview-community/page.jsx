"use client";

import React from "react";
import { AuthContext } from "@/context/AuthContext";
import Community from "@/Components/DevReviewLayout/Community";

const mockUser = {
  name: "Ava Chen",
  username: "ava_dev",
  email: "ava.chen@example.com",
  profileImage: null,
};

export default function QAPreviewCommunity() {
  return (
    <AuthContext.Provider value={{ user: mockUser, setUser: () => {}, loading: false, logout: () => {}, initialized: true, fetchUser: () => {} }}>
      <Community />
    </AuthContext.Provider>
  );
}
