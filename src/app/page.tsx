// pages/page.tsx
"use client";
import React from 'react';
import MainPage from './Home';
import { HomeProps } from './Home';

const Page: React.FC<HomeProps> = (props) => {
  return <MainPage {...props} />;
};

export default Page;
