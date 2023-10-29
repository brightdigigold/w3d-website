// components/CustomHead.js
import React from 'react';
import { Helmet } from 'react-helmet';

const CustomHead = ({ title }) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

export default CustomHead;