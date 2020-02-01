import React from 'react';
import Layout from '../../components/dev-hub/layout';

export default ({ ...data }) => {
  console.log(data);
  return (
    <Layout>
      <h1>dev hub</h1>
    </Layout>
  );
};
