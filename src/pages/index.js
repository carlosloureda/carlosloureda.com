import * as React from "react";

import SEO from "components/seo";
import Layout from "components/layout";
import Hero from "components/big-hero";
import theme from "../../config/theme";

const IndexPage = () => {
  return (
    <Layout headerColor={theme.colors.white} logo={false} hero={<Hero />}>
      <SEO />
    </Layout>
  );
};

export default IndexPage;
