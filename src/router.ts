import { Component, Vue } from "vue-property-decorator"
import { RouterOptions, Location, RouteConfig, Route } from 'vue-router'
import  VueRouter from 'vue-router'

import home from './components/posts.vue'
import post from './components/post_page.vue'

const router = new VueRouter({
  mode: 'history', base:'', //subdomain
  routes: [

    { path: '/', component: home },
    { path: '/:id', component: post },

    {
      path: '/auth/callback',
      component: {
        template: '<div class="auth-component"></div>'
      }
    },

   // { path: '/module/:compname' },
    { path: '*', redirect: '/' },

  ]
});
export default router
