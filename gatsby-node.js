const path = require("path");
const { URL } = require("url");
const slugify = require("@sindresorhus/slugify");
const { createFilePath } = require("gatsby-source-filesystem");
const stripMarkdownPlugin = require("strip-markdown");
const remark = require("remark");
const config = require("./config/website");

function stripMarkdown(markdownString) {
  return remark()
    .use(stripMarkdownPlugin)
    .processSync(markdownString)
    .toString();
}

const createPosts = (createPage, createRedirect, edges) => {
  edges.forEach(({ node }, i) => {
    const prev = i === 0 ? null : edges[i - 1].node;
    const next = i === edges.length - 1 ? null : edges[i + 1].node;
    const pagePath = node.fields.slug;

    if (node.fields.redirects) {
      node.fields.redirects.forEach((fromPath) => {
        createRedirect({
          fromPath,
          toPath: pagePath,
          redirectInBrowser: true,
          isPermanent: true,
        });
      });
    }

    createPage({
      path: pagePath,
      component: path.resolve(`./src/templates/post.js`),
      context: {
        id: node.id,
        prev,
        next,
      },
    });
  });
};

function createBlogPages({ data, actions }) {
  if (!data.edges.length) {
    throw new Error("There are no posts!");
  }
  const { edges } = data;
  const { createRedirect, createPage } = actions;
  createPosts(createPage, createRedirect, edges);
  return null;
}

const createPages = async ({ actions, graphql }) => {
  const { data, errors } = await graphql(`
    fragment PostDetails on Mdx {
      fileAbsolutePath
      id
      parent {
        ... on File {
          name
          sourceInstanceName
        }
      }
      excerpt(pruneLength: 250)
      fields {
        title
        slug
        description
        date
        redirects
      }
    }
    query {
      blog: allMdx(
        filter: {
          frontmatter: { published: { ne: false } }
          fileAbsolutePath: { regex: "//content/blog//" }
        }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            ...PostDetails
          }
        }
      }
    }
  `);

  if (errors) {
    return Promise.reject(errors);
  }

  const { blog } = data;

  createBlogPages({
    blogPath: "/blog",
    data: blog,
    actions,
  });
};

const onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
  });
};

const onCreateNode = (...args) => {
  if (args[0].node.internal.type === `Mdx`) {
    onCreateMdxNode(...args);
  }
};

// eslint-disable-next-line complexity
function onCreateMdxNode({ node, getNode, actions }) {
  const parentNode = getNode(node.parent);
  const { createNodeField } = actions;
  let slug =
    node.frontmatter.slug ||
    createFilePath({ node, getNode, basePath: `pages` });
  let { isWriting, isWorkshop, isScheduled, isPodcast } = false;

  if (node.fileAbsolutePath.includes("content/blog/")) {
    slug = `/blog/${node.frontmatter.slug || slugify(parentNode.name)}`;
  }

  if (node.fileAbsolutePath.includes("content/podcast/")) {
    slug = `chats-with-kent-podcast/seasons/${twoDigits(
      node.frontmatter.season
    )}/episodes/${node.frontmatter.slug}`;
    isPodcast = true;
  }

  if (node.fileAbsolutePath.includes("content/workshops/")) {
    isWriting = false;
    isWorkshop = true;
    isScheduled = false;
    if (node.frontmatter.date) {
      isWriting = false;
      isScheduled = true;
    }
    slug = `/workshops/${node.frontmatter.slug || slugify(node.frontmatter.title)
      }`;
  }

  if (node.fileAbsolutePath.includes("content/writing-blog/")) {
    isWriting = true;
    slug = `/writing/blog/${node.frontmatter.slug || slugify(parent.name)}`;
  }
  createNodeField({
    name: "id",
    node,
    value: node.id,
  });

  createNodeField({
    name: "published",
    node,
    value: node.frontmatter.published,
  });

  createNodeField({
    name: "title",
    node,
    value: node.frontmatter.title,
  });

  createNodeField({
    name: "author",
    node,
    value: node.frontmatter.author || "Carlos Loureda",
  });

  createNodeField({
    name: "description",
    node,
    value: node.frontmatter.description,
  });

  createNodeField({
    name: "plainTextDescription",
    node,
    value: stripMarkdown(node.frontmatter.description),
  });

  createNodeField({
    name: "slug",
    node,
    value: slug,
  });

  const productionUrl = new URL(config.siteUrl);
  productionUrl.pathname = slug;

  createNodeField({
    name: "productionUrl",
    node,
    value: productionUrl.toString(),
  });

  createNodeField({
    name: "date",
    node,
    value: node.frontmatter.date ? node.frontmatter.date.split(" ")[0] : "",
  });

  createNodeField({
    name: "banner",
    node,
    value: node.frontmatter.banner,
  });

  createNodeField({
    name: "bannerCredit",
    node,
    value: node.frontmatter.bannerCredit,
  });

  createNodeField({
    name: "categories",
    node,
    value: node.frontmatter.categories || [],
  });

  createNodeField({
    name: "keywords",
    node,
    value: node.frontmatter.keywords || [],
  });

  createNodeField({
    name: "redirects",
    node,
    value: node.frontmatter.redirects,
  });

  createNodeField({
    name: "editLink",
    node,
    value: `https://github.com/carlosloureda/carlosloureda.com/edit/main${node.fileAbsolutePath.replace(
      __dirname,
      ""
    )}`,
  });

  createNodeField({
    name: "historyLink",
    node,
    value: `https://github.com/carlosloureda/carlosloureda.com/commits/main${node.fileAbsolutePath.replace(
      __dirname,
      ""
    )}`,
  });

  createNodeField({
    name: "noFooter",
    node,
    value: isWriting ? false : node.frontmatter.noFooter || false,
  });

  createNodeField({
    name: "isWriting",
    node,
    value: isWriting,
  });

  createNodeField({
    name: "isWorkshop",
    node,
    value: isWorkshop,
  });

  createNodeField({
    name: "isScheduled",
    node,
    value: isScheduled,
  });

  createNodeField({
    name: "isPodcast",
    node,
    value: isPodcast,
  });
}

module.exports = {
  createPages,
  onCreateWebpackConfig,
  onCreateNode,
  //   onPreBootstrap,
  //   onPostBuild,
};
