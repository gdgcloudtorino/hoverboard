const settings = require('../data/settings.json');
const data = require('../docs/default-firebase-data.json');
const production = require('../config/production.json');
const convert = require('xml-js');
const fs = require('fs');

const generateMenuData = () => {
  const menuDatas = settings.navigation
  const baseUrl = production.url
  var ret = []
  for(var i = 0; i < menuDatas.length; i++) {
    var permalink = menuDatas[i].permalink
    while(permalink.charAt(0) === '/')
    {
        permalink = permalink.substr(1);
    }
    ret.push({
        loc: baseUrl+permalink,
        priority: 1,
        changefreq: 'weekly'
    })
  }
  return ret
};

const generateBlogData = () => {
    const blogDatas = data.blog
    const posts = Object.keys(blogDatas)
    const baseUrl = production.url
    var ret = []
    for(var i = 0; i < posts.length; i++) {
      var post = blogDatas[posts[i]]

      ret.push({
          loc: baseUrl+'blog/'+posts[i],
          lastmod: post.published,
          changefreq: 'monthly'
      })
    }
    return ret
  };


function sitemap() {
    let urls = [...generateMenuData(), ...generateBlogData() ]
    let sitemapJson = {
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "utf-8"
            }
        },
        urlset: {
            _attributes: {xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"},
            url: urls
        }
    }
    const xml = convert.json2xml(sitemapJson, 
        {
            compact: true, 
            ignoreComment: true, 
            spaces: 4
        })
    return fs.writeFile('dist/sitemap.xml', 
        xml,
        function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
}

sitemap();